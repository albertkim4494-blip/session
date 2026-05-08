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

  // --- Touch handlers (drag-to-follow + snap) ---
  const onTouchStart = useCallback((e) => {
    const t = e.touches[0];
    touchRef.current = { startX: t.clientX, startY: t.clientY, startTime: Date.now(), locked: null };
    setIsDragging(true);
    // Stop propagation so the parent tab-swipe handler doesn't also claim this touch
    e.stopPropagation();
  }, []);

  const onTouchMove = useCallback((e) => {
    const ref = touchRef.current;
    if (!ref) return;
    const t = e.touches[0];
    const dx = t.clientX - ref.startX;
    const dy = t.clientY - ref.startY;

    // Lock direction on first significant move
    if (ref.locked === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      ref.locked = Math.abs(dx) >= Math.abs(dy) ? "h" : "v";
    }
    if (ref.locked === "v") return;

    // Horizontal drag — prevent vertical scroll and tab swipe
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = dx;
    setDragDelta(dx);
  }, []);

  const onTouchEnd = useCallback((e) => {
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
    // Snap if dragged > 25% of card width or fast flick
    if (Math.abs(dx) > containerWidth * 0.25 || (velocity > 0.3 && Math.abs(dx) > 15)) {
      newIndex = dx < 0 ? idx + 1 : idx - 1;
    }
    newIndex = clampIndex(newIndex);
    dragRef.current = 0;
    setDragDelta(0);
    if (newIndex !== idx) onChangeIndex(newIndex);
  }, [clampIndex, onChangeIndex]);

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
      {/* Cards container */}
      <div
        ref={containerRef}
        style={{ overflow: "hidden", borderRadius: 22, flex: 1, minHeight: 0 }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
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
                  borderRadius: 22,
                  boxShadow: colors.shadow,
                  height: "100%",
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Accented label header */}
                {card.label && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    marginBottom: 14,
                    color: colors.accent,
                  }}>
                    {card.icon}
                    <div style={{
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: 1.2, textTransform: "uppercase",
                    }}>
                      {card.label}
                    </div>
                  </div>
                )}
                <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
                  {card.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pill-shaped dot pager — outside the card */}
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        gap: 6, padding: "14px 0 10px",
      }}>
        {cards.map((c, j) => (
          <button
            key={c.key}
            onClick={() => onChangeIndex(j)}
            aria-label={`Go to card ${j + 1}`}
            style={{
              width: j === activeIndex ? 18 : 6, height: 6,
              borderRadius: 3, padding: 0,
              border: "none", cursor: "pointer",
              background: j === activeIndex ? colors.accent : colors.subtleTrack,
              transition: "all 0.25s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
