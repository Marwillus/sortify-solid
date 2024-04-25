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

// GET
export async function getCurrentUser(accessToken: string) {
  return await fetchWebApi(accessToken, "v1/me", "GET");
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

// POST

export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description?: string,
  isPublic?: boolean
) {
  return await fetchWebApi(
    accessToken,
    `v1/users/${userId}/playlists`,
    "POST",
    {
      name: name,
      description: description? description:'',
      public: Boolean(isPublic),
    }
  );
}

export async function addTracksToPlaylist(
  accessToken: string,
  playlistId: string,
  uris: string[],
  position = 0
) {
  return await fetchWebApi(
    accessToken,
    `v1/playlists/${playlistId}/tracks`,
    "POST",
    {
      uris,
      position
    }
  );
}