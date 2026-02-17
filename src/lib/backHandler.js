// ---------------------------------------------------------------------------
// BACK BUTTON HANDLER — standalone module, initialized BEFORE React mounts.
//
// Uses location.hash to create real navigation entries that Android Chrome's
// native canGoBack() tracks. Self-caused hashchange events are identified by
// comparing location.hash to lastPushedHash (no fragile counter).
//
// Also listens to popstate as a fallback for edge cases where hashchange
// doesn't fire. Both handlers use the same lastPushedHash check, so only
// one ever runs per back press.
// ---------------------------------------------------------------------------

let seq = 0;
let lastPushedHash = "";
let backFn = null;

function pushEntry() {
  seq++;
  lastPushedHash = "#wt" + seq;
  location.hash = lastPushedHash;
}

function handleBack() {
  backFn?.();
  pushEntry();
}

/**
 * Initialize history buffer and event listeners.
 * Call ONCE from main.jsx before React renders.
 */
export function initBackHandler() {
  // Clear any leftover hash from previous sessions
  history.replaceState(null, "", location.pathname + location.search);

  // Push buffer entries — real navigation entries Android WebView tracks
  for (let i = 0; i < 10; i++) pushEntry();

  // Primary: hashchange fires when hash changes (back press, location.hash assignment)
  window.addEventListener("hashchange", () => {
    if (location.hash === lastPushedHash) return; // self-caused
    handleBack();
  });

  // Fallback: popstate fires for all session history navigations
  window.addEventListener("popstate", () => {
    if (location.hash === lastPushedHash) return; // already handled or self-caused
    handleBack();
  });

}

/**
 * Set the callback that runs when the back button is pressed.
 * Called from App.jsx on every render (passes a closure over current state refs).
 */
export function setBackHandler(fn) {
  backFn = fn;
}
