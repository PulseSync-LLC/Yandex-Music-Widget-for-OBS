let updateInterval = null;
let smoothProgressInterval = null;

let trackState = {
  trackId: null,
  status: null,
  duration: 0,
  position: 0,
  lastApiPosition: 0,
  smooth: null,
};

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatMs(ms) {
  if (!ms || isNaN(ms)) return "0:00";
  return formatTime(ms / 1000);
}

function setImageSource(imgEl, uri) {
  if (!uri) {
    imgEl.src = "default.png";
    return;
  }
  const url = `https://${uri.replace("%%", "200x200")}`;
  imgEl.crossOrigin = "anonymous";
  imgEl.src = url;
  imgEl.onerror = () => {
    imgEl.src = "default.png";
  };
}

function updateStatusBadge(status) {
  const badge = document.getElementById("statusBadge");
  const text = document.getElementById("statusText");

  badge.className = "status-badge";
  if (status === "playing") {
    badge.classList.add("playing");
    text.textContent = "▶ Воспроизведение";
  } else if (status === "paused" || status === "pause") {
    badge.classList.add("paused");
    text.textContent = "⏸ Пауза";
  } else {
    badge.classList.add("stopped");
    text.textContent = "⏹ Остановлено";
  }
}

function updateCurrentTrack(track) {
  if (!track) return;

  document.getElementById("currentTitle").textContent = track.title || "-";
  document.getElementById("currentId").textContent =
    track.realId || track.id || "-";

  const artists = track.artists?.map((a) => a.name).join(", ") || "-";
  document.getElementById("currentArtist").textContent = artists;

  const album = track.albums?.[0];
  if (album) {
    document.getElementById("currentAlbum").textContent = album.title || "-";
    document.getElementById("currentYear").textContent = album.year || "-";
    document.getElementById("currentGenre").textContent = album.genre || "-";
  } else {
    document.getElementById("currentAlbum").textContent = "-";
    document.getElementById("currentYear").textContent = "-";
    document.getElementById("currentGenre").textContent = "-";
  }

  document.getElementById("currentDuration").textContent = formatMs(
    track.durationMs,
  );
  document.getElementById("currentType").textContent = track.type || "-";

  setImageSource(document.getElementById("currentCover"), track.coverUri);
}

function renderProgress(pos, dur) {
  const percentage = dur > 0 ? (pos / dur) * 100 : 0;
  document.getElementById("progressBar").style.width = `${percentage}%`;
  document.getElementById("currentTime").textContent = formatTime(pos);
  document.getElementById("totalTime").textContent = formatTime(dur);
}

function startSmoothProgress() {
  clearInterval(trackState.smooth);
  let last = Date.now();

  trackState.smooth = setInterval(() => {
    if (trackState.status !== "playing") return;

    const now = Date.now();
    trackState.position += (now - last) / 1000;
    last = now;

    if (trackState.position > trackState.duration) {
      trackState.position = trackState.duration;
      clearInterval(trackState.smooth);
    }

    renderProgress(trackState.position, trackState.duration);
  }, 100);
}

function stopSmoothProgress() {
  clearInterval(trackState.smooth);
  trackState.smooth = null;
}

function updateProgress(progress, isNewTrack, isStatusChanged, isSeekChanged) {
  if (!progress) return;

  const { position, duration, loaded, remainingBufferedTime } = progress;

  trackState.duration = duration;

  if (isNewTrack || isStatusChanged || isSeekChanged) {
    trackState.position = position;
    trackState.lastApiPosition = position;
    renderProgress(trackState.position, trackState.duration);
  }

  document.getElementById("progressPosition").textContent =
    position.toFixed(2) + "s";
  document.getElementById("progressLoaded").textContent = formatTime(loaded);
  document.getElementById("progressBuffered").textContent = formatTime(
    remainingBufferedTime,
  );
}

function updateArtists(artists) {
  const container = document.getElementById("artistsList");
  container.innerHTML = "";

  if (!artists || artists.length === 0) {
    container.innerHTML = "<div style='color: #718096;'>Нет данных</div>";
    return;
  }

  artists.forEach((artist) => {
    const item = document.createElement("div");
    item.className = "artist-item";

    const cover = document.createElement("img");
    cover.className = "artist-cover";
    setImageSource(cover, artist.cover?.uri);

    const name = document.createElement("div");
    name.className = "artist-name";
    name.textContent = artist.name || "-";

    const id = document.createElement("div");
    id.className = "artist-id";
    id.textContent = `ID: ${artist.id || "-"}`;

    item.appendChild(cover);
    item.appendChild(name);
    item.appendChild(id);
    container.appendChild(item);
  });
}

