import { Accessor, Component, Setter } from 'solid-js';

import {
    Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    TextField
} from '@suid/material';

const SavePlaylistsDialog: Component<{
  playlist: SpotifyApi.PlaylistObjectFull;
  openDialog: Accessor<boolean>
  setOpenDialog: Setter<boolean>
}> = (props) => {
  const handleDialogClose = () => {
    props.setOpenDialog(false);
  };

  async function createPlaylist() {
    console.log("save Playlist");
  }

  return (
    <Dialog
      open={props.openDialog()}
      // TransitionComponent={Transition}
      onClose={handleDialogClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Save Playlist</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <DialogContentText id="alert-dialog-slide-description">
        {`Möchtest du diese Playlist mit ihren ${
              props.playlist.tracks.total
            } Tracks so in deiner Spotify Bibliothek
            erstellen?`}
        </DialogContentText>
          <TextField label="Name" value={props.playlist.name}></TextField>
        <TextField
            label="Beschreibung"
            placeholder={
              props.playlist.description
                ? (props.playlist.description as string)
                : "Das ist optional"
            }
          ></TextField>
        <Checkbox value={false}></Checkbox>
      </DialogContent>
      <DialogActions>
        <Button color="success" variant="outlined" onClick={createPlaylist}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SavePlaylistsDialog;
