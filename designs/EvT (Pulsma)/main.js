let oldTrackId = null;

let pendingTitle = "";
let pendingArtist = "";
let pendingStatus = "";

function getURLParams() {
  const urlParams = new URLSearchParams(window.location.search);

  const fade = parseFloat(urlParams.get("fade"));
  const fadeOpacity = isNaN(fade) || fade < 0 || fade > 1 ? 1 : fade;

  const autoColorParam = urlParams.get("autoColor");
  const autoColor = autoColorParam === null || autoColorParam === "true";

  const autoSizeParam = urlParams.get("autoSize");
  const autoSize = autoSizeParam === null || autoSizeParam === "true";

  const position = urlParams.get("position") || "top-left";
  const offsetX = parseFloat(urlParams.get("offsetX")) || 25;
  const offsetY = parseFloat(urlParams.get("offsetY")) || 25;

  return { fadeOpacity, autoColor, autoSize, position, offsetX, offsetY };
}

const { fadeOpacity, autoColor, autoSize, position, offsetX, offsetY } =
  getURLParams();

const cardContent = document.getElementById("music-card-content");
const albumArtEl = document.getElementById("albumArt");
const trackTitleEl = document.getElementById("trackTitle");
const trackArtistEl = document.getElementById("trackArtist");
const cardEl = document.getElementById("music-card");

if (autoSize) {
  cardEl.classList.add("auto-size");
}

function applyPosition() {
  cardEl.style.position = "fixed";
  cardEl.style.margin = "0";
  cardEl.style.zIndex = "9999";
  cardEl.style.transform = "";
  cardEl.style.top = "";
  cardEl.style.bottom = "";
  cardEl.style.left = "";
  cardEl.style.right = "";

  switch (position) {
    case "top-left":
      cardEl.style.top = `${offsetY}px`;
      cardEl.style.left = `${offsetX}px`;
      break;
    case "top-right":
      cardEl.style.top = `${offsetY}px`;
      cardEl.style.right = `${offsetX}px`;
      break;
    case "bottom-left":
      cardEl.style.bottom = `${offsetY}px`;
      cardEl.style.left = `${offsetX}px`;
      break;
    case "bottom-right":
      cardEl.style.bottom = `${offsetY}px`;
      cardEl.style.right = `${offsetX}px`;
      break;
    case "center":
      cardEl.style.top = `calc(50% + ${offsetY}px)`;
      cardEl.style.left = `calc(50% + ${offsetX}px)`;
      cardEl.style.transform = "translate(-50%, -50%)";
      break;
    default:
      cardEl.style.top = `${offsetY}px`;
      cardEl.style.left = `${offsetX}px`;
      break;
  }
}

function measureTextWidth(text, element) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0;

  const style = window.getComputedStyle(element);
  const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  ctx.font = font;
  return Math.ceil(ctx.measureText(text || "").width);
}

function resizeCard(titleText = pendingTitle, artistText = pendingArtist) {
  if (!autoSize) return;

  const titleWidth = measureTextWidth(titleText, trackTitleEl);
  const artistWidth = measureTextWidth(artistText, trackArtistEl);
  const maxTextWidth = Math.max(titleWidth, artistWidth);

  const artWidth = 50;
  const padding = 20;
  const gap = 10;
  const newWidth = artWidth + gap + maxTextWidth + padding;

  cardEl.style.width = Math.max(200, newWidth) + "px";
}

async function fetchTrackStatus() {
  try {
    const data = await fetchTrackStatusFromApi();

    if (data?.track) {
      const newTrackId = data.track.realId;

      if (newTrackId !== oldTrackId) {
        oldTrackId = newTrackId;
        animateTrackChange(data.track);
      }
    } else {
      console.warn("Некорректные данные");
    }
  } catch (error) {
    console.error("Ошибка при получении данных о треке:", error);
  }
}

function animateTrackChange(track) {
  cardContent.classList.add("slideOut");

  setTimeout(() => {
    cardContent.classList.remove("slideOut");

    trackTitleEl.textContent = "";
    trackArtistEl.textContent = "";

    updateCard(track);

    cardContent.classList.add("slideIn");
    setTimeout(() => {
      cardContent.classList.remove("slideIn");

      animateMatrixText(trackTitleEl, pendingTitle, 50);
      animateMatrixText(trackArtistEl, pendingArtist, 50);

      if (autoSize) {
        const maxLength = Math.max(pendingTitle.length, pendingArtist.length);
        const animationDuration = maxLength * 50;

        resizeCard(pendingTitle, pendingArtist);

        setTimeout(() => {
          resizeCard(pendingTitle, pendingArtist);
        }, animationDuration / 2);

        setTimeout(() => {
          resizeCard(pendingTitle, pendingArtist);
          setTimeout(() => {
            resizeCard(pendingTitle, pendingArtist);
          }, 100);
        }, animationDuration + 50);
      }
    }, 500);
  }, 500);
}

function updateCard(track) {
  albumArtEl.style.opacity = 0;
  albumArtEl.src = "default.png";

  let newAlbumArt = null;
  if (track?.coverUri) {
    newAlbumArt = `https://${track?.coverUri.replace("%%", "1000x1000")}`;
  }
  if (newAlbumArt) {
    const tempImg = new Image();
    tempImg.crossOrigin = "anonymous";
    tempImg.onload = () => {
      albumArtEl.src = newAlbumArt;
      setTimeout(() => {
        albumArtEl.style.opacity = 1;
      }, 50);

      try {
        if (autoColor) {
          const color = getDarkenedColorFromImage(tempImg, 40);
          let r, g, b;
          if (color.startsWith("rgb")) {
            const match = color.match(/\d+/g);
            if (match) {
              r = parseInt(match[0]);
              g = parseInt(match[1]);
              b = parseInt(match[2]);
            } else {
              r = g = b = 47;
            }
          } else if (color.startsWith("#")) {
            r = parseInt(color.slice(1, 3), 16);
            g = parseInt(color.slice(3, 5), 16);
            b = parseInt(color.slice(5, 7), 16);
          } else {
            r = g = b = 47;
          }
          cardEl.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${fadeOpacity})`;
        } else {
          cardEl.style.backgroundColor = `rgba(47, 47, 47, ${fadeOpacity})`;
        }
      } catch (err) {
        console.warn("Ошибка при getImageData():", err);
        cardEl.style.backgroundColor = `rgba(47, 47, 47, ${fadeOpacity})`;
      }
    };
    tempImg.onerror = () => {
      albumArtEl.src = "default.png";
      albumArtEl.style.opacity = 1;
      cardEl.style.backgroundColor = `rgba(47, 47, 47, ${fadeOpacity})`;
    };
    tempImg.src = newAlbumArt;
  } else {
    albumArtEl.style.opacity = 1;
    cardEl.style.backgroundColor = `rgba(47, 47, 47, ${fadeOpacity})`;
  }

  pendingTitle = track.title || "Unknown Title";
  if (track.artists && track.artists.length > 0) {
    pendingArtist = track.artists[0].name || "Unknown Artist";
  } else {
    pendingArtist = "Unknown Artist";
  }
  pendingStatus = `Статус: ${track.status}`;
}

cardEl.style.backgroundColor = `rgba(47, 47, 47, ${fadeOpacity})`;
applyPosition();

fetchTrackStatus().then(() => {
  if (autoSize) {
    setTimeout(() => resizeCard(), 100);
    setTimeout(() => resizeCard(), 500);
    setTimeout(() => resizeCard(), 1000);
  }
});

if (autoSize) {
  setInterval(() => {
    resizeCard();
  }, 2000);
}

setInterval(fetchTrackStatus, 1000);
