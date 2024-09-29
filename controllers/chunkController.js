// controllers/chunkController.js
const { storeChunk, getChunkMetadata } = require('../services/chunkService');

const uploadChunk = async (req, res) => {
    const { videoId, videoTitle, chunkNumber, fogNode } = req.body;
    const chunkData = req.file.buffer; // Assurez-vous que le fichier chunk est uploadé correctement

    try {
        await storeChunk(videoId, videoTitle, chunkNumber, fogNode, chunkData);
        res.status(200).send('Chunk uploaded and stored');
    } catch (error) {
        res.status(500).send('Error uploading chunk');
    }
};

const getChunkInfo = async (req, res) => {
    const { videoId, chunkNumber } = req.params;

    try {
        const chunk = await getChunkMetadata(videoId, chunkNumber);
        if (chunk) {
            res.status(200).json(chunk);
        } else {
            res.status(404).send('Chunk not found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving chunk info');
    }
};

module.exports = { uploadChunk, getChunkInfo };
