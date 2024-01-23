import './Intro.scss'
import { Route, Router } from '@solidjs/router'
import Dashboard from './Dashboard'
import Callback from './Callback'

function App() {

  return (
    <Router>
      <Route path="/" component={Dashboard} />
      <Route path="/callback" component={Callback} />
    </Router>
  )
}

export default App
