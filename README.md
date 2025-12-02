Projet ControleFullStack

Plateforme web fullstack permettant de créer, gérer et jouer des histoires interactives, inspirée des livres dont vous êtes le héros.

🏗️ Architecture
Backend
Node.js + Express
Authentification JWT
Bcrypt pour le hashage des mots de passe
Architecture MVC (Controllers / Services / Routes)

Frontend
React
Routing via React Router
Vite pour le développement et le build
Base de données
MySQL (via phpMyAdmin)
Pour : utilisateurs, histoires, pages, choix, statistiques, progressions…

⚙️ Installation
1. Installer les dépendances
# Backend
cd api
npm install

# Frontend
cd web
npm install

2. Configurer les variables d’environnement

Créer un fichier .env dans le dossier api/ contenant :

# ====== MySQL ======
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=controlefullstack
DB_PORT=3306

# ====== Auth ======
JWT_SECRET=monsecretdev
JWT_EXPIRES_IN=1d

# ====== Server ======
API_PORT=5000
NODE_ENV=development

3. Importer la base de données

Via phpMyAdmin ou terminal :

CREATE DATABASE controlefullstack;
USE controlefullstack;
SOURCE controlefullstack.sql;

4. Lancer l’application
# Backend (http://localhost:5000)
cd api
npm run dev

# Frontend (http://localhost:5173)
cd web
npm run dev

🎮 Fonctionnalités
🔐 Authentification

Inscription / Connexion
Sessions sécurisées via JWT
Hashage des mots de passe (bcrypt)
Rôles : lecteur, auteur, admin

✍️ Création d’Histoires (Rôle : Auteur)

Créer, modifier et supprimer une histoire
Définir :
Titre
Description
Thème
Statut (brouillon / publié)
Gérer les pages (contenu, fin)
Gérer les choix (liens entre pages)

📖 Lecture d’Histoires (Rôle : Lecteur)

Explorer les histoires publiées
Faire des choix pour avancer
Atteindre différentes fins

📊 Statistiques

Nombre de parties jouées
Nombre de fois où chaque fin est atteinte
Répartition des parcours
Pourcentage de joueurs ayant pris le même chemin

🔁 Progression

Reprise automatique d'une histoire en cours
Sauvegarde après chaque choix

🛡️ Administration

Voir tous les utilisateurs
Bannir / débannir un utilisateur
Modération des contenus si nécessaire

📡 API Principales (Résumé)
Authentification
POST /auth/inscription
POST /auth/connexion

Histoires

GET /histoire/publiques
GET /histoire/mine
GET /histoire/:id
GET /histoire/:id/debut
POST /histoire
PUT /histoire/:id
DELETE /histoire/:id
Pages & Choix
GET /page/:id
POST /page
GET /choix/:pageId
POST /choix
DELETE /choix/:id

Statistiques

POST /stats/enregistrer
GET /stats/simples/:id
GET /stats/parcours/:id

Progression

POST /progression/enregistrer
GET /progression/:id
Administration
GET /admin/utilisateurs
PUT /admin/utilisateurs/:id/bannir
PUT /admin/utilisateurs/:id/debannir

Travail Réalisé par Laetitia
🎯 1. Filtrage des histoires par thème

Ajout d’un système complet de thèmes permettant aux lecteurs de mieux naviguer parmi les histoires.

Fonctionnalités mises en place :

- Chaque histoire possède maintenant un champ “theme”
- Thèmes enregistrés en base de données
- Affichage du thème dans les listes et dans la lecture
- Filtrage dynamique côté frontend :
- Le lecteur peut afficher uniquement les histoires du thème choisi

Enrichissement de l’API :

- GET /histoire/themes
- Filtre via GET /histoire/publiques?theme=aventure

📊 2. Statistiques de fin (version simple)

Mise en place d’un système de statistiques permettant d’analyser les fins atteintes par les joueurs.

Fonctionnalités :

- Enregistrement automatique en BD chaque fois qu’un lecteur atteint une fin

Pour chaque histoire :

- Nombre total de parties jouées

- Nombre de fois où chaque fin a été atteinte

Création d’un endpoint dédié :

- GET /stats/simples/:id_histoire

Affichage dans le frontend :

- Répartition visuelle des fins atteintes

- Statistiques pour les auteurs

  Résultat global

Grâce à ces fonctionnalités :

- Les lecteurs trouvent leurs histoires plus facilement (classement par thème)

- Les auteurs disposent d’une vue statistique claire sur leur travail

- L’application devient plus riche, plus intuitive et mieux structurée





  Ce que Kevin doit faire : 

  * Fins nommées & collection de fins :

  * chaque page finale a un label ("Fin héroïque", "Fin tragique", etc.),
  * le lecteur voit les fins qu’il a déjà débloquées pour une histoire.

* Notation & commentaires :

  * un utilisateur peut noter une histoire (1–5 ★) et laisser un commentaire,
  * moyenne des notes + nombre de votes affichés sur la fiche de l’histoire.

* enregistrement automatique en cours de partie
  doit être enregistré le parcours du joueur, et l'étape où il se trouve pour qu’il puisse reprendre

*un lecteur peut signaler une histoire
