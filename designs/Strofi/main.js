let oldTrackId = null;
let currentImageEl = document.getElementById("currentImage");
let nextImageEl = document.getElementById("nextImage");
let currentItemEl = document.getElementById("currentItem");
let nextItemEl = document.getElementById("nextItem");
let trackTitleEl = document.getElementById("trackTitle");
let trackArtistEl = document.getElementById("trackArtist");
let trackInfoEl = document.querySelector(".track-info-overlay");
let progressBarEl = document.querySelector(".progress-bar");
let hasFirstCover = false;
let progressInterval = null;
let currentStatus = null;
let currentDuration = 0;
let currentPosition = 0;

function getURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  
  const position = urlParams.get("position") || "top-left";
  const offsetX = parseFloat(urlParams.get("offsetX")) || 25;
  const offsetY = parseFloat(urlParams.get("offsetY")) || 25;
  
  return { position, offsetX, offsetY };
}

const { position, offsetX, offsetY } = getURLParams();
const containerEl = document.getElementById("strofiContainer");

const isPreview = window.self !== window.top || window.innerHeight < 500;

function applyPosition() {
  if (isPreview) {
    containerEl.style.position = "relative";
    containerEl.style.width = "100%";
    containerEl.style.height = "100%";
    containerEl.style.minHeight = "200px";
    containerEl.style.display = "flex";
    containerEl.style.alignItems = "center";
    containerEl.style.justifyContent = "center";
    containerEl.style.margin = "0";
    containerEl.style.zIndex = "1";
  } else {
    containerEl.style.position = "fixed";
    containerEl.style.width = "100vw";
    containerEl.style.height = "100vh";
    containerEl.style.margin = "0";
    containerEl.style.zIndex = "9999";
    containerEl.style.transform = "";
    containerEl.style.top = "";
    containerEl.style.bottom = "";
    containerEl.style.left = "";
    containerEl.style.right = "";

    switch (position) {
      case "top-left":
        containerEl.style.top = `${offsetY}px`;
        containerEl.style.left = `${offsetX}px`;
        containerEl.style.alignItems = "flex-start";
        containerEl.style.justifyContent = "flex-start";
        break;
      case "top-right":
        containerEl.style.top = `${offsetY}px`;
        containerEl.style.right = `${offsetX}px`;
        containerEl.style.alignItems = "flex-start";
        containerEl.style.justifyContent = "flex-end";
        break;
      case "bottom-left":
        containerEl.style.bottom = `${offsetY}px`;
        containerEl.style.left = `${offsetX}px`;
        containerEl.style.alignItems = "flex-end";
        containerEl.style.justifyContent = "flex-start";
        break;
      case "bottom-right":
        containerEl.style.bottom = `${offsetY}px`;
        containerEl.style.right = `${offsetX}px`;
        containerEl.style.alignItems = "flex-end";
        containerEl.style.justifyContent = "flex-end";
        break;
      case "center":
        containerEl.style.top = `calc(50% + ${offsetY}px)`;
        containerEl.style.left = `calc(50% + ${offsetX}px)`;
        containerEl.style.transform = "translate(-50%, -50%)";
        containerEl.style.alignItems = "center";
        containerEl.style.justifyContent = "center";
        break;
      default:
        containerEl.style.top = `${offsetY}px`;
        containerEl.style.left = `${offsetX}px`;
        containerEl.style.alignItems = "flex-start";
        containerEl.style.justifyContent = "flex-start";
        break;
    }
  }
}

applyPosition();

const animationTypes = ['slide', 'fade', 'rotate', 'zoom'];
let currentAnimationType = 0;

function getNextAnimationType() {
  currentAnimationType = (currentAnimationType + 1) % animationTypes.length;
  return animationTypes[currentAnimationType];
}

function setImageSource(imgEl, src) {
  if (src && src.startsWith('https://')) {
    imgEl.crossOrigin = 'anonymous';
  } else {
    if (typeof imgEl.removeAttribute === "function") {
      imgEl.removeAttribute('crossOrigin');
    } else {
      imgEl.crossOrigin = null;
    }
  }
  imgEl.src = src || 'default.png';
}

