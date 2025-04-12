const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { sanitizeFilename } = require('./utils');

const TMP_DIR = path.join(__dirname, '../../tmp');

if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);

async function downloadAudio(videoUrl) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const outputPath = path.join(TMP_DIR, `audio_${timestamp}.mp3`);

    const command = `yt-dlp -x --audio-format mp3 -o "${outputPath}" "${videoUrl}"`;
    exec(command, (error, stdout, stderr) => {
  console.log('[DEBUG] stdout:', stdout);
  console.log('[DEBUG] stderr:', stderr);

  if (error) {
    console.error('[FATAL] yt-dlp error:', error);
    return reject(`yt-dlp failed: ${stderr}`);
  }


      // Clean up after 1 minute
      setTimeout(() => {
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      }, 60000);

      resolve(outputPath);
    });
  });
}

module.exports = { downloadAudio };

