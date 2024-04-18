import { createSignal } from 'solid-js';

import {
    Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    TextField
} from '@suid/material';

const SavePlaylistsDialog = () => {
  const [openDialog, setOpenDialog] = createSignal(false);
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  async function createPlaylist() {
    console.log("save Playlist");
  }

  return (
    <Dialog
      open={openDialog()}
      // TransitionComponent={Transition}
      onClose={handleDialogClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Save Playlist</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <DialogContentText id="alert-dialog-slide-description">
          Möchtest du diese Playlist so in deiner Spotify Bibliothek erstellen?
        </DialogContentText>
        <TextField value={"name"}></TextField>
        <TextField placeholder="Beschreibung"></TextField>
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
