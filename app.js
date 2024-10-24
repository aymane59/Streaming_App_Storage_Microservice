// index.js
require('dotenv').config();
const mqtt = require('mqtt');
const connectDB = require('./config/dbConfig');
const { processChunkMessage, processfogNodeMessage } = require('./services/chunkService');

connectDB();

const brokerUrl = 'mqtt://172.20.10.9'; // Broker local
const topic = 'fog1/chunks'; // Récupère le topic spécifique du noeud à partir de la variable d'environnement
const client = mqtt.connect(brokerUrl);

const topicToListen = 'videoCombiner/node1/chunks'

// Se connecter au broker MQTT
client.on('connect', () => {
    console.log('Connecté au broker MQTT');
    
    // S'abonner au topic spécifique pour ce fog node
    client.subscribe(topic, (err) => {
        if (err) {
            console.error(`Erreur lors de l'abonnement au topic ${topic}:`, err);
        } else {
            console.log(`Abonné au topic: ${topic}`);
        }
    });
    client.subscribe(topicToListen, (err) => {
        if (err) {
            console.error(`Erreur lors de l'abonnement au topic ${topicToListen}:`, err);
        } else {
            console.log(`Abonné au topic: ${topicToListen}`);
        }
    });
});

// Gérer la réception de messages
client.on('message', async (receivedTopic, message) => {
    if (receivedTopic === topic) { // Vérifier que le message est pour ce topic spécifique
        try {
            const chunkData = JSON.parse(message.toString());
            await processChunkMessage(chunkData);
            console.log(`Chunk traité et stocké pour le topic: ${receivedTopic}`);
        } catch (error) {
            console.error('Erreur lors du traitement du chunk:', error);
        }
    } else if (receivedTopic === topicToListen) { // Vérifier que le message est pour ce topic spécifique
        try {
            const chunkData = JSON.parse(message.toString());
            await processfogNodeMessage(chunkData);
            console.log(`Chunk traité et envoyé au chunkCombiner pour le topic: ${receivedTopic}`);
        } catch (error) {
            console.error('Erreur lors du traitement du chunk:', error);
        }
    }
});
