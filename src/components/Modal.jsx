import React, { useEffect, useId, useRef } from "react";
import { useKeyboardInset } from "../hooks/useKeyboardInset";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ open, title, headerContent, headerActions, children, footer, onClose, styles, fullScreen, hideClose, sheetAnimation, noChrome, sheetRef, footerRef, bodyRef, ariaLabel, compactHeight }) {
  const kbInset = useKeyboardInset();
  const internalSheetRef = useRef(null);
  const previousFocusRef = useRef(null);
  const titleId = useId();

  const setSheetRef = (el) => {
    internalSheetRef.current = el;
    if (sheetRef) {
      if (typeof sheetRef === "function") sheetRef(el);
      else sheetRef.current = el;
    }
  };

  // Focus management: save the previously-focused element on open, focus the
  // sheet itself (tabIndex=-1 so no visible focus ring) — this keeps the modal
  // accessible to keyboard users without auto-highlighting a random header
  // button on touch. Inputs with React's `autoFocus` still get focus naturally
  // because we don't override them after mount.
  useEffect(() => {
    if (!open) return undefined;
    previousFocusRef.current = document.activeElement;
    const sheet = internalSheetRef.current;
    if (sheet) sheet.focus({ preventScroll: true });
    return () => {
      const prev = previousFocusRef.current;
      if (prev && typeof prev.focus === "function" && document.contains(prev)) {
        prev.focus({ preventScroll: true });
      }
    };
  }, [open]);

  // Keyboard: Escape closes, Tab is trapped within the sheet.
  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === "Escape" && onClose) {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const sheet = internalSheetRef.current;
      if (!sheet) return;
      const focusable = Array.from(sheet.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (focusable.length === 0) {
        e.preventDefault();
        sheet.focus({ preventScroll: true });
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !sheet.contains(active))) {
        e.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!e.shiftKey && (active === last || !sheet.contains(active))) {
        e.preventDefault();
        first.focus({ preventScroll: true });
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
    : { ...styles.modalSheet, ...(compactHeight ? { maxHeight: `calc(95dvh - ${kbInset}px)` } : ((footer || noChrome) ? { height: `calc(95dvh - ${kbInset}px)` } : { maxHeight: `calc(100dvh - ${10 + kbInset}px)` })), display: "flex", flexDirection: "column", animation: sheetAnimation || "modalSlideUp 0.25s cubic-bezier(.2,.8,.3,1)" };

  const dialogA11y = {
    role: "dialog",
    "aria-modal": "true",
    tabIndex: -1,
    ...(title ? { "aria-labelledby": titleId } : ariaLabel ? { "aria-label": ariaLabel } : { "aria-label": "Dialog" }),
  };

  if (noChrome) {
    // overflow:visible + transparent bg so 3D preserve-3d works (faces carry their own bg)
    const noChromeSheet = { ...sheetStyle, overflow: "visible", background: "transparent", border: "none", boxShadow: "none" };
    return (
      <div style={overlayStyle} onMouseDown={onClose}>
        <div
          ref={setSheetRef}
          style={noChromeSheet}
          onMouseDown={(e) => e.stopPropagation()}
          {...dialogA11y}
        >
          {children}
        </div>
      </div>
    );
  }

  const bodyStyle = fullScreen
    ? { ...styles.modalBody, flex: 1, minHeight: 0, maxHeight: undefined }
    : { ...styles.modalBody, maxHeight: footer ? undefined : `calc(78dvh - ${kbInset}px)`, flex: footer ? 1 : undefined, minHeight: footer ? 0 : undefined, display: footer ? "flex" : undefined, flexDirection: footer ? "column" : undefined };

  return (
    <div style={overlayStyle} onMouseDown={fullScreen ? undefined : onClose}>
      <div
        ref={setSheetRef}
        style={sheetStyle}
        onMouseDown={fullScreen ? undefined : (e) => e.stopPropagation()}
        {...dialogA11y}
      >
        <div style={styles.modalHeader}>
          {headerContent || <div id={titleId} style={styles.modalTitle}>{title}</div>}
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
          ref={bodyRef}
          style={bodyStyle}
          onFocusCapture={handleFocusCapture}
        >
          {children}
        </div>
        {footer && (
          <div ref={footerRef} style={{ padding: "8px 12px 12px", flexShrink: 0 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, title, message, confirmText = "Delete", onCancel, onConfirm, styles }) {
  if (!open) return null;

  // Higher z-index so confirm dialog renders above all other modals
  const confirmStyles = { ...styles, modalOverlay: { ...styles.modalOverlay, zIndex: 60 } };

  return (
    <Modal open={open} title={title} onClose={onCancel} styles={confirmStyles}>
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
