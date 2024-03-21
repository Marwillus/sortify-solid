import { Button } from '@suid/material';

import { redirectUri } from '../utils/authorization';
import { codeVerifier, generateCodeChallenge } from '../utils/encrypt';

const authUrl = new URL("https://accounts.spotify.com/authorize")
const scope = 'user-library-read user-top-read playlist-modify-private playlist-modify-public'
const cc = await generateCodeChallenge()

function Login() {
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
        window.location.href = authUrl.toString()
    };

    return (
        <Button variant='contained' color='primary' onClick={() => handleLogin()}>Login</Button>
    )
}

export default Login
