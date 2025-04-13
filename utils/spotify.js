// utils/spotify.js
import dotenv from "dotenv";
dotenv.config();

const token = process.env.ACCESS_TOKEN;

export async function fetchWebApi(endpoint, method = 'GET', body = null) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    method,
    body: body ? JSON.stringify(body) : undefined
  });
  return await res.json();
}

export async function getTopTracks() {
  const res = await fetchWebApi(
    'v1/me/top/tracks?time_range=long_term&limit=10', 'GET'
  );
  return res.items;
}

export async function getNowPlaying() {
  return await fetchWebApi('v1/me/player/currently-playing', 'GET');
}

export async function playTrack(trackId) {
  const body = { uris: [`spotify:track:${trackId}`] };
  return await fetchWebApi('v1/me/player/play', 'PUT', body);
}

export async function pausePlayback() {
  return await fetchWebApi('v1/me/player/pause', 'PUT');
}
    