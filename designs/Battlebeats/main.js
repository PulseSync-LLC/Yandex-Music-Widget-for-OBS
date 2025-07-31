async function fetchStatus() {
  return await window.fetchTrackStatusFromApi();
}

const el = {
  art: document.getElementById("bb-albumArt"),
  title: document.getElementById("bb-trackTitle"),
  artist: document.getElementById("bb-trackArtist"),
  prog: document.getElementById("bb-progress"),
  curT: document.getElementById("bb-currentTime"),
  durT: document.getElementById("bb-duration"),
};

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
