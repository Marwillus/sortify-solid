export async function fetchWebApi(
    accessToken: string,
    endpoint: string,
    method: string,
    body?: any
  ) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method,
      body: JSON.stringify(body),
    });
    return await res.json();
  }