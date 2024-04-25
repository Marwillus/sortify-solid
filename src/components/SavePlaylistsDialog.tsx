import { Accessor, Component, createSignal, Setter, Show } from 'solid-js';

import {
    Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControlLabel, Switch, TextField
} from '@suid/material';

import { usePlaylists } from '../context/PlaylistProvider';
import {
    addTracksToPlaylist, createPlaylist, getCurrentUser, getPlaylistTracks
} from '../utils/api';

const SavePlaylistsDialog: Component<{
  playlist: SpotifyApi.PlaylistObjectFull;
  openDialog: Accessor<boolean>;
  setOpenDialog: Setter<boolean>;
}> = (props) => {
  const [{ accessToken }] = usePlaylists();

  const [isLoading, setIsLoading] = createSignal(false);
  const [name, setName] = createSignal(props.playlist.name);
  const [description, setDescription] = createSignal(
    props.playlist.description || ""
  );
  const [isPublic, setIsPublic] = createSignal(true);

  const handleDialogClose = () => {
    props.setOpenDialog(false);
  };

  async function savePlaylist(e: SubmitEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      console.log("save Playlist");
      if (!accessToken()) return;

      const user = await getCurrentUser(accessToken()!);
      const playListTracks: SpotifyApi.PlaylistTrackResponse =
        await getPlaylistTracks(accessToken()!, props.playlist.id);
      const newPlaylist = await createPlaylist(
        accessToken()!,
        user.id,
        name(),
        description(),
        isPublic()
      );
      const uriList = playListTracks.items
        .filter((item) => !!item.track)
        .map((item) => item.track!.uri);
      const response = await addTracksToPlaylist(
        accessToken()!,
        newPlaylist.id,
        uriList
      );
      console.log("Playlist saved successfully", response);
    } catch (error) {
      console.log("Error while saving Playlist");
      console.log(error);
    } finally {
      setIsLoading(false);
      handleDialogClose()
    }
  }

  return (
    <Dialog
      open={props.openDialog()}
      // TransitionComponent={Transition}
      onClose={handleDialogClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Save Playlist</DialogTitle>
      <form onSubmit={savePlaylist}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <DialogContentText
            id="alert-dialog-slide-description"
            sx={{ marginBottom: "1rem" }}
          >
            {`Möchtest du diese Playlist mit ihren ${props.playlist.tracks.total} Tracks so in deiner Spotify Bibliothek
            erstellen?`}
          </DialogContentText>
          <TextField
            label="Name"
            value={name()}
            onChange={(e) => setName(e.target.value)}
          ></TextField>
          <TextField
            label="Beschreibung"
            placeholder={
              description() ? (description() as string) : "Das ist optional"
            }
            value={description()}
            onChange={(e) => setDescription(e.target.value)}
          ></TextField>
          <FormControlLabel
            control={
              <Switch
                checked={isPublic()}
                onChange={() => {
                  setIsPublic(!isPublic());
                }}
              />
            }
            label={`Playlist ist ${isPublic() ? "" : "nicht"} öffentlich`}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="success" variant="outlined">
            <Show when={isLoading()} fallback={"Save"}>
              <CircularProgress size={"1.5rem"}></CircularProgress>
            </Show>
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SavePlaylistsDialog;
