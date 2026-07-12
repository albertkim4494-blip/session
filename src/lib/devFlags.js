// devFlags.js — compile-time gate for developer-only tooling.
//
// DEV_TOOLS_ENABLED is true in local dev (`npm run dev`), or in a build that
// explicitly opts in with VITE_ENABLE_DEV_TOOLS=true. A normal production
// release build (env unset) has it FALSE, so anything gated on it — notably the
// manual Pro entitlement toggle and the ?dev=1 URL bypass — is dead-code-
// eliminated from the shipped bundle. No user-facing path to self-grant Pro
// exists in release.
//
// Set VITE_ENABLE_DEV_TOOLS=true in a preview/internal deploy's env if you want
// the Pro toggle on the installed PWA; NEVER set it for the store release build.
// Remove this flag once RevenueCat is the entitlement authority (Phase 3).
export const DEV_TOOLS_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_TOOLS === "true";
