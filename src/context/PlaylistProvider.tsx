import { createContext, createSignal, ParentComponent, useContext } from 'solid-js';

// factory
export const makePlaylistsContext = () => {
  const [fromPlaylists, setFromPlaylists] = createSignal<SpotifyApi.PlaylistObjectFull[]>();
  const [toPlaylists, setToPlaylists] = createSignal<SpotifyApi.PlaylistObjectFull[]>();
  const [fromTracklist, setFromTracklist] = createSignal<SpotifyApi.PagingObject<SpotifyApi.TrackObjectFull>>();
  const [toTracklist, setToTracklist] = createSignal<SpotifyApi.PagingObject<SpotifyApi.TrackObjectFull>>();

  return [
    { fromPlaylists, toPlaylists, fromTracklist, toTracklist },
    { setFromPlaylists, setToPlaylists, setFromTracklist, setToTracklist }
  ] as const;
};

export type PlaylistsContextType = ReturnType<typeof makePlaylistsContext>;

const PlaylistsContext = createContext<PlaylistsContextType>();

export const PlaylistsProvider: ParentComponent = (props) => {
  const [accessors, setters] = makePlaylistsContext();

  return (
    <PlaylistsContext.Provider value={[accessors, setters]}>
      {props.children}
    </PlaylistsContext.Provider>
  );
};

export function usePlaylists() {
  return useContext(PlaylistsContext)!;
}
