const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const ytSearch = require('yt-search');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const tempFolder = path.join(__dirname, 'tmp');

// Ensure tmp directory exists
if (!fs.existsSync(tempFolder)) {
  fs.mkdirSync(tempFolder);
}

// Download MP3 using yt-dlp
function downloadAudio(url, videoId) {
  return new Promise((resolve, reject) => {
    const outputPath = path.resolve(tempFolder, `${videoId}.mp3`);
    const command = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${outputPath}" "${url}"`;

    exec(command, (error, stdout, stderr) => {
      console.log('[yt-dlp stdout]', stdout);
      console.log('[yt-dlp stderr]', stderr);

      if (error) {
        return reject(`yt-dlp failed: ${stderr}`);
      }
      resolve(outputPath);
    });
  });
}

// Route to search, check cache, and serve/download audio
app.get('/download', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).send('Missing search query.');
  }

  try {
    const result = await ytSearch(query);
    if (!result.videos.length) {
      return res.status(404).send('No videos found.');
    }

    const video = result.videos[0];
    const videoUrl = video.url;
    const videoId = video.videoId;
    const filePath = path.resolve(tempFolder, `${videoId}.mp3`);
    console.log(`[INFO] Handling request for ${video.title} (${videoId})`);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log('[CACHE] Found cached audio. Streaming from disk.');
      return res.download(filePath, `${video.title}.mp3`);
    }

    // If not cached, download it
    console.log('[DOWNLOAD] File not found. Downloading with yt-dlp...');
    await downloadAudio(videoUrl, videoId);

    if (!fs.existsSync(filePath)) {
      return res.status(500).send('File not found after download.');
    }

    res.download(filePath, `${video.title}.mp3`);

  } catch (err) {
    console.error('[ERROR] Failed:', err);
    res.status(500).send('Internal server error.');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

