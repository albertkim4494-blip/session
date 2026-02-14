import React from "react";
import { EXERCISE_CATALOG } from "../lib/exerciseCatalog";

export function ExerciseCatalogSection({ styles, colors, onOpen }) {
  return (
    <div
      className="card-hover"
      style={{ ...styles.card, cursor: "pointer" }}
      onClick={onOpen}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: colors.accentBg,
          border: `1px solid ${colors.accentBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <line x1="12" y1="8" x2="12" y2="14" />
            <line x1="9" y1="11" x2="15" y2="11" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Exercise Catalog</div>
          <div style={{ fontSize: 12, opacity: 0.5 }}>
            Browse {EXERCISE_CATALOG.length} exercises with muscle diagrams
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, flexShrink: 0 }}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}
