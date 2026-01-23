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
  art: document.getElementById("bb-albumArt"),
  title: document.getElementById("bb-trackTitle"),
  artist: document.getElementById("bb-trackArtist"),
  prog: document.getElementById("bb-progress"),
  curT: document.getElementById("bb-currentTime"),
  durT: document.getElementById("bb-duration"),
};

const card = document.getElementById("battlebeats-card");
let hideTimer = null;

function applyPosition() {
  card.style.position = "fixed";
  card.style.margin = "0";
  card.style.zIndex = "9999";
  card.style.transform = "";
  card.style.top = "";
  card.style.bottom = "";
  card.style.left = "";
  card.style.right = "";

  switch (position) {
    case "top-left":
      card.style.top = `${offsetY}px`;
      card.style.left = `${offsetX}px`;
      break;
    case "top-right":
      card.style.top = `${offsetY}px`;
      card.style.right = `${offsetX}px`;
      break;
    case "bottom-left":
      card.style.bottom = `${offsetY}px`;
      card.style.left = `${offsetX}px`;
      break;
    case "bottom-right":
      card.style.bottom = `${offsetY}px`;
      card.style.right = `${offsetX}px`;
      break;
    case "center":
      card.style.top = `calc(50% + ${offsetY}px)`;
      card.style.left = `calc(50% + ${offsetX}px)`;
      card.style.transform = "translate(-50%, -50%)";
      break;
    default:
      card.style.top = `${offsetY}px`;
      card.style.left = `${offsetX}px`;
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

function msToMMSS(ms) {
  const s = Math.floor(ms / 1000),
    m = Math.floor(s / 60),
    sec = s % 60;
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

function render(pos, dur) {
  const pct = dur > 0 ? (pos / dur) * 100 : 0;
  el.prog.style.width = pct + "%";
  el.curT.textContent = msToMMSS(pos * 1000);
  el.durT.textContent = msToMMSS(dur * 1000);
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
  el.art.crossOrigin = "anonymous";
  el.art.src = data.track.coverUri
    ? "https://" + data.track.coverUri.replace("%%", "200x200")
    : "default.png";
  el.title.textContent = data.track.title || "Unknown Title";
  el.artist.textContent =
    data.track.artists?.map((a) => a.name).join(", ") || "Unknown Artist";
  state.duration = data.track.durationMs / 1000;
  state.position = data.progress.position;
  render(state.position, state.duration);
  state.status = data.status;

  if (data.status === "playing") {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    card.classList.remove("hidden");
  } else if (data.status === "pause" || data.status === "paused") {
    if (!hideTimer) {
      hideTimer = setTimeout(() => {
        card.classList.add("hidden");
        hideTimer = null;
      }, 5000);
    }
  } else {
    card.classList.add("hidden");
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  }

  if (data.status === "playing") {
    startSmooth();
  } else {
    stopSmooth();
  }
  if (el.art.complete) {
    updateProgressColor();
  } else {
    el.art.onload = updateProgressColor;
  }
}

function updateProgressColor() {
  try {
    const color = getDarkenedColorFromImage(el.art, 180);
    document.documentElement.style.setProperty("--primary", color);
  } catch (e) {
    document.documentElement.style.setProperty("--primary", "#b9a91dff");
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
