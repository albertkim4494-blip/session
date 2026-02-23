import { supabase } from "./supabase";

const MAX_GIF_SIZE = 5 * 1024 * 1024; // 5MB
const IMG_SIZE = 512;

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = IMG_SIZE;
      canvas.height = IMG_SIZE;
      const ctx = canvas.getContext("2d");

      // Center-crop to square
      const min = Math.min(img.width, img.height);
      const sx = (img.width - min) / 2;
      const sy = (img.height - min) / 2;
      ctx.drawImage(img, sx, sy, min, min, 0, 0, IMG_SIZE, IMG_SIZE);

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

export async function uploadExerciseImage(file, userId, exerciseId) {
  const isGif = file.type === "image/gif";

  let blob, ext;
  if (isGif) {
    if (file.size > MAX_GIF_SIZE) {
      throw new Error("GIF must be under 5MB");
    }
    blob = file;
    ext = "gif";
  } else {
    blob = await compressImage(file);
    ext = "jpg";
  }

  const path = `${userId}/${exerciseId}.${ext}`;
  const contentType = isGif ? "image/gif" : "image/jpeg";

  const { error: uploadErr } = await supabase.storage
    .from("exercise-images")
    .upload(path, blob, { upsert: true, contentType });

  if (uploadErr) throw new Error(uploadErr.message);

  const { data: urlData } = supabase.storage
    .from("exercise-images")
    .getPublicUrl(path);

  return urlData.publicUrl + "?t=" + Date.now();
}

export async function removeExerciseImage(userId, exerciseId) {
  // Remove both .jpg and .gif variants (best effort)
  await Promise.allSettled([
    supabase.storage.from("exercise-images").remove([`${userId}/${exerciseId}.jpg`]),
    supabase.storage.from("exercise-images").remove([`${userId}/${exerciseId}.gif`]),
  ]);
}