function updateAlbums(albums) {
  const container = document.getElementById("albumsList");
  container.innerHTML = "";

  if (!albums || albums.length === 0) {
    container.innerHTML = "<div style='color: #718096;'>Нет данных</div>";
    return;
  }

  albums.forEach((album) => {
    const item = document.createElement("div");
    item.className = "album-item";

    const cover = document.createElement("img");
    cover.className = "album-cover";
    setImageSource(cover, album.coverUri);

    const info = document.createElement("div");
    info.className = "album-info";

    const title = document.createElement("div");
    title.className = "album-title";
    title.textContent = album.title || "-";

    const meta = document.createElement("div");
    meta.className = "album-meta";
    meta.textContent = `${album.year || "-"} • ${album.genre || "-"}`;

    info.appendChild(title);
    info.appendChild(meta);

    const stats = document.createElement("div");
    stats.className = "album-stats";
    stats.innerHTML = `
      <div>Треков: ${album.trackCount || 0}</div>
      <div>Лайков: ${album.likesCount || 0}</div>
    `;

    item.appendChild(cover);
    item.appendChild(info);
    item.appendChild(stats);
    container.appendChild(item);
  });
}

function updateActions(availableActions, actionsStore) {
  document.getElementById("canMoveBackward").textContent =
    availableActions?.moveBackward ? "✓" : "✗";
  document.getElementById("canMoveBackward").className =
    `action-value ${availableActions?.moveBackward}`;

  document.getElementById("canMoveForward").textContent =
    availableActions?.moveForward ? "✓" : "✗";
  document.getElementById("canMoveForward").className =
    `action-value ${availableActions?.moveForward}`;

  const repeat = actionsStore?.repeat || "none";
  document.getElementById("repeatMode").textContent =
    repeat === "none" ? "Нет" : repeat === "one" ? "Один" : "Все";
  document.getElementById("repeatMode").className = `action-value ${repeat}`;

  const shuffle = actionsStore?.shuffle || false;
  document.getElementById("shuffleMode").textContent = shuffle ? "✓" : "✗";
  document.getElementById("shuffleMode").className = `action-value ${shuffle}`;

  const liked = actionsStore?.isLiked || false;
  document.getElementById("isLiked").textContent = liked ? "✓" : "✗";
  document.getElementById("isLiked").className = `action-value ${liked}`;

  const disliked = actionsStore?.isDisliked || false;
  document.getElementById("isDisliked").textContent = disliked ? "✓" : "✗";
  document.getElementById("isDisliked").className = `action-value ${disliked}`;
}

function updatePreviousTrack(track) {
  if (!track) {
    document.getElementById("prevTitle").textContent = "-";
    document.getElementById("prevArtist").textContent = "-";
    document.getElementById("prevDuration").textContent = "-";
    setImageSource(document.getElementById("prevCover"), null);
    return;
  }

  document.getElementById("prevTitle").textContent = track.title || "-";
  document.getElementById("prevArtist").textContent =
    track.artists?.map((a) => a.name).join(", ") || "-";
  document.getElementById("prevDuration").textContent = formatMs(
    track.durationMs,
  );
  setImageSource(document.getElementById("prevCover"), track.coverUri);
}

function updateNextTrack(track) {
  if (!track) {
    document.getElementById("nextTitle").textContent = "-";
    document.getElementById("nextArtist").textContent = "-";
    document.getElementById("nextDuration").textContent = "-";
    setImageSource(document.getElementById("nextCover"), null);
    return;
  }

  document.getElementById("nextTitle").textContent = track.title || "-";
  document.getElementById("nextArtist").textContent =
    track.artists?.map((a) => a.name).join(", ") || "-";
  document.getElementById("nextDuration").textContent = formatMs(
    track.durationMs,
  );
  setImageSource(document.getElementById("nextCover"), track.coverUri);
}

function updateColors(colors) {
  const container = document.getElementById("colorsGrid");
  container.innerHTML = "";

  if (!colors) return;

  const colorMap = {
    average: "Средний",
    waveText: "Текст волны",
    miniPlayer: "Мини-плеер",
    accent: "Акцент",
  };

  Object.entries(colors).forEach(([key, value]) => {
    const item = document.createElement("div");
    item.className = "color-item";

    const swatch = document.createElement("div");
    swatch.className = "color-swatch";
    swatch.style.backgroundColor = value;

    const label = document.createElement("div");
    label.className = "color-label";
    label.textContent = colorMap[key] || key;

    const colorValue = document.createElement("div");
    colorValue.className = "color-value";
    colorValue.textContent = value;

    item.appendChild(swatch);
    item.appendChild(label);
    item.appendChild(colorValue);
    container.appendChild(item);
  });
}

