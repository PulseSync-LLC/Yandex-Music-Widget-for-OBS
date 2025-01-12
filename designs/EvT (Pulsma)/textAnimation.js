function animateMatrixText(element, finalText, speed = 50) {
  if (!finalText) {
    element.textContent = "";
    return;
  }

  const chars = "@#$%&?";

  let displayArr = [];
  for (let i = 0; i < finalText.length; i++) {
    const randIndex = Math.floor(Math.random() * chars.length);
    displayArr.push(chars[randIndex]);
  }
  element.textContent = displayArr.join("");

  let currentIndex = 0;
  const interval = setInterval(() => {
    displayArr[currentIndex] = finalText[currentIndex];
    element.textContent = displayArr.join("");
    currentIndex++;

    if (currentIndex >= finalText.length) {
      clearInterval(interval);
    }
  }, speed);
}
