
FROM node:20.17.0

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

COPY . .

# Exposer le port que l'application utilise
EXPOSE 3000

# Commande pour démarrer l'application
CMD [ "node", "app.js" ]
