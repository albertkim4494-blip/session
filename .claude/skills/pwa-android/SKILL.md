---
name: pwa-android
description: Android PWA back button handling and standalone mode quirks. Use when debugging back button, navigation, or Android-specific PWA issues.
---

# Android PWA — Back Button & Navigation

## The Problem

In standalone PWA mode on Android, the hardware back button doesn't trigger `popstate` or `beforeunload` reliably. Users pressing Back expect to close a modal, but the OS navigates away from the app instead.

## The Solution: CloseWatcher API

**CloseWatcher** (Chrome 126+, Samsung Internet 28+) is the correct approach:

```js
const watcher = new CloseWatcher();
watcher.onclose = () => {
  // Close the topmost modal
};
```

- Fires on Android hardware back button press
- Fires on Escape key (desktop)
- One watcher per "close request" layer (stack them for nested modals)
- Must be created during user activation (click/tap handler) or immediately after

## Fallback: History Entries

For browsers without CloseWatcher, push history entries during `pointerdown`/`click` handlers:

```js
history.pushState({ modal: "log" }, "");
window.addEventListener("popstate", (e) => {
  if (e.state?.modal) closeModal(e.state.modal);
});
```

## Key Lessons (from 2-day debugging session)

1. **`pushState` must happen during user gesture** — calling it in a `useEffect` or timeout doesn't reliably register on Android
2. **History entries as fallback, not primary** — they interact badly with browser navigation (forward/back buttons, gesture nav)
3. **`beforeunload` is unreliable in PWAs** — Android standalone mode doesn't always fire it
4. **`src/lib/backHandler.js` exists but is UNUSED** — it was an earlier attempt that didn't work. Can be deleted.
5. **Test on real Android device** — Chrome DevTools device emulation does NOT emulate standalone PWA back button behavior

## Diagnostic Indicator

There's a diagnostic indicator (`dbgRef`, green text bottom-right) that shows back-button state. It can be removed once the feature is confirmed stable in production.

## Modal Close Priority

When Back is pressed, close modals in this order (topmost first):
1. Nested modals (confirm dialog, change username, change password, catalog browse)
2. Primary modals (log, profile, exercise detail, etc.)
3. If no modal is open, let the OS handle it (exit app)
