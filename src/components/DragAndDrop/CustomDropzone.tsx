import './Droppable.scss';

import { createSignal, ParentComponent } from 'solid-js';

const CustomDropzone: ParentComponent<{ id: string; data?: any }> = (props) => {
  const [dragOver, setDragover] = createSignal(false);

  return (
    <div
      ondragover={(e) => {
        e.preventDefault();
      }}
      ondragenter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragover(true);
      }}
      ondragleave={(e) => {
        e.preventDefault();
        setDragover(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        const url = e.dataTransfer?.getData("text/plain");
        setDragover(false);
        if (url?.includes("playlist")) {
          const playlistId = url.split("/").at(-1);
          // if (playlistId) getPlaylist(playlistId);
        }
      }}
      style={{
        height: "100%",
        width: "100%",
        outline: dragOver() ? "#ddd dashed 3px" : "",
        "outline-offset": "-0.5rem",
      }}
    >
      {props.children}
    </div>
  );
};

export default CustomDropzone;
