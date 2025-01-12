const API_KEY = "API_KEY";

const API_BASE_URL = "https://ru-node-1.pulsesync.dev/api/v1";

async function fetchTrackStatusFromApi() {
  const url = `${API_BASE_URL}/track/status`;

  const response = await fetch(url, {
    headers: {
      accept: "*/*",
      authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}
