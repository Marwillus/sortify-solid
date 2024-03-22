import { createEffect, createSignal, onMount, Show } from 'solid-js';

import { Box, Button, Card, Container, List, Paper, Stack, Typography } from '@suid/material';
import {
    createDraggable, createDroppable, DragDropProvider, DragDropSensors, DragEventHandler,
    DragOverlay
} from '@thisbeyond/solid-dnd';

import { PlaylistItem } from '../components/PlaylistItem/PlaylistItem';
import { fetchWebApi } from '../utils/api';
import { isTokenExpired } from '../utils/authorization';
import { mockPlaylistResponse } from '../utils/mockdata';
import Login from './Login';

const Draggable = () => {
  const draggable = createDraggable(1);
  return (
    <div
      use:draggable
      class="draggable"
      classList={{ "opacity-25": draggable.isActiveDraggable }}
    >
      Draggable
    </div>
  );
};

const Droppable = (props) => {
  const droppable = createDroppable(1);
  return (
    <div
      use:droppable
      class="droppable"
      classList={{ "!droppable-accept": droppable.isActiveDroppable }}
    >
      Droppable.
      {props.children}
    </div>
  );
};

function Dashboard() {
  const [accessToken, setAccessToken] = createSignal<
    string | undefined | null
  >();
  const [fromPlaylists, setFromPlaylists] =
    createSignal<SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectFull>>(
      mockPlaylistResponse
    );
  const [fromTracklist, setFromTracklist] =
    createSignal<SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectFull>>();
  const [toPlaylists, setToPlaylists] =
    createSignal<SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectFull>>();
  const [errorMessage, setErrorMessage] = createSignal("");
  const [dragOver, setDragover] = createSignal(false);
  console.log("render Dashboard");

  const onDragEnd: DragEventHandler = ({ droppable }) => {
    if (droppable) {
      console.log("dropped in Box");
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
    setFromPlaylists(myPlaylists);
  }

  async function getPlaylistTracks(playlistId: string) {
    const fromTracklists = await fetchWebApi(
      accessToken()!,
      `v1/me/playlists/${playlistId}/tracks`,
      "GET"
    );
    setToPlaylists(fromTracklists);
  }

  createEffect(() => {
    console.log({ pl: fromPlaylists(), tl: fromTracklist() });
  });

  return (
    <Container>
      <Typography variant="h1">Dashboard</Typography>
      <Typography>Copy Playlists from Spotify to Your Account</Typography>

      <Box my={"2rem"}>
        <Show when={accessToken()} fallback={<Login />}>
          <Card>
            <Button onClick={() => getMyPlaylists()}>get Playlists</Button>
          </Card>
        </Show>
      </Box>

      <DragDropProvider onDragEnd={onDragEnd}>
        <DragDropSensors />

        <DragOverlay>
          <div class="draggable">Drag Overlay!</div>
        </DragOverlay>
        <Stack direction={"row"} spacing={"1rem"} divider>
          <Box flexGrow={1}>
            <Typography variant="h4">From</Typography>
            <Paper elevation={2} sx={{ height: "100%", width: "100%" }}>
              {fromPlaylists() && (
                <List>
                  {fromPlaylists()?.items.map((item) => (
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

            <div></div>
            <Paper elevation={2} sx={{ height: "100%", width: "100%" }}>
              <List>
                {toPlaylists() &&
                  toPlaylists()?.items.map((item) => (
                    <PlaylistItem
                      imageObject={item.images.at(-1)}
                      name={item.name}
                      totalTracks={item.tracks.total}
                    />
                  ))}
              </List>
            </Paper>
          </Box>
        </Stack>
      </DragDropProvider>

      {errorMessage() && <h3>{errorMessage()}</h3>}

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
    </Container>
  );
}

export default Dashboard;
