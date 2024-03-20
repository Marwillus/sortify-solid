import { createEffect, createSignal, onMount, Show } from 'solid-js';

import { Box, Button, Card, Container, List, Paper, Stack, Typography } from '@suid/material';

import { PlaylistItem } from '../components/PlaylistItem/PlaylistItem';
import { fetchWebApi } from '../utils/api';
import { isTokenExpired } from '../utils/authorization';
import { mockPlaylistResponse } from '../utils/mockdata';
import Login from './Login';

function Dashboard() {
  const [accessToken, setAccessToken] = createSignal<
    string | undefined | null
  >();
  const [topTracks, setTopTracks] = createSignal<string | undefined | null>();
  const [playlists, setPlaylists] =
    createSignal<SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectFull>>(
      mockPlaylistResponse
    );
  const [toPlaylists, setToPlaylists] =
    createSignal<SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectFull>>();
  const [errorMessage, setErrorMessage] = createSignal("");
  const [dragOver, setDragover] = createSignal(false);
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

  async function getTopTracks() {
    if (!accessToken()) return;

    const topTracks = await fetchWebApi(
      accessToken()!,
      "v1/me/top/tracks?time_range=long_term&limit=5",
      "GET"
    );
    setTopTracks(topTracks.items);
  }

  async function getMyPlaylists() {
    if (!accessToken()) return;

    const myPlaylists = await fetchWebApi(
      accessToken()!,
      "v1/me/playlists",
      "GET"
    );
    setPlaylists(myPlaylists);
  }

  createEffect(() => {
    console.log({ pl: playlists(), tt: topTracks() });
  });

  return (
    <Container>
      <Typography variant="h1">Dashboard</Typography>
      <Typography>Copy Playlists from Spotify to Your Account</Typography>

      <Box my={"2rem"}>
        <Show when={accessToken()} fallback={<Login />}>
          <Card>
            <Button onClick={() => getTopTracks()}>get Top Tracks</Button>
            <Button onClick={() => getMyPlaylists()}>get Playlists</Button>
          </Card>
        </Show>
      </Box>

      {/* <div
        ondragover={(e) => e.preventDefault()}
        ondragenter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log(e);
          
          setDragover(true);
        }}
        ondragleave={(e) => {
          e.preventDefault();
          console.log(e);

          setDragover(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          const url = e.dataTransfer.getData("text/plain");
          setDragover(false);
          console.log(url);
        }}
      >
        <Box
          border={"2px red dotted"}
          borderRadius={'1rem'}
          width={"50%"}
          minHeight={200}
          backgroundColor={dragOver() ? "green" : "background.default"}
        >
          put your data inside me
        </Box>
      </div> */}
      <Stack direction={"row"} gap={"1rem"}>
        <Box flexGrow={1}>
          <Typography variant="h4">From</Typography>

          <Paper elevation={2}>
            {playlists() && (
              <List>
                {playlists()?.items.map((item) => (
                  <PlaylistItem
                    imageObject={item.images.at(-1)}
                    name={item.name}
                    totalTracks={item.tracks.total}
                  />
                ))}
              </List>
            )}
          </Paper>
        </Box>
        <Box flexGrow={1}>
          <Typography variant="h4">To</Typography>

          <Paper elevation={2}>
            {toPlaylists() && (
              <List>
                {toPlaylists()?.items.map((item) => (
                  <PlaylistItem
                    imageObject={item.images.at(-1)}
                    name={item.name}
                    totalTracks={item.tracks.total}
                  />
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Stack>

      {errorMessage() && <h3>{errorMessage()}</h3>}
    </Container>
  );
}

export default Dashboard;
