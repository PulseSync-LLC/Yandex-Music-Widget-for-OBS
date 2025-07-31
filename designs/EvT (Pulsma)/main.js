let oldTrackId = null;

let pendingTitle = "";
let pendingArtist = "";
let pendingStatus = "";

const cardContent = document.getElementById("music-card-content");
const albumArtEl = document.getElementById("albumArt");
const trackTitleEl = document.getElementById("trackTitle");
const trackArtistEl = document.getElementById("trackArtist");
const cardEl = document.getElementById("music-card");

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
    }, 500);
  }, 500);
}

function updateCard(track) {
  albumArtEl.style.opacity = 0;
  albumArtEl.src = "default.png";

  let newAlbumArt = null;
  if (track?.coverUri) {
    newAlbumArt = `https://${track?.coverUri.replace('%%', '1000x1000')}`;
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
        const color = getDarkenedColorFromImage(tempImg, 40);
        cardEl.style.backgroundColor = color;
      } catch (err) {
        console.warn("Ошибка при getImageData():", err);
        cardEl.style.backgroundColor = "#2f2f2f";
      }
    };
    tempImg.onerror = () => {
      albumArtEl.src = "default.png";
      albumArtEl.style.opacity = 1;
      cardEl.style.backgroundColor = "#2f2f2f";
    };
    tempImg.src = newAlbumArt;
  } else {
    albumArtEl.style.opacity = 1;
    cardEl.style.backgroundColor = "#2f2f2f";
  }

  pendingTitle = track.title || "Unknown Title";
  if (track.artists && track.artists.length > 0) {
    pendingArtist = track.artists[0].name || "Unknown Artist";
  } else {
    pendingArtist = "Unknown Artist";
  }
  pendingStatus = `Статус: ${track.status}`;
}

fetchTrackStatus();
setInterval(fetchTrackStatus, 1000);
