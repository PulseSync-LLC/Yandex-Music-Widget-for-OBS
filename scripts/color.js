function getDarkenedColorFromImage(image, BRIGHTNESS_THRESHOLD) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 1;
  canvas.height = 1;
  ctx.drawImage(image, 0, 0, 1, 1);

  const pixelData = ctx.getImageData(0, 0, 1, 1).data;
  let [r, g, b] = pixelData;

  // Рассчитываем текущую яркость
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

  // Нормализация — теперь работает и вверх, и вниз
  let factor;
  if (brightness === 0) {
    // Для абсолютно чёрного — задаём просто белый или любой светлый цвет
    r = g = b = BRIGHTNESS_THRESHOLD;
  } else {
    factor = BRIGHTNESS_THRESHOLD / brightness;
    // Слишком большие значения ограничиваем (иначе получится белый)
    factor = Math.max(0, Math.min(factor, 5.5));
    r = Math.min(255, Math.round(r * factor));
    g = Math.min(255, Math.round(g * factor));
    b = Math.min(255, Math.round(b * factor));
  }

  return `rgb(${r}, ${g}, ${b})`;
}
