import './Droppable.scss';

import { ParentComponent } from 'solid-js';

import { createDroppable } from '@thisbeyond/solid-dnd';

const Droppable: ParentComponent = (props) => {
  const droppable = createDroppable(1);
  return (
    <div
      // @ts-ignore: next-line
      use:droppable
      class="droppable"
      classList={{ "!droppable-accept": droppable.isActiveDroppable }}
    >
      {props.children}
    </div>
  );
};

export default Droppable;
