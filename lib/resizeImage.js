// Shrinks a picture in the browser before upload, so phone photos (often 5 MB+) become a small, fast file.
export function resizeImage(file, maxSide = 1200, quality = 0.85, square = false) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (square) { const m = Math.min(sw, sh); sx = (sw - m) / 2; sy = (sh - m) / 2; sw = sh = m; }
      const k = Math.min(1, maxSide / Math.max(sw, sh));
      const c = document.createElement("canvas");
      c.width = Math.round(sw * k); c.height = Math.round(sh * k);
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not read that picture."))), "image/jpeg", quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read that picture. Try a JPG or PNG.")); };
    img.src = url;
  });
}
