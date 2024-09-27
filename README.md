# Projet de Streaming Accessible - StreamAccess

## Description
Ce projet est une application web de streaming vidéo à la demande, conçue pour être accessible, inclusive, et modulaire. Le projet vise à offrir une expérience utilisateur de qualité, avec un accent sur l'accessibilité et la personnalisation.

<a target="_blank" href="https://docs.google.com/document/d/193HEjxI0iK6uy7enfZTln4PRm8N8PplfEeURyaualiU/edit?usp=sharing">Plus de détails ici</a>

## Table des matières
- [Caractéristiques](#caractéristiques)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Configuration](#configuration)
- [Structure du projet](#structure-du-projet)
- [Utilisation](#utilisation)
- [Tests](#tests)
- [License](#license)

## Caractéristiques
- Streaming vidéo à la demande
- Interface utilisateur accessible et personnalisable
- Options de voix et de sous-titres adaptées aux utilisateurs
- Système d'authentification utilisateur
- Mise en œuvre d'une architecture de composants avec React et Material UI
- Support pour les retours et les besoins des utilisateurs via un recueil d'informations

## Technologies utilisées
- **Frontend**
  - [React](https://reactjs.org/) : Bibliothèque JavaScript pour construire des interfaces utilisateur.
  - [Vite](https://vitejs.dev/) : Outil de construction pour un développement rapide.
  - [Material UI](https://mui.com/) : Bibliothèque de composants pour React offrant des styles accessibles.
  - [Axios](https://axios-http.com/) : Client HTTP pour effectuer des requêtes API.
  
- **Backend**
  - [NestJS](https://nestjs.com/) : Cadre de développement pour construire des applications serveur.
  - [Prisma](https://www.prisma.io/) : Outil ORM pour interagir avec la base de données.
  - [PostgreSQL](https://www.postgresql.org/) : Système de gestion de base de données relationnelle.

## Installation
Pour installer et configurer le projet, suivez ces étapes :

1. **Cloner le dépôt**
   - git clone https://github.com/CineCare/streamAccess-frontend.git
   - cd streamAccess-frontend

2. **Installer les dépendances**
   - npm install

3. **Lancer l'application en mode développement**
   - npm run dev

## Configuration
Avant de commencer le développement, assurez-vous d'avoir installé Node.js et npm. Configurez les variables d'environnement nécessaires dans un fichier `.env` à la racine du projet :

REACT_APP_API_URL=http://localhost:5000/api

## Structure du projet (Maj - 27/09/2024)
```
/frontend
├── /public          # Fichiers statiques
├── /src             # Code source de l'application
│   ├── /assets      # Fichiers statiques spécifiques à l'UI (polices, images)
│   ├── /components  # Composants React
│   ├── /hooks       # Custom hooks
│   ├── /pages       # Pages principales de l'application (Home, Login, Player, etc.)
│   ├── /layouts     # Layouts réutilisables pour différentes pages
│   ├── /utils       # Fonctions utilitaires (formattage de date, helpers)
│   ├── /providers   # Gestion des états globaux (auth, theme)
│   ├── /config      # Configuration globale (variables d'environnement, routes)
│   ├── /services    # Services pour les appels API
│   ├── /styles      # Styles globaux et thèmes
│   ├── index.css    # Style global
│   └── main.tsx     # Point d'entrée de l'application
│
├── vite.config.ts   # Configuration de Vite
├── package.json     # Dépendances et scripts
├── package-lock.json# Dépendances et scripts
├── tsconfig.json    # Configuration TypeScript (si applicable)
└── README.md        # Documentation du projet
```

## Utilisation
Après avoir démarré l'application, ouvrez votre navigateur et accédez à http://localhost:3000. Vous pouvez explorer les films disponibles et utiliser les fonctionnalités d'authentification.

### Exemples d'utilisation
1. **Navigation dans les films**
   - Cliquez sur les vignettes des films pour accéder à leurs détails.
   
2. **Choix des sous-titres et de la voix**
   - Sélectionnez les préférences de sous-titres et de voix via les paramètres.

## Tests
Les tests sont essentiels pour garantir la qualité du code. Utilisez Jest pour exécuter les tests unitaires.

### Exécution des tests
- npm test

## License
Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
