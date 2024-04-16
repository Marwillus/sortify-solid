import { Component } from 'solid-js';

import { Paper } from '@suid/material';

const TracklistItem: Component<{ data?: any }> = (props) => (
  <Paper
    elevation={6}
    sx={{
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      borderRadius: "4px",
      overflow: "hidden",
      padding: "0.5rem",
    }}
  >
    {/* {props.imageObject && (
      <img src={props.imageObject.url} alt="" width={60} height={60} />
    )}
    <Box paddingInlineEnd={"1rem"}>
      <Typography>{props.name}</Typography>
      <Typography variant="body2" color="text.secondary">
        Total: {props.totalTracks}
      </Typography>
    </Box> */}
    TracklistItem
  </Paper>
);

export default TracklistItem;
