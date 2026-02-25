import React, { useState, useMemo } from "react";

const SORT_COLUMNS = [
  { key: "name", label: "Exercise", align: "left" },
  { key: "sessions", label: "Sessions", align: "right" },
  { key: "totalReps", label: "Reps", align: "right" },
  { key: "maxWeight", label: "Best", align: "right" },
];

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

export function ExerciseListTable({ exercises, colors, styles, weightLabel }) {
  const [sortKey, setSortKey] = useState("sessions");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(key === "name");
    }
  };

  const active = exercises.filter((e) => e.sessions > 0);
  const inactiveCount = exercises.length - active.length;

  const sorted = [...active].sort((a, b) => {
    const cmp = compareValues(a, b, sortKey);
    return sortAsc ? cmp : -cmp;
  });

  // Determine if all active exercises share the same unit — show it in the header
  const commonUnit = useMemo(() => {
    if (active.length === 0) return null;
    const first = active[0].unitAbbr;
    return active.every((e) => e.unitAbbr === first) ? first : null;
  }, [active]);

  if (sorted.length === 0 && inactiveCount === 0) return null;

  const arrow = (key) => {
    if (key !== sortKey) return "";
    return sortAsc ? " \u25B2" : " \u25BC";
  };

  const thBase = {
    padding: "8px 6px",
    fontSize: 11,
    fontWeight: 700,
    opacity: 0.5,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    cursor: "pointer",
    whiteSpace: "nowrap",
    userSelect: "none",
    background: "transparent",
    border: "none",
    color: colors.text,
  };

  const tdBase = {
    padding: "9px 6px",
    fontSize: 13,
    borderBottom: `1px solid ${colors.border}22`,
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    overflow: "hidden",
  };

  return (
    <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col />
          <col style={{ width: 52 }} />
          <col style={{ width: 62 }} />
          <col style={{ width: 62 }} />
        </colgroup>
        <thead>
          <tr>
            {SORT_COLUMNS.map((col) => {
              const isSorted = col.key === sortKey;
              // Show unit in Reps header when all exercises share the same unit
              let label = col.label;
              if (col.key === "totalReps" && commonUnit && commonUnit !== "reps") {
                label = commonUnit.charAt(0).toUpperCase() + commonUnit.slice(1);
              }
              return (
                <th
                  key={col.key}
                  style={{
                    ...thBase,
                    textAlign: col.align,
                    color: isSorted ? colors.accent : colors.text,
                    borderBottom: `1px solid ${colors.border}`,
                    ...(col.key === "name" ? { paddingLeft: 14 } : {}),
                    ...(col.key === "maxWeight" ? { paddingRight: 14 } : {}),
                  }}
                  onClick={() => handleSort(col.key)}
                >
                  {label}{arrow(col.key)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((ex) => (
            <tr key={ex.id}>
              <td style={{
                ...tdBase, fontWeight: 600, paddingLeft: 14,
                textOverflow: "ellipsis",
              }}>
                {ex.name}
              </td>
              <td style={{ ...tdBase, textAlign: "right" }}>
                {ex.sessions}
              </td>
              <td style={{ ...tdBase, textAlign: "right" }}>
                {ex.totalReps}
                {!commonUnit && ex.unitAbbr !== "reps" && (
                  <span style={{ fontSize: 9, opacity: 0.4, marginLeft: 2 }}>{ex.unitAbbr}</span>
                )}
              </td>
              <td style={{ ...tdBase, textAlign: "right", paddingRight: 14 }}>
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
