const API_BASE_URL = "http://127.0.0.1:2007";

async function fetchTrackStatusFromApi() {
  const url = `${API_BASE_URL}/get_track`;

  const response = await fetch(url, {
    headers: {
      accept: "*/*"
    },
  });

  if (!response) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}
