import React, { useState, useMemo, useCallback } from "react";
import { classifyUnit } from "../lib/constants";

const SESSIONS_WIDTH = 44;
const RIGHT_TOTAL_WIDTH = 140; // total px for columns right of Sessions — split evenly

const BUILTIN_GROUPS = {
  reps: { label: "Strength", volumeLabel: "Reps" },
  time: { label: "Time", volumeLabel: "Time" },
  distance: { label: "Distance", volumeLabel: "Dist" },
};

const DEFAULT_ORDER = ["reps", "time", "distance"];

function formatVolume(v) {
  if (v == null || v === 0) return "\u2014";
  if (v >= 100000) return (v / 1000).toFixed(0) + "k";
  if (v >= 1000) return (v / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(v);
}

function compareValues(a, b, key) {
  const av = a[key];
  const bv = b[key];
  if (key === "name") return (av || "").localeCompare(bv || "");
  if (key === "maxWeight") {
    const na = typeof av === "string" ? parseFloat(av) || 0 : (av ?? 0);
    const nb = typeof bv === "string" ? parseFloat(bv) || 0 : (bv ?? 0);
    return na - nb;
  }
  return (av ?? 0) - (bv ?? 0);
}

// Simplified "O" logo — pencil-textured circle from the Session brand mark
function SessionsIcon({ color, size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
      <ellipse cx="12" cy="12" rx="9.5" ry="9.2" stroke={color} strokeWidth="2.8" opacity="0.55" strokeLinecap="round" />
      <ellipse cx="12.2" cy="11.8" rx="9.8" ry="9.5" stroke={color} strokeWidth="1.8" opacity="0.3" strokeLinecap="round" strokeDasharray="18 60" strokeDashoffset="5" />
      <ellipse cx="11.8" cy="12.3" rx="9.2" ry="9.6" stroke={color} strokeWidth="1.4" opacity="0.4" strokeLinecap="round" strokeDasharray="25 60" strokeDashoffset="20" />
    </svg>
  );
}

function CollapseChevron({ collapsed }) {
  return collapsed ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
  );
}

