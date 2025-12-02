ce que laetitia doit faire :  
5.1 Côté lecteur

* Possibilité de filtrer les histoires
  Ajout d'un thème aux histoires

* Statistiques de fin simples :

  * nombre de fois qu’une fin a été atteinte,
  * nombre total de parties jouées.

* Statistiques de parcours :

  * en fin de partie : « Vous avez pris le même chemin que X % des joueurs »,
  * stats par fin (répartition en %).

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

# 📖 Histoires Interactives

Une application web permettant de créer, publier et jouer des histoires interactives à choix multiples.

## 🎯 Fonctionnalités

### Pour les joueurs
- 📚 Parcourir toutes les histoires publiées
- 🎮 Jouer des histoires interactives avec des choix
- 💾 Sauvegarde automatique de la progression
- 🔄 Reprendre une histoire où vous l'avez laissée
- ⭐ Noter et commenter les histoires
- 🚨 Signaler du contenu inapproprié
- 📊 Voir vos statistiques 

### Pour les auteurs
- ✍️ Créer des histoires à embranchements multiples
- ➕ Ajouter des choix menant à différentes pages
- 🏁 Définir plusieurs fins possibles
- 📤 Publier vos histoires pour les rendre accessibles
- 📈 Consulter les statistiques de vos histoires

## 🛠️ Technologies utilisées

### Frontend
- **React** 18
- **React Router** pour la navigation
- **Vite** comme bundler
- CSS personnalisé

### Backend
- **Node.js** avec Express
- **MySQL** (via mysql2/promise)
- **bcrypt** pour le hashing des mots de passe
- **dotenv** pour la configuration

## 📦 Installation

### Prérequis
- Node.js (v16 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd ControleFullStack
```

Créez un fichier `.env` à la racine du dossier backend :

```env
DB_HOST=localhost
DB_USER=votre_user
DB_PASSWORD=votre_password
DB_NAME=histoires_interactives
PORT=5000
```

### 4. Configuration 

```bash
npm install
```

### 5. Lancer l'application

**Terminal 1 - Backend :**
```bash
cd api
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd web
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📁 Structure du projet

```
projet/
├── backend/
│   ├── controllers/          # Logique des routes
│   ├── services/             # Logique métier
│   ├── routes/               # Définition des routes
│   ├── db.js                 # Configuration MySQL
│   └── server.js             # Point d'entrée
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Composants React
│   │   ├── css/              # Styles
│   │   ├── App.jsx           # Composant principal
│   │   └── main.jsx          # Point d'entrée
│   └── index.html
│
└── README.md
```
