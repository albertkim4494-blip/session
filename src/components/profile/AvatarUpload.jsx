import React, { useRef } from "react";
import { supabase } from "../../lib/supabase";
import { avatarInitial } from "../../lib/userIdentity";

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      const size = 256;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      const min = Math.min(img.width, img.height);
      const sx = (img.width - min) / 2;
      const sy = (img.height - min) / 2;
      ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob failed"));
        },
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

export function AvatarUpload({ displayName, username, avatarUrl, avatarPreview, age, session, dispatch, colors }) {
  const fileInputRef = useRef(null);
  const initial = avatarInitial(displayName, username);
  const avatarSrc = avatarPreview || avatarUrl;

  async function handleAvatarPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { error: "Only JPEG, PNG, or WebP images allowed" } });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { avatarPreview: previewUrl, error: "" } });

    try {
      const compressed = await compressImage(file);
      const userId = session.user.id;
      const path = `${userId}/avatar.jpg`;

      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(path, compressed, { upsert: true, contentType: "image/jpeg" });

      if (uploadErr) {
        dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { avatarPreview: null, error: uploadErr.message } });
        URL.revokeObjectURL(previewUrl);
        return;
      }

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = urlData.publicUrl + "?t=" + Date.now();

      dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { avatarUrl: publicUrl, avatarPreview: null } });
      URL.revokeObjectURL(previewUrl);
    } catch (err) {
      dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { avatarPreview: null, error: "Upload failed. Try again." } });
      URL.revokeObjectURL(previewUrl);
    }

    e.target.value = "";
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleAvatarPick}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, paddingTop: 4, paddingBottom: 4 }}>
        <div style={{ position: "relative", width: 68, height: 68 }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: 68,
              height: 68,
              borderRadius: 999,
              background: colors?.primaryBg || "#D4A574",
              color: colors?.primaryText || "#e8eef7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 28,
              border: `2px solid ${colors?.border || "rgba(255,255,255,0.10)"}`,
              cursor: "pointer",
              padding: 0,
              overflow: "hidden",
            }}
            aria-label="Change profile picture"
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              initial
            )}
          </button>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 22,
              height: 22,
              borderRadius: 999,
              background: colors?.primaryBg || "#D4A574",
              border: `2px solid ${colors?.cardBg || "#231F1A"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={colors?.primaryText || "#e8eef7"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>
          {displayName?.trim() || username || "User"}
        </div>
        <div style={{ fontSize: 13, opacity: 0.5, fontWeight: 600 }}>
          @{username || "\u2014"}
        </div>
        {age !== null && (
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 999,
            background: colors?.cardAltBg || "rgba(255,255,255,0.06)",
            border: `1px solid ${colors?.border || "rgba(255,255,255,0.10)"}`,
            marginTop: 2,
          }}>
            {age} yrs old
          </div>
        )}
      </div>
    </>
  );
}
