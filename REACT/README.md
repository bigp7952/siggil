# 🏪 SIGGIL - Site E-commerce Streetwear

Un site e-commerce moderne et premium pour la marque de streetwear SIGGIL, développé avec React, TypeScript et Tailwind CSS.

## 🎨 Design & Identité Visuelle

- **Style** : Urbain, sombre et moderne
- **Palette de couleurs** : Noir, rouge accent, blanc
- **Typographie** : Eurostile Extended (fallback Arial)
- **Ambiance** : Streetwear premium avec esthétique urbaine

## ✨ Fonctionnalités

### 🏠 Page d'Accueil
- Hero section immersive avec tous les éléments visuels SIGGIL
- Animations parallaxe et effets de scroll
- Sections produits mis en avant
- Histoire de la marque
- Newsletter signup

### 🛍️ Catalogue Produits
- Grille responsive de produits
- Filtres par catégorie et taille
- Cartes produits avec hover effects
- Badges "Nouveau" pour les nouvelles collections
- Système de tailles et couleurs

### 👑 Section Premium
- Collection en édition limitée
- Compteurs de disponibilité
- Avantages VIP
- Design exclusif avec effets gold/rouge

### 📞 Page Contact
- Formulaire de contact stylé
- Informations entreprise
- Réseaux sociaux avec animations
- FAQ section

### 🛒 Système de Panier
- Panier slide-in depuis la droite
- Gestion des quantités
- Calcul automatique des totaux
- Animations fluides

## 🛠️ Technologies Utilisées

- **React 18** avec Hooks et Context
- **TypeScript** pour le typage statique
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **React Router** pour la navigation
- **Heroicons** pour les icônes

## 📁 Structure du Projet

```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx          # Header avec logo et panier
│   │   └── Navigation.tsx      # Navigation principale
│   ├── home/
│   │   └── Hero.tsx           # Section hero avec assets SIGGIL
│   └── cart/
│       └── Cart.tsx           # Composant panier
├── pages/
│   ├── Home.tsx               # Page d'accueil
│   ├── Products.tsx           # Catalogue produits
│   ├── Premium.tsx            # Section premium
│   └── Contact.tsx            # Page contact
└── assets/
    └── images/                # Images SIGGIL
```

## 🎯 Assets SIGGIL Intégrés

- **back.jpg** : Arrière-plan principal urbain
- **logo.png** : Élément graphique rouge
- **nom.png** : Texte SIGGIL stylisé
- **personne.png** : Photo du personnage central
- **fade.png** : Dégradé de transition

## 🚀 Installation et Démarrage

1. **Cloner le projet**
   ```bash
   git clone [url-du-repo]
   cd siggil
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm start
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 🎨 Personnalisation

### Couleurs
Les couleurs sont définies dans `src/index.css` :
```css
:root {
  --primary-black: #1a1a1a;
  --secondary-black: #2d2d2d;
  --accent-red: #ff0000;
  --white: #ffffff;
}
```

### Animations
- Parallaxe sur les éléments hero
- Hover effects sur les cartes produits
- Transitions fluides entre pages
- Animations de chargement

## 📱 Responsive Design

- **Mobile** : Navigation adaptée, grille 1 colonne
- **Tablet** : Grille 2 colonnes
- **Desktop** : Grille 3-4 colonnes, navigation complète

## 🔧 Scripts Disponibles

- `npm start` : Démarre le serveur de développement
- `npm run build` : Construit l'application pour la production
- `npm test` : Lance les tests
- `npm run eject` : Éjecte la configuration (irréversible)

## 🎯 Fonctionnalités E-commerce

### Système de Panier
- Ajout/suppression d'articles
- Modification des quantités
- Calcul automatique des totaux
- Persistance des données (simulation)

### Filtres et Recherche
- Filtrage par catégorie
- Filtrage par taille
- Système de tri
- Recherche de produits

### Authentification
- Système simplifié par numéro de téléphone
- Pas de mot de passe requis
- Sauvegarde automatique du panier

## 🚀 Déploiement

Le projet peut être déployé sur :
- **Vercel** : Déploiement automatique
- **Netlify** : Drag & drop du dossier build
- **GitHub Pages** : Via GitHub Actions

## 📄 Licence

Ce projet est développé pour SIGGIL. Tous droits réservés.

## 👥 Équipe

- **Design** : SIGGIL Brand Team
- **Développement** : Assistant IA
- **Technologies** : React, TypeScript, Tailwind CSS

---

**SIGGIL** - Plus qu'une marque, une identité urbaine. 🏪✨