function updateStatistics(data) {
  const container = document.getElementById("statsList");
  container.innerHTML = "";

  const stats = [
    { label: "Громкость", value: `${(data.volume * 100).toFixed(0)}%` },
    {
      label: "Размер файла",
      value: data.track?.fileSize
        ? `${(data.track.fileSize / 1024 / 1024).toFixed(2)} MB`
        : "-",
    },
    { label: "Доступен", value: data.track?.available ? "Да" : "Нет" },
    {
      label: "Для премиум",
      value: data.track?.availableForPremiumUsers ? "Да" : "Нет",
    },
    { label: "Текст песен", value: data.track?.lyricsAvailable ? "Да" : "Нет" },
    {
      label: "Запоминать позицию",
      value: data.track?.rememberPosition ? "Да" : "Нет",
    },
  ];

  stats.forEach((stat) => {
    const item = document.createElement("div");
    item.className = "stat-item";

    const label = document.createElement("div");
    label.className = "stat-label";
    label.textContent = stat.label;

    const value = document.createElement("div");
    value.className = "stat-value";
    value.textContent = stat.value;

    item.appendChild(label);
    item.appendChild(value);
    container.appendChild(item);
  });
}

function updateTechnical(data) {
  const container = document.getElementById("techList");
  container.innerHTML = "";

  const tech = [
    { label: "R128 I", value: data.track?.r128?.i?.toFixed(2) || "-" },
    { label: "R128 TP", value: data.track?.r128?.tp?.toFixed(2) || "-" },
    { label: "Fade In Start", value: `${data.track?.fade?.inStart || "-"}s` },
    { label: "Fade In Stop", value: `${data.track?.fade?.inStop || "-"}s` },
    { label: "Fade Out Start", value: `${data.track?.fade?.outStart || "-"}s` },
    { label: "Fade Out Stop", value: `${data.track?.fade?.outStop || "-"}s` },
    {
      label: "Preview Duration",
      value: formatMs(data.track?.previewDurationMs),
    },
    { label: "Track Source", value: data.track?.trackSource || "-" },
    { label: "Source Type", value: data.track?.sourceType || "-" },
    { label: "Sharing Flag", value: data.track?.trackSharingFlag || "-" },
  ];

  tech.forEach((item) => {
    const techItem = document.createElement("div");
    techItem.className = "tech-item";

    const label = document.createElement("div");
    label.className = "tech-label";
    label.textContent = item.label;

    const value = document.createElement("div");
    value.className = "tech-value";
    value.textContent = item.value;

    techItem.appendChild(label);
    techItem.appendChild(value);
    container.appendChild(techItem);
  });
}

async function fetchAndUpdate() {
  try {
    const response = await fetch(`http://127.0.0.1:2007/get_track`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data?.track) {
      console.warn("[getTrackTest] Нет трека в ответе API");
      return;
    }

    const isNewTrack = data.track.realId !== trackState.trackId;
    const isStatusChanged = data.status !== trackState.status;

    const apiPos = data.progress?.position || 0;
    let isSeekChanged = false;

    if (data.status === "paused" || data.status === "pause") {
      isSeekChanged = Math.abs(apiPos - trackState.lastApiPosition) > 1;
    } else if (data.status === "playing") {
      isSeekChanged = Math.abs(apiPos - trackState.lastApiPosition) > 2.5;
    }

    trackState.trackId = data.track.realId;
    trackState.status = data.status;

    updateStatusBadge(data.status);

    if (isNewTrack) {
      updateCurrentTrack(data.track);
    }

    updateProgress(data.progress, isNewTrack, isStatusChanged, isSeekChanged);

    if (data.status === "playing") {
      startSmoothProgress();
    } else {
      stopSmoothProgress();
    }

    updateArtists(data.track?.artists);
    updateAlbums(data.track?.albums);
    updateActions(data.availableActions, data.actionsStore);
    updatePreviousTrack(data.previousTrack);
    updateNextTrack(data.nextTrack);
    updateColors(data.track?.derivedColors);
    updateStatistics(data);
    updateTechnical(data);
  } catch (error) {
    console.error("Error fetching track data:", error);
    document.getElementById("statusText").textContent = "❌ Ошибка подключения";
    document.getElementById("statusBadge").className = "status-badge loading";
  }
}

function startPolling() {
  fetchAndUpdate();
  updateInterval = setInterval(fetchAndUpdate, 1000);
}

function stopPolling() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
  stopSmoothProgress();
}
document.addEventListener("DOMContentLoaded", () => {
  startPolling();
});

window.addEventListener("beforeunload", () => {
  stopPolling();
});
