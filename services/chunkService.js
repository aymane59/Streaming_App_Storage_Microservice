// services/chunkService.js
const Chunk = require('../models/chunkModel');
const fs = require('fs');
const path = require('path');

// Emplacement de stockage des chunks dans le noeud local
const chunkStoragePath = '/data/chunks_storage/'; 

const storeChunk = async (videoId, videoTitle, chunkNumber, fogNode, chunkData) => {
    try {
        const chunkFilePath = path.join(chunkStoragePath, `${videoTitle}_chunk${chunkNumber}.mp4`);

        // Écrire le chunk sur le disque local
        fs.writeFileSync(chunkFilePath, chunkData);

        // Sauvegarder les métadonnées dans MongoDB
        const newChunk = new Chunk({
            videoId,
            videoTitle,
            chunkNumber,
            fogNode,
            chunkPath: chunkFilePath
        });

        await newChunk.save();
        console.log('Chunk saved:', newChunk);
    } catch (error) {
        console.error('Error storing chunk:', error);
        throw error;
    }
};

const getChunkMetadata = async (videoId, chunkNumber) => {
    return await Chunk.findOne({ videoId, chunkNumber });
};

module.exports = { storeChunk, getChunkMetadata };
