function getDarkenedColorFromImage(image, BRIGHTNESS_THRESHOLD) {
  if (!image || !image.naturalWidth) {
    return "rgb(47, 47, 47)";
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return "rgb(47, 47, 47)";
  }
  canvas.width = 1;
  canvas.height = 1;
  try {
    ctx.drawImage(image, 0, 0, 1, 1);
  } catch (err) {
    return "rgb(47, 47, 47)";
  }

  const pixelData = ctx.getImageData(0, 0, 1, 1).data;
  let [r, g, b] = pixelData;

  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

  let factor;
  if (brightness === 0) {
    r = g = b = BRIGHTNESS_THRESHOLD;
  } else {
    factor = BRIGHTNESS_THRESHOLD / brightness;
    factor = Math.max(0, Math.min(factor, 5.5));
    r = Math.min(255, Math.round(r * factor));
    g = Math.min(255, Math.round(g * factor));
    b = Math.min(255, Math.round(b * factor));
  }

  return `rgb(${r}, ${g}, ${b})`;
}
