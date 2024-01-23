/* @refresh reload */
import { render } from 'solid-js/web'

import './root.scss'
import App from './pages/App'

const root = document.getElementById('root')

render(() => <App />, root!)
