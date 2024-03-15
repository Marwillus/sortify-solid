import { createEffect, createSignal, onMount, Show } from 'solid-js';

import { Box, Button, Card, Container, List, ListItem, Paper, Typography } from '@suid/material';

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
      <Paper elevation={2}>
        {playlists() && (
          <List>
            {playlists()?.items.map((item) => (
              <ListItem>
                <Paper
                  elevation={5}
                  sx={{
                    flexGrow:1,
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    borderRadius: "4px",
                    overflow: "hidden",
                    padding: "0.5rem",
                  }}
                >
                  {item.images.at(-1) && (
                    <img
                      src={item.images.at(-1)!.url}
                      alt=""
                      width={60}
                      height={60}
                    />
                  )}
                  <Box paddingInlineEnd={'1rem'}>
                    <Typography>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total: {item.tracks.total}
                    </Typography>
                  </Box>
                </Paper>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {errorMessage() && <h3>{errorMessage()}</h3>}
    </Container>
  );
}

export default Dashboard;
