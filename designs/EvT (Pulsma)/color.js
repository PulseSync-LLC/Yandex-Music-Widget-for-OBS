function getDarkenedColorFromImage(image) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 1;
  canvas.height = 1;
  ctx.drawImage(image, 0, 0, 1, 1);

  const pixelData = ctx.getImageData(0, 0, 1, 1).data;
  let [r, g, b] = pixelData;

  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

  const BRIGHTNESS_THRESHOLD = 70;
  if (brightness > BRIGHTNESS_THRESHOLD) {
    const factor = BRIGHTNESS_THRESHOLD / brightness;
    r = Math.round(r * factor);
    g = Math.round(g * factor);
    b = Math.round(b * factor);
  }

  return `rgb(${r}, ${g}, ${b})`;
}
