import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AuthScreen from "./AuthScreen";
import App from "../App";

export default function AuthGate() {
  const [session, setSession] = useState(undefined); // undefined=loading, null=logged out

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (session === undefined) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0f14", color: "#64748b" }}>
        Loading...
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return <App session={session} onLogout={handleLogout} />;
}
