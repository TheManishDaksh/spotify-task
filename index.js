import express from "express";
import dotenv from "dotenv";
import {
  getTopTracks,
  getNowPlaying,
  playTrack,
  pausePlayback,
} from "./utils/spotify.js";

dotenv.config();
const app = express();
app.use(express.json());

// Get top 10 + now playing
app.get("/spotify", async (req, res) => {
  try {
    const topTracks = await getTopTracks();
    const nowPlaying = await getNowPlaying();

    res.json({
      now_playing: nowPlaying?.item
        ? {
            name: nowPlaying.item.name,
            artist: nowPlaying.item.artists.map(a => a.name).join(', '),
            id: nowPlaying.item.id,
          }
        : null,
      top_10_tracks: topTracks.map(track => ({
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        id: track.id,
      }))
    });
  } catch (err) {
    res.status(500).json({ error: "Spotify API failed", details: err.message });
  }
});

// Play a specific song
app.put("/spotify/play/:id", async (req, res) => {
  try {
    const result = await playTrack(req.params.id);
    res.json({ message: "Playing track", result });
  } catch (err) {
    res.status(500).json({ error: "Failed to play", details: err.message });
  }
});

// Pause songs
app.put("/spotify/pause", async (req, res) => {
  try {
    const result = await pausePlayback();
    res.json({ message: "Playback paused", result });
  } catch (err) {
    res.status(500).json({ error: "Failed to pause", details: err.message });
  }
});

// Server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
