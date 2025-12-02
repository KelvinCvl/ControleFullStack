Projet NAHB (Not Another Hero's Book)

C'est une plateforme web fullstack permettant de créer, gérer et jouer des histoires interactives, inspirée des livres dont vous êtes le héros.

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
# Backend 
cd api
npm run dev

# Frontend 
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

    Travail à Réaliser par Kevin
🏁 1. Fins nommées & collection de fins

Mise en place d’un système avancé permettant de personnaliser les fins d’une histoire et d’offrir au lecteur un sentiment de progression.

Fonctionnalités attendues :

Chaque page finale possède désormais un label personnalisé
Exemples :

- Fin héroïque
- Fin tragique
- Fin secrète

Lorsqu’un lecteur termine une histoire :

- la fin atteinte est enregistrée
- elle apparaît dans sa collection de fins débloquées
- Le joueur peut consulter à tout moment :
- les fins déjà découvertes
- les fins restantes (sans contenu dévoilé)

⭐ 2. Notation & commentaires

Pour améliorer la qualité des histoires et créer une interaction entre auteurs et lecteurs, Kevin à implémenter :

- Un système de notation (ex : 1 à 5 étoiles)
- Un système de commentaires sous chaque histoire
- Gestion de ces données dans la base MySQL
- API pour créer, modifier ou supprimer ses propres commentaires

Affichage dynamique frontend :

- moyenne des notes
- liste des commentaires
- pagination si nécessaire

💾 3. Enregistrement automatique en cours de partie

Pour permettre à un lecteur de reprendre une histoire là où il s'était arrêté, il faut enregistrer la progression :

Fonctionnalités obligatoires :

Sauvegarde automatique à chaque action du joueur :

- Histoire en cours
- La page actuelle
- La date de dernière modification

Si le joueur revient sur l’histoire :

- Un bouton “Reprendre la partie” apparaît
- Il est redirigé vers la page où il s’était arrêté

API à implémenter :

    - POST /progression/enregistrer
    - GET /progression/:histoire_id

🚨 4. Signalement d’histoire

Pour renforcer la modération :

- Un lecteur peut signaler une histoire

Le signalement contient :

    - L'id de l’histoire
    - L'id du lecteur
    - La raison du signalement
    - La date
    
Les signalements sont stockés dans une table signalement

Une interface admin doit afficher :

      - La liste des signalements
      
      - La possibilité de supprimer / traiter un signalement
