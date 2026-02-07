import { useState, useEffect } from "react";

export function useKeyboardInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    function onResize() {
      const kb = window.innerHeight - vv.height;
      setInset(kb > 0 ? kb : 0);
    }

    vv.addEventListener("resize", onResize);
    onResize();
    return () => vv.removeEventListener("resize", onResize);
  }, []);

  return inset;
}
