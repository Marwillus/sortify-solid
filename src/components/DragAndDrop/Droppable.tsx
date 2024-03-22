import './Droppable.scss';

import { ParentComponent } from 'solid-js';

import { createDroppable } from '@thisbeyond/solid-dnd';

const Droppable: ParentComponent<{ id: string, data?: any}> = (props) => {
  const droppable = createDroppable(props.id, props.data);
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
