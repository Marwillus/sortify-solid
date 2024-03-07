import { createSignal, onMount, Show } from 'solid-js';

import { Button, Card } from '@suid/material';

import { isTokenExpired } from '../utils/authorization';
import Login from './Login';

function Dashboard() {
  const [accessToken, setAccessToken] = createSignal<
    string | undefined | null
  >();
  const [topTracks, setTopTracks] = createSignal<string | undefined | null>();
  const [playlists, setPlaylists] = createSignal<string | undefined | null>();
  const [errorMessage, setErrorMessage] = createSignal("");
  console.log("render Dashboard");

  if (!accessToken()) {
    setAccessToken(window.localStorage.getItem("access_token"));
  }

  onMount(() => {
    // reset localStorage
    if (isTokenExpired()) {
      // @TODO refresh token
      setErrorMessage("Token Expired");
      localStorage.clear();
    }
  });

  async function fetchWebApi(endpoint: string, method: string, body?: any) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
      method,
      body: JSON.stringify(body),
    });
    return await res.json();
  }

  async function getTopTracks() {
    const topTracks = await fetchWebApi(
      "v1/me/top/tracks?time_range=long_term&limit=5",
      "GET"
    );
    setTopTracks(topTracks.items);
  }

  async function getMyPlaylists() {
    const topTracks = await fetchWebApi("v1/me/playlists", "GET");
    setPlaylists(topTracks.items);
  }

  return (
    <>
      <h1>Dashboard</h1>
      <p>{accessToken()}</p>
      <p>Copy Playlists from Spotify to Your Account</p>
      <Show when={accessToken()} fallback={<Login />}>
        <Card>
          <Button onClick={() => getTopTracks()}>get Top Tracks</Button>
          <Button onClick={() => getMyPlaylists()}>get Playlists</Button>
          {topTracks() &&
            topTracks()?.map(
              ({ name, artists }) =>
                ` ${name} by ${artists.map((artist) => artist.name).join(", ")}`
            )}
        </Card>
      </Show>
      {errorMessage() && <h3>{errorMessage()}</h3>}
    </>
  );
}

export default Dashboard;
