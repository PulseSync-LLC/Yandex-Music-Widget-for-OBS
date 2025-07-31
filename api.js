const API_BASE_URL = "http://127.0.0.1:2007";

const apiState = {
  trackId: null,
  status: null,
  lastApiPosition: 0
};

async function fetchTrackStatusFromApi() {
  const url = `${API_BASE_URL}/get_track`;

  const response = await fetch(url, {
    headers: { accept: "*/*" }
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (!data?.track) {
    console.warn("[api] Нет трека в ответе API");
    return null;
  }

  const isNewTrack      = data.track.realId !== apiState.trackId;
  const isStatusChanged = data.status !== apiState.status;

  const apiPos = data.progress.position;
  let isSeekChanged = false;

  if (data.status === "paused") {
    isSeekChanged = Math.abs(apiPos - apiState.lastApiPosition) > 1;
  } else if (data.status === "playing") {
    isSeekChanged = Math.abs(apiPos - apiState.lastApiPosition) > 2.5;
  }

  if (!isNewTrack && !isStatusChanged && !isSeekChanged) {
    console.log("[tick] Нет изменений — UI не трогаем");
    return null;
  }

  const changes = [];
  if (isNewTrack)      changes.push("🎵 новый трек");
  if (isStatusChanged) changes.push(`⏯ статус: ${apiState.status} → ${data.status}`);
  if (isSeekChanged)   changes.push(`⏱ позиция: ${apiState.lastApiPosition.toFixed(2)} → ${apiPos.toFixed(2)}`);

  console.log(`[tick] Обнаружены изменения: ${changes.join(", ")}`);

  // Сохраняем новое состояние
  apiState.trackId = data.track.realId;
  apiState.status = data.status;
  apiState.lastApiPosition = apiPos;

  return data;
}

window.fetchTrackStatusFromApi = fetchTrackStatusFromApi;
