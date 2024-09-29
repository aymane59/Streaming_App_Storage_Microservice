// models/chunkModel.js
const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
    videoId: { type: String, required: true },
    videoTitle: { type: String, required: true }, // Titre de la vidéo
    chunkNumber: { type: Number, required: true }, // Numéro du chunk
    fogNode: { type: String, required: true }, // Nom/ID du noeud de stockage
    chunkPath: { type: String, required: true }, // Emplacement du chunk dans le noeud
    timestamp: { type: Date, default: Date.now }
});

const Chunk = mongoose.model('Chunk', chunkSchema);
module.exports = Chunk;
