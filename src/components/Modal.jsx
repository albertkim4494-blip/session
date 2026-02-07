import React from "react";
import { useKeyboardInset } from "../hooks/useKeyboardInset";

export function Modal({ open, title, children, onClose, styles }) {
  const kbInset = useKeyboardInset();

  if (!open) return null;

  const handleFocusCapture = (e) => {
    const el = e.target;
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT") {
      setTimeout(() => {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 120);
    }
  };

  return (
    <div style={{ ...styles.modalOverlay, paddingBottom: 10 + kbInset }} onMouseDown={onClose}>
      <div
        style={{ ...styles.modalSheet, maxHeight: `calc(100dvh - ${10 + kbInset}px)` }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>{title}</div>
          <button onClick={onClose} style={styles.iconBtn} aria-label="Close">
            ×
          </button>
        </div>
        <div
          style={{ ...styles.modalBody, maxHeight: `calc(78dvh - ${kbInset}px)` }}
          onFocusCapture={handleFocusCapture}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function ConfirmModal({ open, title, message, confirmText = "Delete", onCancel, onConfirm, styles }) {
  if (!open) return null;

  return (
    <Modal open={open} title={title} onClose={onCancel} styles={styles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={styles.smallText}>{message}</div>
        <div style={styles.modalFooter}>
          <button style={styles.secondaryBtn} onClick={onCancel}>
            Cancel
          </button>
          <button style={styles.dangerBtn} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function InputModal({
  open,
  title,
  label,
  placeholder,
  value = "",
  confirmText = "Save",
  onCancel,
  onConfirm,
  onChange,
  styles,
}) {
  if (!open) return null;

  return (
    <Modal open={open} title={title} onClose={onCancel} styles={styles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={styles.fieldCol}>
          <label style={styles.label}>{label}</label>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={styles.textInput}
            placeholder={placeholder}
            autoFocus
          />
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.secondaryBtn} onClick={onCancel}>
            Cancel
          </button>
          <button style={styles.primaryBtn} onClick={() => onConfirm(value)}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
