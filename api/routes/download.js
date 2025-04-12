const express = require('express');
const router = express.Router();
const { downloadAudio } = require('../helpers/convert');

router.get('/', async (req, res) => {
  const videoUrl = req.query.url;
  console.log('[INFO] URL received:', videoUrl); // add this

  if (!videoUrl) {
    console.log('[WARN] No URL passed');
    return res.status(400).send('Missing YouTube URL.');
  }

  try {
    const filePath = await downloadAudio(videoUrl);
    console.log('[SUCCESS] Audio ready:', filePath); // add this

    res.download(filePath, err => {
      if (err) console.error('Download error:', err);
    });
  } catch (err) {
    console.error('[ERROR] in conversion:', err); // add this
    res.status(500).send('Conversion failed.');
  }
});


module.exports = router;

