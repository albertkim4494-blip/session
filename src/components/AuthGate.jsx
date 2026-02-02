import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import AuthScreen from "./AuthScreen";
import OnboardingScreen from "./OnboardingScreen";
import App from "../App";

export default function AuthGate() {
  const [session, setSession] = useState(undefined); // undefined=loading, null=logged out
  const [profileReady, setProfileReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const prevUserIdRef = useRef(null);
  const profileCheckedRef = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const newUserId = session?.user?.id || null;
        const userChanged = event === "SIGNED_OUT" || event === "SIGNED_IN" || newUserId !== prevUserIdRef.current;

        if (userChanged) {
          // Actual auth change — reset everything
          setSession(session);
          setProfileReady(false);
          setNeedsOnboarding(false);
          profileCheckedRef.current = false;
        } else {
          // Token refresh — update session silently, don't reset profile state
          setSession(session);
        }
        prevUserIdRef.current = newUserId;
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    // Don't re-check profile if we already checked for this user
    if (profileCheckedRef.current) return;

    let cancelled = false;

    async function checkProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_completed_at")
        .eq("id", session.user.id)
        .single();

      if (cancelled) return;

      profileCheckedRef.current = true;

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
