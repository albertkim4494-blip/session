import React, { useState, useRef, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// CSS animation (injected once)
// ---------------------------------------------------------------------------
const CAROUSEL_CSS = `
@keyframes carouselFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}`;
let cssInjected = false;
function ensureCSS() {
  if (cssInjected) return;
  cssInjected = true;
  const s = document.createElement("style");
  s.textContent = CAROUSEL_CSS;
  document.head.appendChild(s);
}

// ---------------------------------------------------------------------------
// CoachCarousel — Swipeable horizontal card carousel with dot indicators
// ---------------------------------------------------------------------------
export function CoachCarousel({ cards, colors, activeIndex = 0, onChangeIndex }) {
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(0); // mirrors dragDelta for use in callbacks
  const touchRef = useRef(null);
  const containerRef = useRef(null);
  const stripRef = useRef(null);
  const activeRef = useRef(activeIndex);
  activeRef.current = activeIndex;

  useEffect(() => { ensureCSS(); }, []);


  const count = cards.length;
  const clampIndex = useCallback((i) => Math.max(0, Math.min(count - 1, i)), [count]);

  // Stable refs for handlers so the native useEffect doesn't have to re-bind.
  const onChangeIndexRef = useRef(onChangeIndex);
  onChangeIndexRef.current = onChangeIndex;
  const countRef = useRef(count);
  countRef.current = count;

  // Native touch listeners with passive: false. React's synthetic touch
  // handlers default to passive in v17+, which makes preventDefault a no-op
  // and lets the browser claim horizontal gestures before our JS can move
  // the strip. Native listeners give us back full control.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reset = () => {
      touchRef.current = null;
      dragRef.current = 0;
      setDragDelta(0);
      setIsDragging(false);
    };

    const onStart = (e) => {
      if (e.touches.length > 1) {
        reset();
        return;
      }
      const t = e.touches[0];
      touchRef.current = { startX: t.clientX, startY: t.clientY, startTime: Date.now(), locked: null };
      setIsDragging(true);
      e.stopPropagation();
    };

    const onMove = (e) => {
      const ref = touchRef.current;
      if (!ref) return;
      const t = e.touches[0];
      if (!t) return;
      const dx = t.clientX - ref.startX;
      const dy = t.clientY - ref.startY;

      if (ref.locked === null) {
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);
        if (adx > 6 || ady > 6) {
          ref.locked = adx >= ady ? "h" : "v";
        }
      }
      if (ref.locked === "v") return;

      // With passive: false, these actually work — block native scroll and
      // stop propagation so the parent tab-swipe handler doesn't also fire.
      e.preventDefault();
      e.stopPropagation();
      dragRef.current = dx;
      setDragDelta(dx);
    };

    const onEnd = (e) => {
      e.stopPropagation();
      const ref = touchRef.current;
      touchRef.current = null;
      setIsDragging(false);

      if (!ref || ref.locked === "v") {
        dragRef.current = 0;
        setDragDelta(0);
        return;
      }

      const dx = dragRef.current;
      const containerWidth = containerRef.current?.offsetWidth || 300;
      const elapsed = Date.now() - ref.startTime;
      const velocity = elapsed > 0 ? Math.abs(dx) / elapsed : 0;
      const idx = activeRef.current;

      let newIndex = idx;
      if (Math.abs(dx) > containerWidth * 0.25 || (velocity > 0.3 && Math.abs(dx) > 15)) {
        newIndex = dx < 0 ? idx + 1 : idx - 1;
      }
      const c = countRef.current;
      newIndex = Math.max(0, Math.min(c - 1, newIndex));
      dragRef.current = 0;
      setDragDelta(0);
      if (newIndex !== idx) onChangeIndexRef.current(newIndex);
    };

    const onCancel = () => {
      reset();
    };

    el.addEventListener("touchstart", onStart, { passive: false });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: false });
    el.addEventListener("touchcancel", onCancel, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onCancel);
    };
  }, []);

  // Track container width in state so it updates after mount/visibility/resize changes
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    const measure = () => {
      const w = containerRef.current?.offsetWidth || 0;
      if (w > 0) setContainerWidth(w);
    };
    measure();
    // Re-measure on next frame in case layout hasn't settled yet (e.g. returning from another tab)
    const raf = requestAnimationFrame(measure);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [activeIndex]);

  const baseOffset = -activeIndex * containerWidth;
  const translateX = baseOffset + (isDragging ? dragDelta : 0);

  return (
    <div style={{ animation: "carouselFadeIn 0.3s ease-out", flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Cards container — touch listeners are attached natively in the
          useEffect above, with passive: false so preventDefault works. */}
      <div
        ref={containerRef}
        data-owns-horizontal-gesture="true"
        style={{
          overflow: "hidden",
          borderRadius: 16,
          height: "56vh",
        }}
      >
        <div ref={stripRef} style={{
          display: "flex",
          width: `${count * 100}%`,
          height: "100%",
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? "none" : "transform 0.3s cubic-bezier(.25,.8,.25,1)",
        }}>
          {cards.map((card) => (
            <div
              key={card.key}
              style={{
                width: `${100 / count}%`,
                flexShrink: 0,
                padding: "0 2px",
                boxSizing: "border-box",
                height: "100%",
              }}
            >
              <div
                data-carousel-card
                style={{
                  background: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 16,
                  boxShadow: colors.shadow,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Unified card header */}
                {card.label && (
                  <div style={{
                    fontSize: 11, fontWeight: 600, opacity: 0.4,
                    textTransform: "uppercase", letterSpacing: 1,
                    padding: "14px 18px 0",
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    {card.icon}
                    {card.label}
                  </div>
                )}
                <div style={{ flex: 1, overflow: "auto", padding: "10px 18px 36px", display: "flex", flexDirection: "column" }}>
                  {card.content}
                </div>
                {/* Dot indicators — sticky at bottom */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  display: "flex", justifyContent: "center", alignItems: "center",
                  gap: 8, padding: "10px 0",
                  background: `linear-gradient(transparent, ${colors.cardBg} 40%)`,
                }}>
                  {cards.map((c, j) => (
                    <button
                      key={c.key}
                      onClick={() => onChangeIndex(j)}
                      aria-label={`Go to card ${j + 1}`}
                      style={{
                        width: 8, height: 8, borderRadius: "50%", padding: 0,
                        border: "none", cursor: "pointer",
                        background: j === activeIndex ? (colors.accent || colors.primaryText) : colors.border,
                        opacity: j === activeIndex ? 1 : 0.5,
                        transition: "background 0.2s, opacity 0.2s",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
