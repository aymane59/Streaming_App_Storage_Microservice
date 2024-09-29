// routes/chunkRoutes.js
const express = require('express');
const router = express.Router();
const { uploadChunk, getChunkInfo } = require('../controllers/chunkController');

// Route pour uploader un chunk
router.post('/upload', uploadChunk);

// Route pour obtenir des infos sur un chunk
router.get('/:videoId/:chunkNumber', getChunkInfo);

module.exports = router;
