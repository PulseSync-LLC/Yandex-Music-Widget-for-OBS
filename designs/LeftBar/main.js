async function fetchStatus() {
  return await window.fetchTrackStatusFromApi();
}

function getURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  
  const position = urlParams.get("position") || "top-left";
  const offsetX = parseFloat(urlParams.get("offsetX")) || 25;
  const offsetY = parseFloat(urlParams.get("offsetY")) || 25;
  
  return { position, offsetX, offsetY };
}

const { position, offsetX, offsetY } = getURLParams();

const el = {
  art: document.getElementById("pulsma-art"),
  title: document.getElementById("pulsma-title"),
  artist: document.getElementById("pulsma-artist"),
  progress: document.getElementById("pulsma-progress"),
  row: document.getElementById("pulsma-row"),
  bar: document.querySelector(".pulsma-bar"),
};

function applyPosition() {
  el.bar.style.position = "fixed";
  el.bar.style.margin = "0";
  el.bar.style.zIndex = "9999";
  el.bar.style.transform = "";
  el.bar.style.top = "";
  el.bar.style.bottom = "";
  el.bar.style.left = "";
  el.bar.style.right = "";

  switch (position) {
    case "top-left":
      el.bar.style.top = `${offsetY}px`;
      el.bar.style.left = `${offsetX}px`;
      break;
    case "top-right":
      el.bar.style.top = `${offsetY}px`;
      el.bar.style.right = `${offsetX}px`;
      break;
    case "bottom-left":
      el.bar.style.bottom = `${offsetY}px`;
      el.bar.style.left = `${offsetX}px`;
      break;
    case "bottom-right":
      el.bar.style.bottom = `${offsetY}px`;
      el.bar.style.right = `${offsetX}px`;
      break;
    case "center":
      el.bar.style.top = `calc(50% + ${offsetY}px)`;
      el.bar.style.left = `calc(50% + ${offsetX}px)`;
      el.bar.style.transform = "translate(-50%, -50%)";
      break;
    default:
      el.bar.style.top = `${offsetY}px`;
      el.bar.style.left = `${offsetX}px`;
      break;
  }
}

applyPosition();

let state = {
  trackId: null,
  status: null,
  duration: 0,
  position: 0,
  smooth: null,
  poll: null,
};

function animateTextChange(element, newText) {
  element.classList.add("fade-out");
  setTimeout(() => {
    element.textContent = newText;
    element.classList.remove("fade-out");
    element.classList.add("fade-in");
    setTimeout(() => {
      element.classList.remove("fade-in");
    }, 240);
  }, 210);
}

function setDynamicGap() {
  const titleWidth = el.title.scrollWidth;
  const artistWidth = el.artist.scrollWidth;
  const sum = Math.max(titleWidth, artistWidth);
  let gap = 16;
  if (sum > 260) gap = 10;
  if (sum > 340) gap = 6;
  if (sum > 410) gap = 3;
  document.documentElement.style.setProperty("--gap", gap + "px");
}

function resizeContainer() {
  setTimeout(() => {
    el.row.style.width = el.row.scrollWidth + "px";
    el.bar.style.width = el.row.scrollWidth + 0 + "px";
  }, 12);
}

function animateArtChange(newSrc) {
  return new Promise((resolve) => {
    el.art.classList.add("anim-out");
    setTimeout(() => {
      el.art.crossOrigin = "anonymous";
      el.art.src = newSrc;
      el.art.classList.remove("anim-out");
      el.art.classList.add("anim-in");
      setTimeout(() => {
        el.art.classList.remove("anim-in");
        resolve();
      }, 430);
    }, 380);
  });
}

function render(pos, dur) {
  const pct = dur > 0 ? (pos / dur) * 100 : 0;
  el.progress.style.width = pct + "%";
}

function startSmooth() {
  clearInterval(state.smooth);
  let last = Date.now();
  state.smooth = setInterval(() => {
    if (state.status !== "playing") return;
    const now = Date.now();
    state.position += (now - last) / 1000;
    last = now;
    if (state.position > state.duration) {
      state.position = state.duration;
      clearInterval(state.smooth);
    }
    render(state.position, state.duration);
  }, 100);
}

function stopSmooth() {
  clearInterval(state.smooth);
  state.smooth = null;
}

function apply(data) {
  const nextTitle = data.track.title || "No track playing";
  const nextArtist =
    data.track.artists?.map((a) => a.name).join(", ") || "Unknown Artist";
  const nextTrackId = data.track.realId;

  if (state.trackId !== nextTrackId) {
    const newSrc = data.track.coverUri
      ? "https://" + data.track.coverUri.replace("%%", "200x200")
      : "default.png";
    animateArtChange(newSrc).then(() => {
      if (el.art.complete) updateProgressColor();
    });

    animateTextChange(el.title, nextTitle);
    setTimeout(() => {
      animateTextChange(el.artist, nextArtist);
      setTimeout(() => {
        setDynamicGap();
      }, 260);
    }, 330);
  } else {
    if (el.title.textContent !== nextTitle)
      animateTextChange(el.title, nextTitle);
    if (el.artist.textContent !== nextArtist)
      animateTextChange(el.artist, nextArtist);
    setDynamicGap();
  }

  state.duration = data.track.durationMs / 1000;
  state.position = data.progress.position;
  render(state.position, state.duration);
  state.status = data.status;
  state.trackId = nextTrackId;

  if (data.status === "playing") {
    startSmooth();
  } else {
    stopSmooth();
  }
}

function updateProgressColor() {
  try {
    const color = getDarkenedColorFromImage(el.art, 180);
    document.documentElement.style.setProperty("--primary", color);
  } catch (e) {
    document.documentElement.style.setProperty("--primary", "#1db954");
  }
}

async function tick() {
  const data = await fetchStatus();
  if (!data) return;
  apply(data);
}

(async () => {
  const first = await fetchStatus();
  if (first) {
    apply(first);
  }
  state.poll = setInterval(tick, 1000);
})();
