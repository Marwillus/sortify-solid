import './PlaylistItem.scss';

import { Component } from 'solid-js';

import { Box, Paper, Typography } from '@suid/material';

export const PlaylistItem: Component<{
  name: string;
  totalTracks: string | number;
  imageObject?: SpotifyApi.ImageObject;
}> = (props) => (
  <Paper
    elevation={3}
    sx={{
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      borderRadius: "4px",
      overflow: "hidden",
      padding: "0.5rem",
    }}
    class='playlist-item'
  >
    {props.imageObject && (
      <img src={props.imageObject.url} alt="" width={60} height={60} />
    )}
    <Box paddingInlineEnd={"1rem"}>
      <Typography>{props.name}</Typography>
      <Typography variant="body2" color="text.secondary">
        {props.totalTracks} Songs
      </Typography>
    </Box>
  </Paper>
);
