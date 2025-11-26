# Étape 1: Utiliser une image de base Node.js (version 20, LTS)
FROM node:20-alpine AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances pour installer les packages
COPY package.json .
COPY package-lock.json .

# Installer les dépendances NPM (cette étape est mise en cache)
# Le 'package-lock.json' garantit les versions exactes pour tous
RUN npm install

# Copier le reste du code source
COPY . .

# Commande par défaut pour le développement (le rechargement à chaud est géré par 'volumes' dans docker-compose)
CMD ["npm", "start"]

# Expose le port de l'application React
EXPOSE 3000