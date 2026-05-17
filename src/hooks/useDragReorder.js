import { useRef, useState, useCallback } from "react";

/**
 * useDragReorder — touch / pointer drag-to-reorder for a vertical list.
 *
 * Usage:
 *   const drag = useDragReorder({ itemCount: items.length, onCommit: (from, to) => moveItem(from, to) });
 *
 *   {items.map((item, idx) => (
 *     <div key={item.id} ref={drag.setItemRef(idx)} style={drag.itemStyle(idx)}>
 *       <span {...drag.handleProps(idx)}>≡</span>
 *       …
 *     </div>
 *   ))}
 *
 * Behaviour: the dragged row follows the pointer. Sibling rows slide out of the
 * way to indicate the drop slot. The reorder is only committed once on
 * pointerup — the underlying array doesn't churn mid-drag, which keeps React
 * reconciliation simple and preserves pointer capture on the same DOM node.
 */
export function useDragReorder({ itemCount, onCommit, rowHeight = 68 }) {
  const [drag, setDrag] = useState(null); // { fromIdx, currentIdx, offsetY }
  const stateRef = useRef(null);
  const itemRefs = useRef([]);

  const setItemRef = useCallback(
    (idx) => (el) => { itemRefs.current[idx] = el; },
    []
  );

  const handleProps = useCallback((idx) => ({
    onPointerDown: (e) => {
      // Only react to primary button / first touch
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      // Measure the row so we can use its actual height for slot math.
      const rect = itemRefs.current[idx]?.getBoundingClientRect();
      const measuredH = rect ? rect.height + 8 /* gap */ : rowHeight;
      stateRef.current = {
        fromIdx: idx,
        currentIdx: idx,
        startY: e.clientY,
        rowH: measuredH,
      };
      setDrag({ fromIdx: idx, currentIdx: idx, offsetY: 0 });
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    },
    onPointerMove: (e) => {
      const s = stateRef.current;
      if (!s) return;
      const rawDelta = e.clientY - s.startY;
      const slotsMoved = Math.round(rawDelta / s.rowH);
      const newIdx = Math.max(0, Math.min(itemCount - 1, s.fromIdx + slotsMoved));
      // offsetY = how far the dragged row sits past its CURRENT (post-shift) rest spot.
      const offsetY = rawDelta - (newIdx - s.fromIdx) * s.rowH;
      if (newIdx !== s.currentIdx) {
        s.currentIdx = newIdx;
      }
      setDrag({ fromIdx: s.fromIdx, currentIdx: newIdx, offsetY });
    },
    onPointerUp: () => {
      const s = stateRef.current;
      if (s && s.fromIdx !== s.currentIdx) {
        onCommit?.(s.fromIdx, s.currentIdx);
      }
      stateRef.current = null;
      setDrag(null);
    },
    onPointerCancel: () => {
      stateRef.current = null;
      setDrag(null);
    },
    style: {
      touchAction: "none",
      cursor: drag ? "grabbing" : "grab",
    },
  }), [itemCount, onCommit, rowHeight, drag]);

  const itemStyle = useCallback((idx) => {
    if (!drag) return {};
    const { fromIdx, currentIdx, offsetY } = drag;
    if (idx === fromIdx) {
      // Dragged row: follows finger. Includes the slot shift PLUS the
      // residual offset for sub-row precision.
      const totalY = (currentIdx - fromIdx) * rowHeight + offsetY;
      return {
        transform: `translateY(${totalY}px)`,
        zIndex: 10,
        transition: "none",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        opacity: 0.95,
        pointerEvents: "none",
      };
    }
    // Sibling rows shift to make room for the dragged row's destination slot.
    let shift = 0;
    if (fromIdx < currentIdx) {
      // Dragged down — rows between fromIdx+1 and currentIdx slide up.
      if (idx > fromIdx && idx <= currentIdx) shift = -rowHeight;
    } else if (fromIdx > currentIdx) {
      // Dragged up — rows between currentIdx and fromIdx-1 slide down.
      if (idx >= currentIdx && idx < fromIdx) shift = rowHeight;
    }
    return shift
      ? {
          transform: `translateY(${shift}px)`,
          transition: "transform 0.15s cubic-bezier(.2,.8,.3,1)",
        }
      : { transition: "transform 0.15s cubic-bezier(.2,.8,.3,1)" };
  }, [drag, rowHeight]);

  return {
    handleProps,
    itemStyle,
    setItemRef,
    dragging: !!drag,
  };
}
