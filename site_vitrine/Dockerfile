# On part d'une image Node.js classique (version 20)
FROM node:20

# On définit le dossier de travail dans le conteneur
WORKDIR /app

# On copie les fichiers de dépendances
COPY package*.json ./

# On installe les dépendances
RUN npm install

# On copie tout le reste du code source
COPY . .

# On construit l'application Next.js pour la production
RUN npm run build

# Le port interne utilisé par Next.js
EXPOSE 3001

# La commande de démarrage
CMD ["npm", "start"]