function GroupTable({
  groupKey, groupLabel, exercises, colors, styles, sortKey, sortAsc, onSort,
  showVolume, onToggleVolume,
  collapsed, onToggleCollapse,
}) {
  const sorted = [...exercises].sort((a, b) => {
    const cmp = compareValues(a, b, sortKey);
    return sortAsc ? cmp : -cmp;
  });

  const commonUnit = useMemo(() => {
    if (exercises.length === 0) return null;
    const first = exercises[0].unitAbbr;
    return exercises.every((e) => e.unitAbbr === first) ? first : null;
  }, [exercises]);

  const isStrength = groupKey === "reps";
  const rightColCount = 2;
  const rightColWidth = RIGHT_TOTAL_WIDTH / rightColCount;
  const metricKey = isStrength && showVolume ? "totalVolume" : "totalReps";
  const cfg = BUILTIN_GROUPS[groupKey];
  const metricLabel = isStrength && showVolume
    ? "Vol"
    : commonUnit && commonUnit !== "reps"
      ? commonUnit.charAt(0).toUpperCase() + commonUnit.slice(1)
      : cfg ? cfg.volumeLabel : "Total";
  const bestKey = isStrength ? "maxWeight" : "maxReps";
  const bestLabel = isStrength ? "Best" : "Long";

  const thStyle = (align, isLogo) => ({
    padding: "10px 4px",
    fontSize: 11,
    fontWeight: 700,
    opacity: isLogo ? 1 : 0.5,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    cursor: "pointer",
    whiteSpace: "nowrap",
    userSelect: "none",
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${colors.border}`,
    textAlign: align,
    verticalAlign: "middle",
  });

  const cellBase = (isLastRow) => ({
    padding: "12px 4px",
    fontSize: 14,
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    overflow: "hidden",
    borderBottom: isLastRow ? "none" : `1px solid ${colors.border}22`,
  });

  const sortArrow = (key) => {
    if (key !== sortKey) return null;
    return (
      <span style={{ position: "absolute", marginLeft: 1, fontSize: 8 }}>
        {sortAsc ? "\u25B2" : "\u25BC"}
      </span>
    );
  };

  return (
    <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
      {/* Header — click anywhere to collapse */}
      <div
        onClick={() => onToggleCollapse(groupKey)}
        style={{
          padding: collapsed ? "10px 16px" : "10px 16px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          cursor: "pointer",
        }}
      >
        {/* Left side: label */}
        <span style={{
          fontSize: 12, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: 0.5, opacity: 0.4,
        }}>
          {groupLabel}
        </span>

        {/* Right side: controls + chevron */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {isStrength && !collapsed && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                borderRadius: 6,
                overflow: "hidden",
                border: `1px solid ${colors.border}`,
              }}
            >
              {[
                { key: "reps", label: "Reps" },
                { key: "vol", label: "Vol" },
              ].map((opt) => {
                const active = opt.key === "vol" ? showVolume : !showVolume;
                return (
                  <button
                    key={opt.key}
                    onClick={() => onToggleVolume(opt.key === "vol")}
                    style={{
                      border: "none",
                      padding: "3px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: active ? colors.primaryBg : "transparent",
                      color: active ? (colors.primaryText || "#fff") : colors.text,
                      opacity: active ? 1 : 0.4,
                      lineHeight: 1,
                      fontFamily: "inherit",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}
          <span style={{ opacity: 0.4, display: "flex", alignItems: "center" }}>
            <CollapseChevron collapsed={collapsed} />
          </span>
        </div>
      </div>

      {/* Collapsible content */}
      {!collapsed && (
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontVariantNumeric: "tabular-nums" }}>
          <colgroup>
            <col />
            <col style={{ width: SESSIONS_WIDTH }} />
            <col style={{ width: rightColWidth }} />
            <col style={{ width: rightColWidth }} />
          </colgroup>
          <thead>
            <tr>
              <th
                style={{ ...thStyle("left"), paddingLeft: 16, color: sortKey === "name" ? colors.accent : colors.text }}
                onClick={() => onSort("name")}
              >
                <span style={{ position: "relative" }}>Exercise{sortArrow("name")}</span>
              </th>
              <th
                style={{ ...thStyle("center", true), color: sortKey === "sessions" ? colors.accent : colors.text }}
                onClick={() => onSort("sessions")}
              >
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", verticalAlign: "middle" }}>
                  <SessionsIcon color={sortKey === "sessions" ? colors.accent : colors.text} />
                  {sortKey === "sessions" && (
                    <span style={{ position: "absolute", right: -9, fontSize: 8, opacity: 0.7 }}>
                      {sortAsc ? "\u25B2" : "\u25BC"}
                    </span>
                  )}
                </span>
              </th>
              <th
                style={{ ...thStyle("center"), color: sortKey === metricKey ? colors.accent : colors.text }}
                onClick={() => onSort(metricKey)}
              >
                <span style={{ position: "relative" }}>{metricLabel}{sortArrow(metricKey)}</span>
              </th>
              <th
                style={{ ...thStyle("center"), paddingRight: 16, color: sortKey === bestKey ? colors.accent : colors.text }}
                onClick={() => onSort(bestKey)}
              >
                <span style={{ position: "relative" }}>{bestLabel}{sortArrow(bestKey)}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((ex, i) => {
              const isLastRow = i === sorted.length - 1;
              const cb = cellBase(isLastRow);
              const metricValue = isStrength && showVolume
                ? formatVolume(ex.totalVolume)
                : ex.totalReps;
              const bestValue = isStrength ? ex.maxWeight : ex.maxReps;
              const bestIsEmpty = isStrength
                ? ex.maxWeight === "\u2014"
                : (!bestValue && bestValue !== 0);
              return (
                <tr key={ex.id}>
                  <td style={{ ...cb, paddingLeft: 16, fontWeight: 600, textOverflow: "ellipsis", maxWidth: 0 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{ex.name}</span>
                  </td>
                  <td style={{ ...cb, textAlign: "center", opacity: 0.7 }}>
                    {ex.sessions}
                  </td>
                  <td style={{ ...cb, textAlign: "center", opacity: 0.7 }}>
                    {metricValue}
                    {!(isStrength && showVolume) && !commonUnit && ex.unitAbbr !== "reps" && (
                      <span style={{ fontSize: 10, opacity: 0.5, marginLeft: 2 }}>{ex.unitAbbr}</span>
                    )}
                  </td>
                  <td style={{ ...cb, textAlign: "center", paddingRight: 16, opacity: 0.7 }}>
                    {bestIsEmpty ? (
                      <span style={{ opacity: 0.35 }}>{"\u2014"}</span>
                    ) : isStrength ? (
                      ex.maxWeight
                    ) : (
                      <>{bestValue}<span style={{ fontSize: 10, opacity: 0.5, marginLeft: 2 }}>{ex.unitAbbr}</span></>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function ExerciseListTable({ exercises, colors, styles }) {
  const [sortKey, setSortKey] = useState("sessions");
  const [sortAsc, setSortAsc] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [collapsedSet, setCollapsedSet] = useState(new Set());

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(key === "name");
    }
  };

  const toggleCollapse = useCallback((groupKey) => {
    setCollapsedSet((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) next.delete(groupKey);
      else next.add(groupKey);
      return next;
    });
  }, []);

  // Group exercises by unit classification
  const groups = useMemo(() => {
    const active = exercises.filter((e) => e.sessions > 0);
    const map = {};
    for (const k of DEFAULT_ORDER) map[k] = [];
    for (const ex of active) {
      const cat = classifyUnit(ex.unitKey);
      if (map[cat]) map[cat].push(ex);
      else map[cat] = [ex];
    }
    const result = [];
    for (const k of DEFAULT_ORDER) {
      if (!map[k] || map[k].length === 0) continue;
      result.push({ key: k, label: BUILTIN_GROUPS[k].label, exercises: map[k] });
    }
    return result;
  }, [exercises]);

  if (groups.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {groups.map((g) => (
        <GroupTable
          key={g.key}
          groupKey={g.key}
          groupLabel={g.label}
          exercises={g.exercises}
          colors={colors}
          styles={styles}
          sortKey={sortKey}
          sortAsc={sortAsc}
          onSort={handleSort}
          showVolume={showVolume}
          onToggleVolume={setShowVolume}
          collapsed={collapsedSet.has(g.key)}
          onToggleCollapse={toggleCollapse}
        />
      ))}
    </div>
  );
}
