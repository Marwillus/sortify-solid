import './Intro.scss';

import { Route, Router } from '@solidjs/router';
import { createTheme, ThemeProvider } from '@suid/material';

import Callback from './Callback';
import Dashboard from './Dashboard';

function App() {
  const theme = createTheme({
    palette: {
      mode:'dark'
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Route path="/" component={Dashboard} />
        <Route path="/callback" component={Callback} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
