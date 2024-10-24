// services/chunkService.js
const fs = require('fs');
const path = require('path');
const Chunk = require('../models/chunkModel'); // Référence au modèle
const mqtt = require('mqtt'); // Assure-toi d'importer le module mqtt

// Fonction pour traiter le message du chunk
const processChunkMessage = async (chunkData) => {
    const { zone, videoId, videoTitle, streamer, chunkNumber, chunkCount, vecteurV, chunk: encodedChunk } = chunkData;
    
    // Dossier où stocker le chunk
    const storageDir = path.join('/data/chunks_storage', videoId);
    if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
    }
    
    const chunkFileName = `chunk_${chunkNumber}.ts`;
    const chunkFilePath = path.join(storageDir, chunkFileName);
    
    // Décoder les données du chunk
    const decodedChunk = Buffer.from(encodedChunk, 'base64');

    const fogNode = 'node1';
    
    // Enregistrer le fichier chunk dans le système de fichiers
    await fs.promises.writeFile(chunkFilePath, decodedChunk);

    // Stocker les métadonnées dans MongoDB en utilisant le modèle Chunk
    const chunkRecord = new Chunk({
        zone,
        fogNode,
        videoId,
        videoTitle,
        streamer,
        chunkNumber,
        chunkCount,
        vecteurV,
        chunkPath: chunkFilePath,
    });

    await chunkRecord.save();  // Enregistrer dans la base de données MongoDB
    console.log(`Chunk ${chunkNumber} de la vidéo ${videoTitle} stocké avec succès`);
};





// Fonction pour traiter le message du chunk
const processfogNodeMessage = async (chunkData) => {
    const { videoId, videoTitle, chunkNumber, chunkCount , fogNode, chunkPath } = chunkData;


    try {
        // Lire le fichier stocké dans chunkPath
        const fileData = await fs.promises.readFile(chunkPath);

        // Encoder le contenu du fichier en base64
        const encodedData = fileData.toString('base64');

        // Construire le message à envoyer avec les informations requises
        const message = {
            videoId,
            videoTitle,
            fogNode,
            chunkNumber,
            chunkCount,
            chunk: encodedData // Encodage en base64 des données du chunk
        };

        // Se connecter au broker MQTT (assume un broker par défaut ici)
        const brokerIp = 'mqtt://172.20.10.9:1883'; 
        const mqttClient = mqtt.connect(brokerIp);

        mqttClient.on('connect', () => {
            console.log('Connecté au broker:', brokerIp);

            // Publier le message sur le topic 'videoFinale/chunksACombiner'
            const topic = 'videoFinale/chunksACombiner';
            mqttClient.publish(topic, JSON.stringify(message), { qos: 1 }, (error) => {
                if (error) {
                    console.error('Erreur lors de l\'envoi du message:', error);
                } else {
                    console.log('Message envoyé:', message, 'au topic:', topic);
                }

                // Fermer la connexion après l'envoi
                mqttClient.end();
            });
        });

        // Gestion des erreurs de connexion MQTT
        mqttClient.on('error', (error) => {
            console.error('Erreur de connexion MQTT:', error);
        });

    } catch (err) {
        console.error('Erreur lors de la lecture du fichier:', err);
    }

    
};


module.exports = { processChunkMessage, processfogNodeMessage };
