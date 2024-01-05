import { createSignal } from 'solid-js'
import solidLogo from '../assets/solid.svg'
import viteLogo from '/vite.svg'
import './Intro.scss'
import { codeChallenge, codeVerifier } from '../utils/encrypt'

const authUrl = new URL("https://accounts.spotify.com/authorize")
const redirectUri = 'http://localhost:5173'
const scope = 'user-library-read user-top-read playlist-modify-private playlist-modify-public'
const cc = await codeChallenge()

function App() {
  window.localStorage.setItem('code_verifier', codeVerifier);

  const params = {
    response_type: 'code',
    client_id: import.meta.env.VITE_CLIENT_ID,
    scope,
    code_challenge_method: 'S256',
    code_challenge: cc,
    redirect_uri: redirectUri,
  }

  authUrl.search = new URLSearchParams(params).toString();

  const handleLogin = () => {
    window.location.href = authUrl.toString();
  };

  // const urlParams = new URLSearchParams(window.location.search);
  // let code = urlParams.get('code');

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={() => handleLogin()}>
          login
        </button>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
    </>
  )
}

export default App
