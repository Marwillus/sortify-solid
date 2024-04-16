import './Tracklist.scss';

import { ParentComponent } from 'solid-js';

import { Paper } from '@suid/material';

const Tracklist: ParentComponent<{ data?: any }> = (props) => {
  return (
    <div class="tracklist">
      <Paper 
      elevation={5}
      class="tracklist__content">{props.children}</Paper>
    </div>
  );
};

export default Tracklist;
