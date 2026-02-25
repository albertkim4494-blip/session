import React, { useState } from "react";

const COLUMNS = [
  { key: "name", label: "Exercise", align: "left" },
  { key: "sessions", label: "Sessions", align: "right" },
  { key: "totalSets", label: "Sets", align: "right" },
  { key: "totalReps", label: "Reps", align: "right" },
  { key: "maxWeight", label: "Best", align: "right" },
];

function compareValues(a, b, key) {
  const av = a[key];
  const bv = b[key];
  if (key === "name") return (av || "").localeCompare(bv || "");
  if (key === "maxWeight") {
    // Parse numeric portion; "BW" or "—" sorts as 0
    const na = typeof av === "string" ? parseFloat(av) || 0 : (av ?? 0);
    const nb = typeof bv === "string" ? parseFloat(bv) || 0 : (bv ?? 0);
    return na - nb;
  }
  return (av ?? 0) - (bv ?? 0);
}

export function ExerciseListTable({ exercises, colors, styles, weightLabel }) {
  const [sortKey, setSortKey] = useState("sessions");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(key === "name"); // alphabetical defaults ascending, numbers descending
    }
  };

  const active = exercises.filter((e) => e.sessions > 0);
  const inactiveCount = exercises.length - active.length;

  const sorted = [...active].sort((a, b) => {
    const cmp = compareValues(a, b, sortKey);
    return sortAsc ? cmp : -cmp;
  });

  if (sorted.length === 0 && inactiveCount === 0) return null;

  const thStyle = {
    padding: "8px 6px",
    fontSize: 11,
    fontWeight: 700,
    opacity: 0.5,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    cursor: "pointer",
    whiteSpace: "nowrap",
    userSelect: "none",
    borderBottom: `1px solid ${colors.border}`,
    background: "transparent",
    border: "none",
    color: colors.text,
  };

  const tdStyle = {
    padding: "9px 6px",
    fontSize: 13,
    borderBottom: `1px solid ${colors.border}22`,
    verticalAlign: "middle",
  };

  const arrow = (key) => {
    if (key !== sortKey) return "";
    return sortAsc ? " \u25B2" : " \u25BC";
  };

  return (
    <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                style={{
                  ...thStyle,
                  textAlign: col.align,
                  color: col.key === sortKey ? colors.accent : colors.text,
                  borderBottom: `1px solid ${colors.border}`,
                  ...(col.key === "name" ? { paddingLeft: 14 } : {}),
                  ...(col.key === "maxWeight" ? { paddingRight: 14 } : {}),
                }}
                onClick={() => handleSort(col.key)}
              >
                {col.label === "Reps" && sortKey !== "totalReps" ? col.label : col.label}
                {arrow(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((ex) => (
            <tr key={ex.id}>
              <td style={{ ...tdStyle, fontWeight: 600, paddingLeft: 14, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {ex.name}
              </td>
              <td style={{ ...tdStyle, textAlign: "right" }}>{ex.sessions}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>{ex.totalSets}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                {ex.totalReps}{" "}
                <span style={{ fontSize: 10, opacity: 0.5 }}>{ex.unitAbbr}</span>
              </td>
              <td style={{ ...tdStyle, textAlign: "right", paddingRight: 14 }}>
                {ex.maxWeight === "\u2014" ? (
                  <span style={{ opacity: 0.3 }}>{ex.maxWeight}</span>
                ) : (
                  ex.maxWeight
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {inactiveCount > 0 && (
        <div style={{ fontSize: 12, opacity: 0.4, padding: "10px 14px" }}>
          {inactiveCount} exercise{inactiveCount !== 1 ? "s" : ""} with no activity
        </div>
      )}
    </div>
  );
}
