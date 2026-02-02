import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import AuthScreen from "./AuthScreen";
import OnboardingScreen from "./OnboardingScreen";
import App from "../App";

export default function AuthGate() {
  const [session, setSession] = useState(undefined); // undefined=loading, null=logged out
  const [profileReady, setProfileReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const sessionRef = useRef(null); // latest session for API calls without triggering re-renders
  const profileCheckedForRef = useRef(null); // user ID we already checked

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      sessionRef.current = session;
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const prevUserId = sessionRef.current?.user?.id || null;
        const newUserId = session?.user?.id || null;
        sessionRef.current = session;

        if (event === "SIGNED_OUT" || event === "SIGNED_IN" || newUserId !== prevUserId) {
          // Actual user change — reset and re-render
          profileCheckedForRef.current = null;
          setProfileReady(false);
          setNeedsOnboarding(false);
          setSession(session);
        }
        // Token refresh for same user — don't call setSession, no re-render needed
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    const userId = session.user.id;
    // Don't re-check if we already checked this exact user
    if (profileCheckedForRef.current === userId) return;
    profileCheckedForRef.current = userId;

    let cancelled = false;

    async function checkProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_completed_at")
        .eq("id", userId)
        .single();

      if (cancelled) return;

      if (error || !data?.onboarding_completed_at) {
        setNeedsOnboarding(true);
      } else {
        setProfileReady(true);
      }
    }

    checkProfile();
    return () => { cancelled = true; };
  }, [session]);

  const handleLogout = async () => {
    localStorage.removeItem("workout_tracker_v2");
    localStorage.removeItem("workout_tracker_v2_backup");
    await supabase.auth.signOut();
  };

  const handleOnboardingComplete = () => {
    setNeedsOnboarding(false);
    setProfileReady(true);
  };

  // 1. Auth loading
  if (session === undefined) {
    return (
      <div style={loadingStyle}>Loading...</div>
    );
  }

  // 2. Not logged in
  if (!session) {
    return <AuthScreen />;
  }

  // 3. Profile not yet checked
  if (!profileReady && !needsOnboarding) {
    return (
      <div style={loadingStyle}>Loading...</div>
    );
  }

  // 4. Needs onboarding
  if (needsOnboarding) {
    return <OnboardingScreen session={session} onComplete={handleOnboardingComplete} />;
  }

  // 5. Ready
  return <App session={session} onLogout={handleLogout} />;
}

const loadingStyle = {
  minHeight: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#0b0f14",
  color: "#64748b",
};
