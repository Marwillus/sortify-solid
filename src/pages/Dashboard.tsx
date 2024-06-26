import { BsSave } from 'solid-icons/bs';
import { createEffect, createSignal, onMount, Show } from 'solid-js';

import {
    Box, Button, Card, Container, List, ListItem, Paper, Stack, Typography
} from '@suid/material';
import { DragDropProvider, DragDropSensors, DragEventHandler } from '@thisbeyond/solid-dnd';

import Draggable from '../components/DragAndDrop/Draggable';
import Droppable from '../components/DragAndDrop/Droppable';
import { PlaylistItem } from '../components/Playlist/PlaylistItem';
import SavePlaylistsDialog from '../components/SavePlaylistsDialog';
import { usePlaylists } from '../context/PlaylistProvider';
import { getMyPlaylists, getPlaylist, getPlaylistTracks } from '../utils/api';
import { isTokenExpired } from '../utils/authorization';
import Login from './Login';

function Dashboard() {
  const [
    { accessToken,fromPlaylists, toPlaylists, fromTracklist, toTracklist },
    { setAccessToken, setFromPlaylists, setToPlaylists, setFromTracklist, setToTracklist },
  ] = usePlaylists();

  const [errorMessage, setErrorMessage] = createSignal("");
  const [openDialog, setOpenDialog] = createSignal(false);
  const [newPlaylistData, setNewPlaylistData] =
    createSignal<SpotifyApi.PlaylistObjectFull>();
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

  async function showMyPlaylists() {
    const myPlaylists = await getMyPlaylists(accessToken()!);
    setFromPlaylists(myPlaylists.items);
  }

  async function addPlaylist(playlistId: string) {
    const playlist = await getPlaylist(accessToken()!, playlistId);
    setFromPlaylists(
      fromPlaylists() ? [...fromPlaylists(), playlist] : [playlist]
    );
  }

  async function showPlaylistTracks(playlistId: string) {
    const tracklist = await getPlaylistTracks(accessToken()!, playlistId);
    setFromTracklist(tracklist);
    console.log(fromTracklist());
  }

  async function handleDialogOpen(playlist: SpotifyApi.PlaylistObjectFull) {
    setNewPlaylistData(playlist);
    setOpenDialog(true);

    const tracklist = await getPlaylistTracks(accessToken()!, playlist.id);
    setToTracklist(tracklist);
    console.log(newPlaylistData());
  }

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  async function createPlaylist() {
    console.log("save Playlist");
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
            <Button onClick={() => showMyPlaylists()}>get my Playlists</Button>
          </Card>
        </Box>

        <DragDropProvider onDragEnd={onDragEnd}>
          <DragDropSensors />
          <Stack direction={"row"} spacing={"1rem"} divider minHeight={400}>
            <Box flexGrow={1}>
              <Typography variant="h5">Playlists Pool</Typography>

              <Paper elevation={1} sx={{ height: "100%" }}>
                {/* <Tracklist>
                  <List>
                    {[1, 2, 3].map(() => (
                      <ListItem>
                        <TracklistItem></TracklistItem>
                      </ListItem>
                    ))}
                  </List>
                </Tracklist> */}

                {fromPlaylists() && (
                  <List>
                    {fromPlaylists()!.map((item, index) => (
                      <ListItem onDblClick={() => showPlaylistTracks(item.id)}>
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
              <Typography variant="h5">Selected Playlists</Typography>
              <Paper elevation={1} sx={{ height: "100%" }}>
                <Droppable id="right-dropzone">
                  <List>
                    {toPlaylists() &&
                      toPlaylists()!.map((item) => (
                        <ListItem sx={{ alignItems: "stretch" }}>
                          <PlaylistItem
                            imageObject={item.images.at(-1)}
                            name={item.name}
                            totalTracks={item.tracks.total}
                          />
                          <Button
                            variant="contained"
                            color="success"
                            onclick={() => handleDialogOpen(item)}
                          >
                            <BsSave size={"1.25rem"}></BsSave>
                          </Button>
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
      {newPlaylistData() && (
        <SavePlaylistsDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          playlist={newPlaylistData()!}
        />
      )}
    </Container>
  );
}

export default Dashboard;
