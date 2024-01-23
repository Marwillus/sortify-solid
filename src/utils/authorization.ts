
const client_id = import.meta.env.VITE_CLIENT_ID
export const redirectUri = 'http://localhost:5173/callback'
const tokenUrl = 'https://accounts.spotify.com/api/token'

export const getToken = async (code: string) => {
  const code_verifier = window.localStorage.getItem('code_verifier')
  if (!code_verifier) return
  
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: code_verifier,
    }),
  }

  const body = await fetch(tokenUrl, payload);
  const response = await body.json();  

  localStorage.setItem('access_token', response.access_token);
  localStorage.setItem('refresh_token', response.refresh_token);
  localStorage.setItem('expires_in', response.expires_in);


}

function refreshToken() {
  const refreshToken = window.localStorage.getItem('refresh_token')
  if (!refreshToken) return

  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: new URLSearchParams({
      client_id,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
    .catch((err)=>console.log('refreshing token throws error: ' + err)
    );
}

function logout() {
  localStorage.clear();
  window.location.reload();
}