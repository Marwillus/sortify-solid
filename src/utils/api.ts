export async function fetchWebApi(
  accessToken: string,
  endpoint: string,
  method: string,
  body?: any
) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method,
    body: JSON.stringify(body),
  });
  return await res.json();
}

export async function getMyPlaylists(accessToken: string) {
  return await fetchWebApi(accessToken, "v1/me/playlists", "GET");
}

export async function getPlaylist(accessToken: string, playlistId: string) {
  return await fetchWebApi(accessToken, `v1/playlists/${playlistId}`, "GET");
}

export async function getPlaylistTracks(
  accessToken: string,
  playlistId: string
) {
  return await fetchWebApi(
    accessToken,
    `v1/playlists/${playlistId}/tracks`,
    "GET"
  );
}
