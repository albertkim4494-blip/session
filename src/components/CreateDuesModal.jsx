import React from "react";
import { Modal } from "./Modal";
import { createDues } from "../lib/groupApi";
import { parseDollarsToCents } from "../lib/announcementUtils";

export function CreateDuesModal({ open, state: modalState, dispatch, styles, colors, onCreated }) {
  if (!open) return null;

  async function handleCreate() {
    const title = (modalState.title || "").trim();
    if (!title) return;

    const amountCents = parseDollarsToCents(modalState.amount || "");
    if (amountCents == null || amountCents <= 0) return;

    dispatch({ type: "UPDATE_CREATE_DUES", payload: { creating: true } });

    const { data, error } = await createDues(modalState.groupId, {
      title,
      amountCents,
      description: (modalState.description || "").trim() || null,
      dueDate: modalState.dueDate || null,
    });

    dispatch({ type: "UPDATE_CREATE_DUES", payload: { creating: false } });

    if (!error && data) {
      dispatch({ type: "CLOSE_CREATE_DUES" });
      onCreated?.(data);
    }
  }

  const titleValid = (modalState.title || "").trim().length > 0;
  const amountCents = parseDollarsToCents(modalState.amount || "");
  const amountValid = amountCents != null && amountCents > 0;
  const formValid = titleValid && amountValid;

  return (
    <Modal
      open={open}
      title="Create Dues"
      onClose={() => dispatch({ type: "CLOSE_CREATE_DUES" })}
      styles={styles}
      footer={
        <button
          className="btn-press"
          disabled={!formValid || modalState.creating}
          onClick={handleCreate}
          style={{
            ...styles.primaryBtn,
            width: "100%",
            padding: "14px 12px",
            textAlign: "center",
            opacity: (!formValid || modalState.creating) ? 0.5 : 1,
          }}
        >
          {modalState.creating ? "Creating..." : "Create Dues"}
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
            onChange={(e) => dispatch({ type: "UPDATE_CREATE_DUES", payload: { title: e.target.value.slice(0, 200) } })}
            placeholder="e.g. March Club Dues"
            maxLength={200}
            autoFocus
            style={{ ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
          />
          <div style={{ textAlign: "right", fontSize: 11, opacity: 0.4, marginTop: 2 }}>
            {(modalState.title || "").length}/200
          </div>
        </div>

        {/* Amount */}
        <div>
          <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>Amount ($)</label>
          <input
            className="input-focus"
            value={modalState.amount || ""}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, "");
              dispatch({ type: "UPDATE_CREATE_DUES", payload: { amount: val } });
            }}
            placeholder="15.00"
            inputMode="decimal"
            style={{ ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>Description (optional)</label>
          <textarea
            className="input-focus"
            value={modalState.description || ""}
            onChange={(e) => dispatch({ type: "UPDATE_CREATE_DUES", payload: { description: e.target.value.slice(0, 500) } })}
            placeholder="What are these dues for..."
            maxLength={500}
            rows={3}
            style={{ ...styles.textInput, fontFamily: "inherit", resize: "none", width: "100%", boxSizing: "border-box" }}
          />
          <div style={{ textAlign: "right", fontSize: 11, opacity: 0.4, marginTop: 2 }}>
            {(modalState.description || "").length}/500
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>Due Date (optional)</label>
          <input
            className="input-focus"
            type="date"
            value={modalState.dueDate || ""}
            onChange={(e) => dispatch({ type: "UPDATE_CREATE_DUES", payload: { dueDate: e.target.value } })}
            style={{ ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
          />
        </div>
      </div>
    </Modal>
  );
}
