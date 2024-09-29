// app.js
const express = require('express');
const multer = require('multer');
const connectDB = require('./config/dbConfig');
const chunkRoutes = require('./routes/chunkRoutes');

const app = express();
const upload = multer();

// Middleware
app.use(express.json());
app.use(upload.single('chunk')); // Utilisation de multer pour gérer l'upload de chunks

// Connexion à MongoDB
connectDB();

// Routes
app.use('/api/chunks', chunkRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Fog storage service running on port ${PORT}`);
});
