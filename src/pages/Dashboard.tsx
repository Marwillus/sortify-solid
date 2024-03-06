import { createSignal, Show } from 'solid-js';

import { Button, Card } from '@suid/material';

import Login from './Login';

function Dashboard() {
  const [accessToken, setAccessToken] = createSignal<
    string | undefined | null
  >();
  const [topTracks, setTopTracks] = createSignal<string | undefined | null>();
  const [playlists, setPlaylists] = createSignal<string | undefined | null>();

  if (!accessToken()) {
    setAccessToken(window.localStorage.getItem("access_token"));
  }

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
    const topTracks = await fetchWebApi(
      "v1/me/playlists",
      "GET"
    );
    setPlaylists(topTracks.items);
  }

  console.log("render Dashboard");
  console.log(accessToken());

  return (
    <>
      <h1>Dashboard</h1>
      <p>{accessToken()}</p>
      <Show when={accessToken()} fallback={<Login />}>
        <Card>
          <Button onClick={() => getTopTracks()}>get Top Tracks</Button>
          <Button onClick={() => getMyPlaylists()}>get Top Tracks</Button>
          {topTracks() &&
            topTracks()?.map(
              ({ name, artists }) =>
                ` ${name} by ${artists.map((artist) => artist.name).join(", ")}`
            )}
        </Card>

      </Show>
      {/* <Login></Login> */}
    </>
  );
}

export default Dashboard;
