import { Accessor, Component, createSignal, Setter } from 'solid-js';

import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel,
    Switch, TextField
} from '@suid/material';

import { usePlaylists } from '../context/PlaylistProvider';
import { createPlaylist, getCurrentUser } from '../utils/api';

const SavePlaylistsDialog: Component<{
  playlist: SpotifyApi.PlaylistObjectFull;
  openDialog: Accessor<boolean>;
  setOpenDialog: Setter<boolean>;
}> = (props) => {
  const [{ accessToken }] = usePlaylists();

  const [name, setName] = createSignal(props.playlist.name + " copy");
  const [description, setDescription] = createSignal(
    props.playlist.description || ""
  );
  const [isPublic, setIsPublic] = createSignal(true);

  const handleDialogClose = () => {
    props.setOpenDialog(false);
  };

  async function savePlaylist(e: SubmitEvent) {
    e.preventDefault();
    console.log("save Playlist");
    if (!accessToken()) return;

    const user = await getCurrentUser(accessToken()!);
    const newPlaylist = await createPlaylist(
      accessToken()!,
      user.id,
      name(),
      description(),
      isPublic()
    );
    console.log(newPlaylist);
    // const response = await addTracksToPlaylist(accessToken()!, props.playlist.tracks.)
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
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SavePlaylistsDialog;
