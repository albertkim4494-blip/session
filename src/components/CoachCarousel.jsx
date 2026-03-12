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

    // Horizontal drag — prevent vertical scroll
    e.preventDefault();
    dragRef.current = dx;
    setDragDelta(dx);
  }, []);

  const onTouchEnd = useCallback(() => {
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

  // Compute translateX
  const containerWidth = containerRef.current?.offsetWidth || 0;
  const baseOffset = -activeIndex * containerWidth;
  const translateX = baseOffset + (isDragging ? dragDelta : 0);

  return (
    <div style={{ animation: "carouselFadeIn 0.3s ease-out" }}>
      {/* Cards container */}
      <div
        ref={containerRef}
        style={{ overflow: "hidden", borderRadius: 16 }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div style={{
          display: "flex",
          width: `${count * 100}%`,
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
              }}
            >
              <div style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 16,
                padding: 18,
                boxShadow: colors.shadow,
                minHeight: 200,
                display: "flex",
                flexDirection: "column",
              }}>
                {card.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        gap: 8, marginTop: 12,
      }}>
        {cards.map((card, i) => (
          <button
            key={card.key}
            onClick={() => onChangeIndex(i)}
            aria-label={`Go to card ${i + 1}`}
            style={{
              width: 8, height: 8, borderRadius: "50%", padding: 0,
              border: "none", cursor: "pointer",
              background: i === activeIndex ? (colors.accent || colors.primaryText) : colors.border,
              opacity: i === activeIndex ? 1 : 0.5,
              transition: "background 0.2s, opacity 0.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
