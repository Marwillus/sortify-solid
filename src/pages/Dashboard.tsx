import { createEffect, createSignal, onMount, Show } from 'solid-js';

import {
    Box, Button, Card, Container, List, ListItem, Paper, Stack, Typography
} from '@suid/material';
import { DragDropProvider, DragDropSensors, DragEventHandler } from '@thisbeyond/solid-dnd';

import Draggable from '../components/DragAndDrop/Draggable';
import Droppable from '../components/DragAndDrop/Droppable';
import { PlaylistItem } from '../components/Playlist/PlaylistItem';
import Tracklist from '../components/Tracklist/Tracklist';
import TracklistItem from '../components/Tracklist/TracklistItem';
import { fetchWebApi } from '../utils/api';
import { isTokenExpired } from '../utils/authorization';
import Login from './Login';

function Dashboard() {
  const [accessToken, setAccessToken] = createSignal<
    string | undefined | null
  >();
  const [fromPlaylists, setFromPlaylists] =
    createSignal<SpotifyApi.PlaylistObjectFull[]>();
  const [toPlaylists, setToPlaylists] =
    createSignal<SpotifyApi.PlaylistObjectFull[]>();
  const [fromTracklist, setFromTracklist] =
    createSignal<SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectFull>>();
  const [errorMessage, setErrorMessage] = createSignal("");
  console.log("render Dashboard");

  const onDragEnd: DragEventHandler = ({ droppable, draggable }) => {
    if (droppable) {
      console.log("dropped in Box");
      console.log(draggable.id);
      setToPlaylists((prev) =>
        prev
          ? [...prev, JSON.parse(draggable.data)]
          : [JSON.parse(draggable.data)]
      );
      // console.log(toPlaylists());
    } else {
      console.log("dropped outside Box");
    }
  };

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

  async function getMyPlaylists() {
    const myPlaylists = await fetchWebApi(
      accessToken()!,
      "v1/me/playlists",
      "GET"
    );
    setFromPlaylists(myPlaylists.items);
  }

  async function getPlaylist(playlistId: string) {
    const playlistItem = await fetchWebApi(
      accessToken()!,
      `v1/playlists/${playlistId}`,
      "GET"
    );
    console.log(playlistItem);

    setFromPlaylists(
      fromPlaylists() ? [...fromPlaylists(), playlistItem] : [playlistItem]
    );
  }

  async function getPlaylistTracks(playlistId: string) {
    const fromTracklists = await fetchWebApi(
      accessToken()!,
      `v1/me/playlists/${playlistId}/tracks`,
      "GET"
    );
    setFromTracklist(fromTracklists);
  }

  async function showTracks(playlistId: string) {
    getPlaylistTracks(playlistId);
    console.log(fromTracklist());
  }

  createEffect(() => {
    console.log({ pl: fromPlaylists(), tl: fromTracklist() });
  });

  return (
    <Container>
      <Typography variant="h2" pt={"4rem"}>
        Dashboard
      </Typography>
      <Typography>Copy Playlists from Spotify to Your Account</Typography>

      <Show when={accessToken()} fallback={<Login />}>
        <Box my={"2rem"}>
          <Card>
            <Button onClick={() => getMyPlaylists()}>get Playlists</Button>
          </Card>
        </Box>

        <DragDropProvider onDragEnd={onDragEnd}>
          <DragDropSensors />
          <Stack direction={"row"} spacing={"1rem"} divider>
            <Box flexGrow={1}>
              <Typography variant="h4">From</Typography>

              <Paper
                elevation={1}
                sx={{
                  height: "400px",
                  width: "100%",
                }}
              >
                <Tracklist>
                  <List>
                    {[1, 2, 3].map(() => (
                      <ListItem>
                        <TracklistItem></TracklistItem>
                      </ListItem>
                    ))}
                  </List>
                </Tracklist>

                {fromPlaylists() && (
                  <List>
                    {fromPlaylists()!.map((item, index) => (
                      <ListItem onDblClick={() => showTracks(item.id)}>
                        <Draggable
                          id={`drag-from-${index}`}
                          data={JSON.stringify(item)}
                        >
                          <PlaylistItem
                            imageObject={item.images.at(-1)}
                            name={item.name}
                            totalTracks={item.tracks.total}
                          />
                        </Draggable>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Box>
            <Box flexGrow={1}>
              <Typography variant="h4">To</Typography>

              <Paper elevation={1} sx={{ minHeight: "400px", width: "100%" }}>
                <Droppable id="right-dropzone">
                  <List>
                    {toPlaylists() &&
                      toPlaylists()!.map((item) => (
                        <ListItem>
                          <PlaylistItem
                            imageObject={item.images.at(-1)}
                            name={item.name}
                            totalTracks={item.tracks.total}
                          />
                        </ListItem>
                      ))}
                  </List>
                </Droppable>
              </Paper>
            </Box>
          </Stack>
        </DragDropProvider>
        {errorMessage() && <h3>{errorMessage()}</h3>}
      </Show>
    </Container>
  );
}

export default Dashboard;
