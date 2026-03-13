import React from "react";
import { Modal } from "./Modal";
import { createPoll } from "../lib/groupApi";

export function CreatePollModal({ open, state: modalState, dispatch, styles, colors, onCreated }) {
  if (!open) return null;

  async function handleCreate() {
    const title = (modalState.title || "").trim();
    if (!title) return;

    dispatch({ type: "UPDATE_CREATE_POLL", payload: { creating: true } });

    // Convert local datetime string to ISO for Supabase TIMESTAMPTZ
    let deadline = null;
    if (modalState.deadline) {
      deadline = new Date(modalState.deadline).toISOString();
    }

    const { data, error } = await createPoll(modalState.groupId, {
      title,
      description: (modalState.description || "").trim() || null,
      eventDate: modalState.eventDate || null,
      eventTime: modalState.eventTime || null,
      eventEndTime: modalState.eventEndTime || null,
      deadline,
      allowSelfCheckin: modalState.allowSelfCheckin || false,
    });

    dispatch({ type: "UPDATE_CREATE_POLL", payload: { creating: false } });

    if (!error && data) {
      dispatch({ type: "CLOSE_CREATE_POLL" });
      onCreated?.(data);
    }
  }

  const titleValid = (modalState.title || "").trim().length > 0;

  return (
    <Modal
      open={open}
      title="Create Poll"
      onClose={() => dispatch({ type: "CLOSE_CREATE_POLL" })}
      styles={styles}
      footer={
        <button
          className="btn-press"
          disabled={!titleValid || modalState.creating}
          onClick={handleCreate}
          style={{
            ...styles.primaryBtn,
            width: "100%",
            padding: "14px 12px",
            textAlign: "center",
            opacity: (!titleValid || modalState.creating) ? 0.5 : 1,
          }}
        >
          {modalState.creating ? "Creating..." : "Create Poll"}
        </button>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Title */}
        <div>
          <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>Title</label>
          <input
            className="input-focus"
            value={modalState.title || ""}
            onChange={(e) => dispatch({ type: "UPDATE_CREATE_POLL", payload: { title: e.target.value.slice(0, 200) } })}
            placeholder="e.g. Tuesday Training Session"
            maxLength={200}
            autoFocus
            style={{ ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
          />
          <div style={{ textAlign: "right", fontSize: 11, opacity: 0.4, marginTop: 2 }}>
            {(modalState.title || "").length}/200
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>Description (optional)</label>
          <textarea
            className="input-focus"
            value={modalState.description || ""}
            onChange={(e) => dispatch({ type: "UPDATE_CREATE_POLL", payload: { description: e.target.value.slice(0, 500) } })}
            placeholder="Details about the event..."
            maxLength={500}
            rows={3}
            style={{ ...styles.textInput, fontFamily: "inherit", resize: "none", width: "100%", boxSizing: "border-box" }}
          />
          <div style={{ textAlign: "right", fontSize: 11, opacity: 0.4, marginTop: 2 }}>
            {(modalState.description || "").length}/500
          </div>
        </div>

        {/* Event Date */}
        <div>
          <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>Event Date</label>
          <input
            className="input-focus"
            type="date"
            value={modalState.eventDate || ""}
            onChange={(e) => dispatch({ type: "UPDATE_CREATE_POLL", payload: { eventDate: e.target.value } })}
            style={{ ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
          />
        </div>

        {/* Start Time + End Time */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>Start Time</label>
            <input
              className="input-focus"
              type="time"
              value={modalState.eventTime || ""}
              onChange={(e) => dispatch({ type: "UPDATE_CREATE_POLL", payload: { eventTime: e.target.value } })}
              style={{ ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>End Time</label>
            <input
              className="input-focus"
              type="time"
              value={modalState.eventEndTime || ""}
              onChange={(e) => dispatch({ type: "UPDATE_CREATE_POLL", payload: { eventEndTime: e.target.value } })}
              style={{ ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>RSVP Deadline (optional)</label>
          <input
            className="input-focus"
            type="datetime-local"
            value={modalState.deadline || ""}
            onChange={(e) => dispatch({ type: "UPDATE_CREATE_POLL", payload: { deadline: e.target.value } })}
            style={{ ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
          />
        </div>

        {/* Allow self check-in */}
        <div
          className="btn-press"
          onClick={() => dispatch({ type: "UPDATE_CREATE_POLL", payload: { allowSelfCheckin: !modalState.allowSelfCheckin } })}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 10,
            background: colors.subtleBg,
            border: `1px solid ${colors.border}`,
            cursor: "pointer",
          }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: 4,
            border: `2px solid ${modalState.allowSelfCheckin ? colors.accent : colors.border}`,
            background: modalState.allowSelfCheckin ? colors.accent : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all 0.15s",
          }}>
            {modalState.allowSelfCheckin && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            )}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Allow self check-in</div>
            <div style={{ fontSize: 12, opacity: 0.5 }}>Members can mark their own attendance</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
