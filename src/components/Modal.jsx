import React from "react";
import { useKeyboardInset } from "../hooks/useKeyboardInset";

export function Modal({ open, title, headerContent, headerActions, children, footer, onClose, styles, fullScreen, hideClose, sheetAnimation }) {
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

  const overlayStyle = fullScreen
    ? { ...styles.modalOverlay, padding: 0, alignItems: "stretch" }
    : { ...styles.modalOverlay, paddingBottom: 10 + kbInset };

  const sheetStyle = fullScreen
    ? { ...styles.modalSheet, borderRadius: 0, height: "100dvh", maxWidth: "100%", display: "flex", flexDirection: "column" }
    : { ...styles.modalSheet, ...(footer ? { height: `calc(95dvh - ${kbInset}px)` } : { maxHeight: `calc(100dvh - ${10 + kbInset}px)` }), display: "flex", flexDirection: "column", animation: sheetAnimation || "modalSlideUp 0.25s cubic-bezier(.2,.8,.3,1)", ...(sheetAnimation && sheetAnimation.includes("cardFlip") ? { backfaceVisibility: "hidden" } : {}) };

  const bodyStyle = fullScreen
    ? { ...styles.modalBody, flex: 1, minHeight: 0, maxHeight: undefined }
    : { ...styles.modalBody, maxHeight: footer ? undefined : `calc(78dvh - ${kbInset}px)`, flex: footer ? 1 : undefined, minHeight: footer ? 0 : undefined, display: footer ? "flex" : undefined, flexDirection: footer ? "column" : undefined };

  return (
    <div style={overlayStyle} onMouseDown={fullScreen ? undefined : onClose}>
      <div
        style={sheetStyle}
        onMouseDown={fullScreen ? undefined : (e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          {headerContent || <div style={styles.modalTitle}>{title}</div>}
          {!hideClose && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {headerActions}
              <button onClick={onClose} style={styles.iconBtn} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div
          style={bodyStyle}
          onFocusCapture={handleFocusCapture}
        >
          {children}
        </div>
        {footer && (
          <div style={{ padding: "8px 12px 12px", flexShrink: 0 }}>
            {footer}
          </div>
        )}
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
          <button className="btn-press" style={styles.secondaryBtn} onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-press" style={styles.dangerBtn} onClick={onConfirm}>
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
          <button className="btn-press" style={styles.secondaryBtn} onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-press" style={styles.primaryBtn} onClick={() => onConfirm(value)}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
