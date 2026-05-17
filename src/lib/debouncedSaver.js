/**
 * Creates a debounced saver that collapses rapid state changes into a single write.
 * If a save is already in-flight when the timer fires, the latest pending state is
 * queued and executed after the current one finishes. The queue only holds one
 * entry — rapid triggers during an in-flight save overwrite each other (intended:
 * each trigger carries the full current state, not a delta).
 *
 * `saveFn` is injected so this module can be tested without network deps.
 */
export function createDebouncedSaver(saveFn, delayMs = 2000) {
  let timerId = null;
  let inFlight = false;
  let queued = null; // { userId, state }
  let lastUserId = null;
  let lastState = null;

  async function flush(userId, state) {
    inFlight = true;
    try {
      await saveFn(userId, state);
    } catch (err) {
      console.error("Cloud save failed (localStorage is the safety net):", err);
    } finally {
      inFlight = false;
    }

    if (queued) {
      const next = queued;
      queued = null;
      await flush(next.userId, next.state);
    }
  }

  function trigger(userId, state) {
    lastUserId = userId;
    lastState = state;

    if (timerId) clearTimeout(timerId);

    if (inFlight) {
      queued = { userId, state };
      return;
    }

    timerId = setTimeout(() => {
      timerId = null;
      flush(userId, state);
    }, delayMs);
  }

  // Immediately flush any pending debounced save (best-effort, for pagehide/visibilitychange).
  // Returns the in-flight promise so callers can await completion when the runtime allows it.
  function flushSync() {
    if (!timerId && !queued) return Promise.resolve();
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    const pending = queued || (lastUserId && lastState ? { userId: lastUserId, state: lastState } : null);
    queued = null;
    if (pending) {
      return flush(pending.userId, pending.state);
    }
    return Promise.resolve();
  }

  function cancel() {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    queued = null;
  }

  return { trigger, cancel, flush, flushSync };
}
