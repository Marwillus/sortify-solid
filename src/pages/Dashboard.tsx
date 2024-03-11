import { createEffect, createSignal, onMount, Show } from 'solid-js';

import { Box, Button, Card, Container, Divider, List, ListItem, Typography } from '@suid/material';

import { isTokenExpired } from '../utils/authorization';
import Login from './Login';

function Dashboard() {
  const [accessToken, setAccessToken] = createSignal<
    string | undefined | null
  >();
  const [topTracks, setTopTracks] = createSignal<string | undefined | null>();
  const [playlists, setPlaylists] = createSignal<any>();
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

  createEffect(() => {
    console.log({ pl: playlists(), tt: topTracks() });
  });

  return (
    <Container>
      <Typography variant="h1">Dashboard</Typography>
      <Typography>Copy Playlists from Spotify to Your Account</Typography>
      <Divider></Divider>
      <Box my={"2rem"}>
        <Show when={accessToken()} fallback={<Login />}>
          <Card>
            <Button onClick={() => getTopTracks()}>get Top Tracks</Button>
            <Button onClick={() => getMyPlaylists()}>get Playlists</Button>
          </Card>
          {/* {topTracks() &&
            topTracks()?.map(({ name, artists }) => (
              <Card>
                ` ${name} by ${artists.map((artist) => artist.name).join(", ")}`
              </Card>
            ))} */}
        </Show>
      </Box>
      {/* <PlaylistCard></PlaylistCard> */}
      {playlists() && (
        <List>
          {playlists()?.map((item, index) => (
            <ListItem>{item.name}</ListItem>
          ))}
        </List>
      )}
      {errorMessage() && <h3>{errorMessage()}</h3>}
    </Container>
  );
}

export default Dashboard;
