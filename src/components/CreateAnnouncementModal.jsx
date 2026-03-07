import React from "react";
import { Modal } from "./Modal";
import { createAnnouncement } from "../lib/groupApi";

export function CreateAnnouncementModal({ open, state: modalState, dispatch, styles, colors, onCreated }) {
  if (!open) return null;

  async function handlePost() {
    const body = (modalState.body || "").trim();
    if (!body) return;

    dispatch({ type: "UPDATE_CREATE_ANNOUNCEMENT", payload: { posting: true } });

    const { data, error } = await createAnnouncement(modalState.groupId, body);

    dispatch({ type: "UPDATE_CREATE_ANNOUNCEMENT", payload: { posting: false } });

    if (!error && data) {
      dispatch({ type: "CLOSE_CREATE_ANNOUNCEMENT" });
      onCreated?.(data);
    }
  }

  const bodyValid = (modalState.body || "").trim().length > 0;

  return (
    <Modal
      open={open}
      title="Post Announcement"
      onClose={() => dispatch({ type: "CLOSE_CREATE_ANNOUNCEMENT" })}
      styles={styles}
      footer={
        <button
          className="btn-press"
          disabled={!bodyValid || modalState.posting}
          onClick={handlePost}
          style={{
            ...styles.primaryBtn,
            width: "100%",
            padding: "14px 12px",
            textAlign: "center",
            opacity: (!bodyValid || modalState.posting) ? 0.5 : 1,
          }}
        >
          {modalState.posting ? "Posting..." : "Post"}
        </button>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <textarea
          className="input-focus"
          value={modalState.body || ""}
          onChange={(e) => dispatch({ type: "UPDATE_CREATE_ANNOUNCEMENT", payload: { body: e.target.value.slice(0, 2000) } })}
          placeholder="Share an update with the group..."
          maxLength={2000}
          rows={5}
          autoFocus
          style={{ ...styles.textInput, fontFamily: "inherit", resize: "none", width: "100%", boxSizing: "border-box" }}
        />
        <div style={{ textAlign: "right", fontSize: 11, opacity: 0.4 }}>
          {(modalState.body || "").length}/2000
        </div>
      </div>
    </Modal>
  );
}
