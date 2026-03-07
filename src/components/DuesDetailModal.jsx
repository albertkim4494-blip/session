import React, { useState } from "react";
import { Modal } from "./Modal";
import { closeDues, deleteDues, markPaid, unmarkPaid } from "../lib/groupApi";
import { formatAmount, getDuesPaymentSummary } from "../lib/announcementUtils";

export function DuesDetailModal({
  open, state: modalState, dispatch, styles, colors,
  userId, showToast, onUpdated, onDeleted,
}) {
  const [toggling, setToggling] = useState(null);

  if (!open) return null;

  const dues = modalState.dues;
  if (!dues) return null;

  const members = modalState.members || [];
  const acceptedMembers = members.filter((m) => m.status === "accepted");
  const payments = dues.dues_payments || [];
  const createdBy = dues.created_by_profile;
  const isAdmin = members.some(
    (m) => m.user_id === userId && m.role === "admin" && m.status === "accepted"
  );

  const summary = getDuesPaymentSummary(payments, acceptedMembers.length, dues.amount_cents);
  const paidUserIds = new Set(payments.map((p) => p.user_id));
  const canToggle = isAdmin && !dues.closed;

  async function handleTogglePaid(memberId) {
    if (!canToggle || toggling) return;
    setToggling(memberId);
    try {
      if (paidUserIds.has(memberId)) {
        const { error } = await unmarkPaid(dues.id, memberId);
        if (!error) {
          const updated = payments.filter((p) => p.user_id !== memberId);
          dispatch({
            type: "UPDATE_DUES_DETAIL",
            payload: { dues: { ...dues, dues_payments: updated } },
          });
          onUpdated?.();
        }
      } else {
        const { data, error } = await markPaid(dues.id, memberId);
        if (!error && data) {
          const updated = [...payments, data];
          dispatch({
            type: "UPDATE_DUES_DETAIL",
            payload: { dues: { ...dues, dues_payments: updated } },
          });
          onUpdated?.();
        }
      }
    } finally {
      setToggling(null);
    }
  }

  async function handleClose() {
    const { error } = await closeDues(dues.id);
    if (!error) {
      dispatch({
        type: "UPDATE_DUES_DETAIL",
        payload: { dues: { ...dues, closed: true } },
      });
      showToast?.("Dues closed");
      onUpdated?.();
    }
  }

  function handleDelete() {
    dispatch({
      type: "OPEN_CONFIRM",
      payload: {
        title: "Delete Dues",
        message: `Delete "${dues.title}"? This will remove all payment records.`,
        confirmText: "Delete",
        onConfirm: async () => {
          const { error } = await deleteDues(dues.id);
          dispatch({ type: "CLOSE_CONFIRM" });
          if (!error) {
            dispatch({ type: "CLOSE_DUES_DETAIL" });
            showToast?.("Dues deleted");
            onDeleted?.();
          }
        },
      },
    });
  }

  return (
    <Modal
      open={open}
      title="Dues"
      onClose={() => dispatch({ type: "CLOSE_DUES_DETAIL" })}
      styles={styles}
      footer={isAdmin && !dues.closed ? (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn-press"
            onClick={handleClose}
            style={{ ...styles.secondaryBtn, flex: 1, textAlign: "center", padding: "12px 8px" }}
          >
            Close Dues
          </button>
          <button
            className="btn-press"
            onClick={handleDelete}
            style={{
              flex: 1, textAlign: "center", padding: "12px 8px",
              background: "none", border: "1px solid rgba(231,76,60,0.4)",
              borderRadius: 12, color: "#e74c3c", fontSize: 14,
              fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Delete
          </button>
        </div>
      ) : isAdmin && dues.closed ? (
        <button
          className="btn-press"
          onClick={handleDelete}
          style={{
            width: "100%", textAlign: "center", padding: "12px 8px",
            background: "none", border: "1px solid rgba(231,76,60,0.4)",
            borderRadius: 12, color: "#e74c3c", fontSize: 14,
            fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Delete Dues
        </button>
      ) : undefined}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Header info */}
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{dues.title}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: colors.accent, marginTop: 4 }}>
            {formatAmount(dues.amount_cents)}
          </div>
          {dues.description && (
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 6, lineHeight: 1.4 }}>
              {dues.description}
            </div>
          )}
          <div style={{ fontSize: 12, opacity: 0.5, marginTop: 6 }}>
            Created by @{createdBy?.username || "unknown"}
            {dues.due_date && (
              <span> · Due {new Date(dues.due_date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
            )}
          </div>
          {dues.closed && (
            <span style={{
              display: "inline-block", marginTop: 6,
              fontSize: 10, fontWeight: 700, padding: "2px 8px",
              borderRadius: 999, background: "rgba(231,76,60,0.12)", color: "#e74c3c",
            }}>
              Closed
            </span>
          )}
        </div>

        {/* Summary bar */}
        <div style={{
          padding: "10px 14px", borderRadius: 10,
          background: colors.subtleBg, border: `1px solid ${colors.border}`,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {summary.paid} of {summary.total} paid
            {summary.collectedCents > 0 && (
              <span style={{ opacity: 0.6, fontWeight: 400 }}> — {formatAmount(summary.collectedCents)} collected</span>
            )}
          </div>
          {/* Progress bar */}
          <div style={{
            marginTop: 6, height: 6, borderRadius: 3,
            background: colors.border, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 3,
              background: colors.accent,
              width: summary.total > 0 ? `${(summary.paid / summary.total) * 100}%` : "0%",
              transition: "width 0.3s",
            }} />
          </div>
        </div>

        {/* Member checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.7 }}>
            {canToggle ? "Mark Payments" : "Payment Status"}
          </div>
          {acceptedMembers.map((m) => {
            const p = m.profile;
            const isPaid = paidUserIds.has(m.user_id);
            const isLoading = toggling === m.user_id;
            const isSelf = m.user_id === userId;

            return (
              <div
                key={m.id}
                className={canToggle ? "btn-press" : undefined}
                onClick={canToggle ? () => handleTogglePaid(m.user_id) : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 12px", borderRadius: 10,
                  background: colors.subtleBg,
                  border: `1px solid ${colors.border}`,
                  cursor: canToggle ? "pointer" : "default",
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 20, height: 20, borderRadius: 4,
                  border: `2px solid ${isPaid ? "#27ae60" : colors.border}`,
                  background: isPaid ? "#27ae60" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.15s",
                }}>
                  {isPaid && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  )}
                </div>

                {/* Avatar */}
                <div style={{
                  width: 28, height: 28, borderRadius: 999,
                  background: colors.accent + "22", color: colors.accent,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, flexShrink: 0, overflow: "hidden",
                }}>
                  {p?.avatar_url ? (
                    <img src={p.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: 999, objectFit: "cover" }} />
                  ) : (
                    (p?.username || "?")[0].toUpperCase()
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    @{p?.username || "unknown"}
                    {isSelf && <span style={{ opacity: 0.4, fontWeight: 400 }}> (you)</span>}
                  </span>
                </div>

                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: isPaid ? "#27ae60" : colors.text,
                  opacity: isPaid ? 1 : 0.4,
                }}>
                  {isPaid ? "Paid" : "Unpaid"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
