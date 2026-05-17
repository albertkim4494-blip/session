import { useEffect, useRef } from "react";

// Calls onOutside when a mousedown or touchstart happens outside `ref` while `isActive` is true.
// Callback identity doesn't need to be stable — stored in a ref so changing it
// doesn't re-attach the document listeners.
export function useClickOutside(ref, isActive, onOutside) {
  const cbRef = useRef(onOutside);
  useEffect(() => {
    cbRef.current = onOutside;
  });

  useEffect(() => {
    if (!isActive) return undefined;
    function handleDown(e) {
      const el = ref.current;
      if (el && !el.contains(e.target)) cbRef.current();
    }
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("touchstart", handleDown);
    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("touchstart", handleDown);
    };
  }, [isActive, ref]);
}
