import React from "react";
import { Modal } from "./Modal";
import { createGroup } from "../lib/groupApi";

export function CreateGroupModal({ open, state: modalState, dispatch, styles, colors, onCreated }) {
  if (!open) return null;

  async function handleCreate() {
    const name = (modalState.name || "").trim();
    if (!name) return;

    dispatch({ type: "UPDATE_CREATE_GROUP", payload: { creating: true } });
    const { data, error } = await createGroup(name, modalState.description);
    dispatch({ type: "UPDATE_CREATE_GROUP", payload: { creating: false } });

    if (!error && data) {
      dispatch({ type: "CLOSE_CREATE_GROUP" });
      onCreated?.(data);
    }
  }

  const nameValid = (modalState.name || "").trim().length > 0;

  return (
    <Modal
      open={open}
      title="Create Group"
      onClose={() => dispatch({ type: "CLOSE_CREATE_GROUP" })}
      styles={styles}
      footer={
        <button
          className="btn-press"
          disabled={!nameValid || modalState.creating}
          onClick={handleCreate}
          style={{
            ...styles.primaryBtn,
            width: "100%",
            padding: "14px 12px",
            textAlign: "center",
            opacity: (!nameValid || modalState.creating) ? 0.5 : 1,
          }}
        >
          {modalState.creating ? "Creating..." : "Create Group"}
        </button>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>Group Name</label>
          <input
            className="input-focus"
            value={modalState.name || ""}
            onChange={(e) => dispatch({ type: "UPDATE_CREATE_GROUP", payload: { name: e.target.value.slice(0, 80) } })}
            placeholder="e.g. Masters Water Polo"
            maxLength={80}
            autoFocus
            style={{ ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
          />
          <div style={{ textAlign: "right", fontSize: 11, opacity: 0.4, marginTop: 2 }}>
            {(modalState.name || "").length}/80
          </div>
        </div>

        <div>
          <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>Description (optional)</label>
          <textarea
            className="input-focus"
            value={modalState.description || ""}
            onChange={(e) => dispatch({ type: "UPDATE_CREATE_GROUP", payload: { description: e.target.value.slice(0, 300) } })}
            placeholder="What is this group for?"
            maxLength={300}
            rows={3}
            style={{ ...styles.textInput, fontFamily: "inherit", resize: "none", width: "100%", boxSizing: "border-box" }}
          />
          <div style={{ textAlign: "right", fontSize: 11, opacity: 0.4, marginTop: 2 }}>
            {(modalState.description || "").length}/300
          </div>
        </div>
      </div>
    </Modal>
  );
}
