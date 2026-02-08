import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { LS_KEY, LS_BACKUP_KEY } from "../lib/constants";
import AuthScreen from "./AuthScreen";
import OnboardingScreen from "./OnboardingScreen";
import App from "../App";

export default function AuthGate() {
  const [session, setSession] = useState(undefined); // undefined=loading, null=logged out
  const [profileReady, setProfileReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const sessionRef = useRef(null);
  const profileCheckedForRef = useRef(null);

  useEffect(() => {
    // getSession for initial load (INITIAL_SESSION may not exist in older supabase-js)
    supabase.auth.getSession().then(({ data: { session } }) => {
      sessionRef.current = session;
      setSession(session ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const prevUserId = sessionRef.current?.user?.id || null;
        const newUserId = session?.user?.id || null;
        sessionRef.current = session;

        if (event === "TOKEN_REFRESHED" && newUserId === prevUserId) {
          return; // same user token refresh — no re-render
        }

        if (newUserId !== prevUserId) {
          profileCheckedForRef.current = null;
          setProfileReady(false);
          setNeedsOnboarding(false);
        }
        setSession(session ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    const userId = session.user.id;
    // Already successfully checked this user — skip
    if (profileCheckedForRef.current === userId) return;

    let cancelled = false;

    async function checkProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_completed_at")
        .eq("id", userId)
        .single();

      if (cancelled) return;

      // Only set the guard AFTER successful completion
      profileCheckedForRef.current = userId;

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
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(LS_BACKUP_KEY);
    await supabase.auth.signOut();
  };

  const [showGenerateWizard, setShowGenerateWizard] = useState(false);

  const handleOnboardingComplete = () => {
    setNeedsOnboarding(false);
    setProfileReady(true);
    setShowGenerateWizard(true);
    profileCheckedForRef.current = session?.user?.id || null;
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
  return <App session={session} onLogout={handleLogout} showGenerateWizard={showGenerateWizard} onGenerateWizardShown={() => setShowGenerateWizard(false)} />;
}

const loadingStyle = {
  minHeight: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#0b0f14",
  color: "#64748b",
};
