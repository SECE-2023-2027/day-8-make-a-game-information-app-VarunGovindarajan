async function getAccessToken() {
  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
    {
      method: 'POST',
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const json = await response.json();
  return json.access_token;
}

export async function queryIgdb(endpoint, queryBody) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error('Could not retrieve access token.');
  }

  const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': process.env.IGDB_CLIENT_ID,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'text/plain', 
    },
    body: queryBody,
    next: {
        revalidate: 3600, 
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("IGDB API Error:", errorText);
    throw new Error(`Failed to fetch data from IGDB: ${response.statusText}`);
  }

  return response.json();
}

export function getCoverUrl(image_id, size = 'cover_big') {
    if (!image_id) {
        return 'https://placehold.co/264x352/1a1a1a/ffffff?text=No+Image';
    }
    return `https://images.igdb.com/igdb/image/upload/t_${size}/${image_id}.jpg`;
}
