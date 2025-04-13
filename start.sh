#!/bin/bash

# Install yt-dlp & ffmpeg
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
chmod a+rx /usr/local/bin/yt-dlp

apt-get update && apt-get install -y ffmpeg

# Start the server
node server.js

