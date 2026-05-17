import React, { useMemo } from "react";
import { Modal } from "./Modal";
import { SPLIT_MODES } from "../lib/cadence";
import { DayChips } from "./CadenceEditor";

function MetaChip({ label, value, colors }) {
  return (
    <div style={{
      padding: "8px 12px",
      borderRadius: 12,
      background: colors.subtleBg,
      border: `1px solid ${colors.border}`,
      textAlign: "left",
      color: colors.text,
      minHeight: 44,
      opacity: 0.85,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
        textTransform: "uppercase", color: colors.textTertiary,
      }}>{label}</div>
      <div style={{
        fontSize: 13, fontWeight: 700, color: colors.text, marginTop: 2,
      }}>{value}</div>
    </div>
  );
}

function ActionButton({ icon, label, onClick, danger, colors }) {
  const fg = danger ? colors.dangerText : colors.text;
  const border = danger ? colors.dangerBorder : colors.border;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        padding: "12px 8px",
        borderRadius: 12,
        background: colors.subtleBg,
        border: `1px solid ${border}`,
        color: fg,
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 12, fontWeight: 700,
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 4,
        minHeight: 56,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

export function SplitDetailSheet({
  open,
  split,
  workouts,
  onClose,
  onOpenEditMeta,
  onRemoveMember,
  onReorderMembers,        // (fromIdx, toIdx) => void
  onSetMemberDays,         // (workoutId, days[]) => void
  onOpenWorkoutDetail,     // (workoutId) => void
  onDelete,
  onShare,
  styles,
  colors,
}) {
  const workoutById = useMemo(() => {
    const m = new Map();
    for (const w of workouts || []) m.set(w.id, w);
    return m;
  }, [workouts]);

  const sheetStyles = useMemo(() => ({
    ...styles,
    modalOverlay: { ...styles.modalOverlay, zIndex: 45 },
  }), [styles]);

  if (!open || !split) return null;

  const isContinuous = split.mode === SPLIT_MODES.CONTINUOUS;
  const members = split.members || [];

  const footer = (
    <div style={{
      display: "flex", gap: 8, paddingTop: 6,
      borderTop: `1px solid ${colors.border}`,
    }}>
      <ActionButton colors={colors} label="Share" onClick={onShare}
        icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>}
      />
      <ActionButton colors={colors} label="Delete" danger onClick={onDelete}
        icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={colors.dangerText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /></svg>}
      />
    </div>
  );

  return (
    <Modal
      open={open}
      title={split.name}
      onClose={onClose}
      styles={sheetStyles}
      footer={footer}
      headerActions={
        <button
          type="button"
          onClick={onOpenEditMeta}
          aria-label="Edit split name and schedule"
          title="Edit split"
          style={sheetStyles.iconBtn}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        </button>
      }
    >
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        {/* FROZEN HEADER — Mode chip */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <MetaChip label="Schedule" value={isContinuous ? "Continuous" : "Weekly"} colors={colors} />
            <MetaChip label="Workouts" value={`${members.length}`} colors={colors} />
          </div>
        </div>

        {/* SCROLLABLE MEMBERS AREA */}
        <div style={{
          flex: 1, minHeight: 0, overflowY: "auto",
          marginTop: 22, marginLeft: -4, marginRight: -4,
          paddingLeft: 4, paddingRight: 4,
          WebkitOverflowScrolling: "touch", overscrollBehavior: "contain",
        }}>
          {/* Section header */}
          <div style={{
            marginBottom: 10,
            fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
            textTransform: "uppercase", color: colors.textTertiary,
          }}>
            Workouts · {members.length}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {members.map((m, mi) => {
              const w = workoutById.get(m.workoutId);
              if (!w) return null;
              const isFirst = mi === 0;
              const isLast = mi === members.length - 1;
              const exCount = (w.exercises || []).length;
              const positionLabel = isContinuous ? `Day ${mi + 1}` : null;
              return (
                <div
                  key={m.workoutId}
                  style={{
                    background: colors.cardAltBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 14,
                    display: "flex", flexDirection: "column",
                  }}
                >
                  {/* Workout tap-target row */}
                  <button
                    type="button"
                    onClick={() => onOpenWorkoutDetail(w.id)}
                    style={{
                      width: "100%", minHeight: 56,
                      padding: "12px 14px",
                      background: "transparent", border: "none",
                      cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                      color: colors.text,
                      display: "flex", alignItems: "center", gap: 12,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {positionLabel && (
                          <span style={{
                            fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
                            textTransform: "uppercase",
                            color: colors.textTertiary,
                          }}>{positionLabel}</span>
                        )}
                        <span style={{
                          fontSize: 14, fontWeight: 700,
                          color: colors.text,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>{w.name}</span>
                      </div>
                      <div style={{
                        fontSize: 11.5, color: colors.textSecondary, marginTop: 3,
                      }}>
                        {exCount} {exCount === 1 ? "exercise" : "exercises"}
                        {w.category ? ` · ${(w.category || "").trim()}` : ""}
                      </div>
                    </div>
                    {/* Per-member controls */}
                    <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                      {isContinuous && (
                        <>
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={(e) => { e.stopPropagation(); onReorderMembers(mi, mi - 1); }}
                            style={{
                              background: "transparent", border: "none",
                              color: colors.text, opacity: isFirst ? 0.15 : 0.55,
                              padding: 4, cursor: isFirst ? "default" : "pointer",
                              display: "flex", alignItems: "center",
                            }}
                            title="Move up"
                          >
                            <svg width="14" height="11" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 13 12 5 6 13" /></svg>
                          </button>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={(e) => { e.stopPropagation(); onReorderMembers(mi, mi + 1); }}
                            style={{
                              background: "transparent", border: "none",
                              color: colors.text, opacity: isLast ? 0.15 : 0.55,
                              padding: 4, cursor: isLast ? "default" : "pointer",
                              display: "flex", alignItems: "center",
                            }}
                            title="Move down"
                          >
                            <svg width="14" height="11" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 3 12 11 18 3" /></svg>
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onRemoveMember(w.id); }}
                        title="Remove from split"
                        style={{
                          background: "transparent", border: "none",
                          padding: 4, marginLeft: 2,
                          cursor: "pointer", opacity: 0.45, color: colors.text,
                          display: "flex", alignItems: "center",
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </button>

                  {/* Day chips for weekly splits */}
                  {!isContinuous && (
                    <div style={{
                      padding: "0 12px 12px",
                      borderTop: `1px solid ${colors.border}`,
                      paddingTop: 10,
                    }}>
                      <DayChips
                        selected={Array.isArray(m.days) ? m.days : []}
                        onToggle={(day) => {
                          const cur = Array.isArray(m.days) ? m.days : [];
                          const next = cur.includes(day) ? cur.filter((d) => d !== day) : [...cur, day];
                          onSetMemberDays(w.id, next);
                        }}
                        colors={colors}
                        ariaLabel={`Days for ${w.name}`}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* No add picker here — adding a workout happens in the editor
                (tap the pencil to add). Hint when empty. */}
            {members.length === 0 && (
              <div style={{
                padding: "20px 14px",
                borderRadius: 14,
                border: `1px dashed ${colors.border}`,
                background: colors.cardAltBg,
                textAlign: "center",
                color: colors.textSecondary,
                fontSize: 13,
                lineHeight: 1.5,
              }}>
                No workouts yet. Tap the pencil to add some.
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
