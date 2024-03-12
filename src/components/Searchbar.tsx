import { BsSearch } from 'solid-icons/bs';
import { Accessor, Component, createSignal } from 'solid-js';

import { Box, IconButton, InputAdornment, OutlinedInput } from '@suid/material';

import { fetchWebApi } from '../utils/api';

const Searchbar: Component<{ accessToken: Accessor<string> }> = (props) => {
  const [searchResults, setSearchResults] = createSignal<any>();

  async function search() {
    const searchResults = await fetchWebApi(
      props.accessToken(),
      "v1/search",
      "GET"
    );
    setSearchResults(searchResults);
  }

  const handleSearch = (e: Event) => {
    e.preventDefault();
    search();
  };

  return (
    <Box my={"2rem"}>
      <form onSubmit={handleSearch}>
        <OutlinedInput
          type="text"
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleSearch} edge="end">
                <BsSearch />
              </IconButton>
            </InputAdornment>
          }
        />
      </form>
    </Box>
  );
};

export default Searchbar;
