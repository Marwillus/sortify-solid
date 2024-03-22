import { Route, Router } from '@solidjs/router';
import { createTheme, ThemeProvider } from '@suid/material';

import Callback from './Callback';
import Dashboard from './Dashboard';

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {/* <PlaylistsProvider> */}
        <Router>
          <Route path="/" component={Dashboard} />
          <Route path="/callback" component={Callback} />
        </Router>
      {/* </PlaylistsProvider> */}
    </ThemeProvider>
  );
}

export default App;
