import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Account deletion. The caller is identified from their own JWT (never a
// user id from the request body), then every trace of that user is removed
// with the service-role key, and finally the auth user itself is deleted.
// Deployed with --no-verify-jwt; we verify the token ourselves below.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const ANON = Deno.env.get("SUPABASE_ANON_KEY");
  if (!SUPABASE_URL || !SERVICE_ROLE || !ANON) {
    return json({ error: "Server not configured" }, 500);
  }

  // 1. Identify the caller from their JWT — never trust a body-supplied id.
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Missing authorization" }, 401);

  const userClient = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser(token);
  if (userErr || !userData?.user) return json({ error: "Invalid session" }, 401);
  const uid = userData.user.id;

  // 2. Service-role client bypasses RLS for the actual teardown.
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  const warnings: string[] = [];
  const del = async (label: string, run: () => Promise<{ error: unknown }>) => {
    try {
      const { error } = await run();
      if (error) warnings.push(`${label}: ${(error as { message?: string }).message ?? error}`);
    } catch (e) {
      warnings.push(`${label}: ${(e as Error).message ?? e}`);
    }
  };

  // 3. Delete rows in FK-safe order: children that reference profiles first,
  //    then state, then the profile row itself.
  await del("shared_workouts.from", () => admin.from("shared_workouts").delete().eq("from_user_id", uid));
  await del("shared_workouts.to", () => admin.from("shared_workouts").delete().eq("to_user_id", uid));
  await del("friendships.user_a", () => admin.from("friendships").delete().eq("user_a", uid));
  await del("friendships.user_b", () => admin.from("friendships").delete().eq("user_b", uid));
  await del("user_state_history", () => admin.from("user_state_history").delete().eq("user_id", uid));
  await del("user_state", () => admin.from("user_state").delete().eq("user_id", uid));
  await del("profiles", () => admin.from("profiles").delete().eq("id", uid));

  // 4. Delete the user's storage objects (paths are prefixed with the user id).
  for (const bucket of ["avatars", "exercise-images"]) {
    try {
      const { data: files } = await admin.storage.from(bucket).list(uid, { limit: 1000 });
      if (files && files.length) {
        const paths = files.map((f) => `${uid}/${f.name}`);
        const { error } = await admin.storage.from(bucket).remove(paths);
        if (error) warnings.push(`storage ${bucket}: ${error.message}`);
      }
    } catch (e) {
      warnings.push(`storage ${bucket}: ${(e as Error).message ?? e}`);
    }
  }

  // 5. Delete the auth user last (cascades anything still FK'd to auth.users).
  const { error: delErr } = await admin.auth.admin.deleteUser(uid);
  if (delErr) {
    return json({ error: `Failed to delete account: ${delErr.message}`, warnings }, 500);
  }

  return json({ success: true, warnings });
});
