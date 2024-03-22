import { ParentComponent } from 'solid-js';

import { createDraggable } from '@thisbeyond/solid-dnd';

const Draggable: ParentComponent<{ id: string | number, data?: any}> = (props) => {
  const draggable = createDraggable(props.id, props.data);
  return (
    <div
      // @ts-ignore: next-line
      use:draggable
      class="draggable"
      classList={{ "opacity-25": draggable.isActiveDraggable }}
    >
      {props.children}
    </div>
  );
};

export default Draggable;
