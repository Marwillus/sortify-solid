import { createContext, createSignal, ParentComponent, useContext } from 'solid-js';



const PlaylistsContext = createContext();

export const PlaylistsProvider: ParentComponent = (props) => {
  const [count, setCount] = createSignal(0);
  const [fromPlaylists, setFromPlaylists] =
    createSignal<SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectFull>>();

  const [toPlaylists, setToPlaylists] =
    createSignal<SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectFull>>();

  const store = [
    count,
    fromPlaylists,
    toPlaylists,
    {
      increment() {
        setCount((c) => c + 1);
      },
      decrement() {
        setCount((c) => c - 1);
      },
    },
  ];

  return (
    <PlaylistsContext.Provider value={store}>
      {props.children}
    </PlaylistsContext.Provider>
  );
};

export function usePlaylists() {
  return useContext(PlaylistsContext);
}