function switchImages(newImageSrc) {
  const src = newImageSrc || "default.png";

  const tempImg = new Image();
  setImageSource(tempImg, src);
  
  tempImg.onload = () => {
    if (!hasFirstCover) {
      setImageSource(currentImageEl, src);
      setImageSource(nextImageEl, src);

      currentItemEl.classList.remove(
        "entering",
        "exiting",
        "fade-entering",
        "fade-exiting",
        "rotate-entering",
        "zoom-entering",
        "zoom-exiting",
      );
      nextItemEl.classList.remove(
        "entering",
        "exiting",
        "fade-entering",
        "fade-exiting",
        "rotate-entering",
        "zoom-entering",
        "zoom-exiting",
      );
      currentItemEl.classList.add("active");
      nextItemEl.classList.add("next");

      hasFirstCover = true;
      return;
    }

    setImageSource(nextImageEl, src);

    currentItemEl.classList.remove("entering", "exiting", "fade-entering", "fade-exiting", "rotate-entering", "zoom-entering", "zoom-exiting");
    nextItemEl.classList.remove("entering", "exiting", "fade-entering", "fade-exiting", "rotate-entering", "zoom-entering", "zoom-exiting", "next", "active");

    const animType = getNextAnimationType();

    requestAnimationFrame(() => {
      currentItemEl.classList.remove("active");
      
      nextItemEl.style.zIndex = "3";
      
      if (animType === "slide") {
        currentItemEl.classList.add("exiting");
        nextItemEl.classList.add("entering");
      } else if (animType === "fade") {
        currentItemEl.classList.add("fade-exiting");
        nextItemEl.classList.add("fade-entering");
      } else if (animType === "rotate") {
        currentItemEl.classList.add("fade-exiting");
        nextItemEl.classList.add("rotate-entering");
      } else if (animType === "zoom") {
        currentItemEl.classList.add("zoom-exiting");
        nextItemEl.classList.add("zoom-entering");
      }
      
      requestAnimationFrame(() => {
        nextItemEl.classList.add("active");
      });
    });

    setTimeout(() => {
      setImageSource(currentImageEl, src);
      setImageSource(nextImageEl, src);

      currentItemEl.classList.remove("exiting", "fade-exiting", "zoom-exiting", "active");
      nextItemEl.classList.remove("entering", "fade-entering", "rotate-entering", "zoom-entering");

      currentItemEl.classList.add("next");
      nextItemEl.classList.add("active");
      nextItemEl.classList.remove("next");
      nextItemEl.style.zIndex = "";

      const tempItem = currentItemEl;
      currentItemEl = nextItemEl;
      nextItemEl = tempItem;

      const tempImgEl = currentImageEl;
      currentImageEl = nextImageEl;
      nextImageEl = tempImgEl;
    }, 850);
  };
  
  tempImg.onerror = () => {
    console.warn('Failed to load image:', src);
    setImageSource(nextImageEl, 'default.png');
  };
}

function animateTrackInfoOverlay() {
  if (!trackInfoEl) return;

  trackInfoEl.classList.remove("info-enter", "info-exit", "info-sweep");
  void trackInfoEl.offsetWidth;
  trackInfoEl.classList.add("info-exit");

  requestAnimationFrame(() => {
    trackInfoEl.classList.remove("info-exit");
    trackInfoEl.classList.add("info-enter", "info-sweep");
  });

  setTimeout(() => {
    trackInfoEl.classList.remove("info-enter", "info-sweep");
  }, 900);
}

function updateTrackInfo(title, artist) {
  const safeTitle = title || "Unknown Title";
  const safeArtist = artist || "Unknown Artist";
  applyMarquee(trackTitleEl, safeTitle);
  applyMarquee(trackArtistEl, safeArtist);
  
  trackTitleEl.style.animation = 'none';
  trackArtistEl.style.animation = 'none';
  setTimeout(() => {
    trackTitleEl.style.animation = 'fadeIn 0.5s ease';
    trackArtistEl.style.animation = 'fadeIn 0.5s ease';
  }, 10);
}

function applyMarquee(element, text) {
  if (!element) return;

  element.classList.remove("marquee");
  element.style.removeProperty("--marquee-distance");
  element.innerHTML = `<span class="marquee-text">${text}</span>`;

  requestAnimationFrame(() => {
    const span = element.querySelector(".marquee-text");
    if (!span) return;

    const containerWidth = element.clientWidth;
    const textWidth = span.scrollWidth;
    const overflow = textWidth - containerWidth;

    if (overflow > 8) {
      element.classList.add("marquee");
      element.style.setProperty("--marquee-distance", `${overflow}px`);
    }
  });
}

function updateProgressRing(positionSec, durationSec) {
  if (!progressBarEl || !durationSec) return;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(positionSec / durationSec, 0), 1);
  const offset = circumference * (1 - progress);
  progressBarEl.style.strokeDasharray = `${circumference.toFixed(2)}`;
  progressBarEl.style.strokeDashoffset = `${offset.toFixed(2)}`;
}

function startProgressTimer() {
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (currentStatus !== "playing") return;
    currentPosition += 0.1;
    if (currentPosition > currentDuration) {
      currentPosition = currentDuration;
      clearInterval(progressInterval);
    }
    updateProgressRing(currentPosition, currentDuration);
  }, 100);
}

async function fetchTrackStatus() {
  try {
    const data = await window.fetchTrackStatusFromApi();
    if (!data) return;
    
    const track = data.track;
    const trackId = track.realId;
    const isNewTrack = trackId !== oldTrackId;
    
    const durationSec = (track.durationMs || 0) / 1000;
    const positionSec = data.progress?.position || 0;
    currentDuration = durationSec;
    currentPosition = positionSec;
    currentStatus = data.status;
    updateProgressRing(currentPosition, currentDuration);

    if (data.status === "playing") {
      startProgressTimer();
    } else {
      clearInterval(progressInterval);
    }

    if (isNewTrack) {
      oldTrackId = trackId;
      
      const title = track.title || 'Unknown Title';
      const artist = track.artists?.map(a => a.name).join(', ') || 'Unknown Artist';
      const coverUri = track.coverUri 
        ? `https://${track.coverUri.replace('%%', '400x400')}`
        : 'default.png';
      updateTrackInfo(title, artist);
      animateTrackInfoOverlay();
      switchImages(coverUri);
    }
  } catch (error) {
    console.error('Error fetching track status:', error);
  }
}
fetchTrackStatus();
setInterval(fetchTrackStatus, 1000);
