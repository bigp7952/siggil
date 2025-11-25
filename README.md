# 🏪 SIGGIL - Site E-commerce Streetwear

Un site e-commerce moderne et premium pour la marque de streetwear SIGGIL, développé avec React, TypeScript, Tailwind CSS, Supabase et déployé sur Netlify.

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
- Système de demandes premium avec validation admin

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
- Persistance avec Supabase

### 👨‍💼 Panel Admin
- Dashboard avec statistiques et graphiques
- Gestion des produits (CRUD complet)
- Gestion des commandes avec suivi de statut
- Gestion des catégories
- Gestion des demandes premium
- Outils de recherche, filtrage et tri
- Export CSV des données
- Visualisation avec graphiques (Recharts)

## 🛠️ Technologies Utilisées

- **React 19** avec Hooks et Context
- **TypeScript** pour le typage statique
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **React Router** pour la navigation
- **Supabase** pour le backend (base de données, authentification, storage)
- **Recharts** pour les graphiques
- **Netlify** pour le déploiement

## 📁 Structure du Projet

```
siggil/
├── REACT/                    # Application React principale
│   ├── src/
│   │   ├── components/      # Composants React
│   │   ├── pages/           # Pages de l'application
│   │   ├── contexts/        # Context API (Cart, Auth, etc.)
│   │   ├── lib/             # Configuration Supabase
│   │   ├── services/        # Services (upload images, etc.)
│   │   └── utils/           # Utilitaires
│   ├── public/              # Fichiers statiques
│   ├── build/               # Build de production (généré)
│   ├── .env.example         # Exemple de variables d'environnement
│   └── package.json
├── netlify.toml             # Configuration Netlify
├── .gitignore              # Fichiers à ignorer par Git
└── README.md               # Ce fichier
```

## 🚀 Installation et Configuration

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/siggil.git
cd siggil/REACT
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Copiez le fichier `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```
3. Remplissez les variables dans `.env` :
   ```env
   REACT_APP_SUPABASE_URL=https://votre-projet.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=votre_anon_key_ici
   REACT_APP_SUPABASE_SERVICE_KEY=votre_service_key_ici
   ```

### 4. Configuration de la base de données

Exécutez les scripts SQL dans Supabase (dans l'ordre) :
- `SUPABASE-COMPLETE-SETUP.sql` - Configuration complète
- `ADD_PREMIUM_FIELD.sql` - Ajout du champ premium
- `ADD-ADMIN-USER.sql` - Création d'un utilisateur admin
- `SUPABASE_STORAGE_POLICIES.sql` - Politiques de stockage

Voir les fichiers `.md` dans `REACT/` pour les instructions détaillées.

### 5. Démarrer le serveur de développement

```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🌐 Déploiement sur Netlify

### Configuration automatique

1. Connectez votre repository GitHub à Netlify
2. Configurez les variables d'environnement dans Netlify Dashboard :
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_SUPABASE_SERVICE_KEY` (optionnel, pour fonctions serverless)

3. Netlify détectera automatiquement la configuration dans `netlify.toml`

### Configuration manuelle

Si vous déployez manuellement :
- Base directory: `REACT`
- Build command: `npm run build`
- Publish directory: `REACT/build`

## 🔐 Variables d'environnement

### Développement local
Créez un fichier `.env` dans `REACT/` avec :
```env
REACT_APP_SUPABASE_URL=https://votre-projet.supabase.co
REACT_APP_SUPABASE_ANON_KEY=votre_anon_key
REACT_APP_SUPABASE_SERVICE_KEY=votre_service_key
```

### Production (Netlify)
Configurez les variables dans Netlify Dashboard :
- Site settings → Environment variables

⚠️ **Important** : Ne jamais commiter le fichier `.env` sur GitHub !

## 📊 Base de données Supabase

### Tables principales

- **products** : Catalogue de produits
- **categories** : Catégories de produits
- **orders** : Commandes clients
- **users** : Utilisateurs (authentification par téléphone)
- **premium_requests** : Demandes d'accès premium
- **admin_users** : Utilisateurs administrateurs

### Storage

- **product-images** : Images des produits
- **category-images** : Images des catégories
- **premium-proofs** : Preuves de paiement premium

## 🎯 Scripts Disponibles

```bash
# Développement
npm start          # Démarre le serveur de développement
npm run dev        # Alias pour npm start

# Production
npm run build      # Construit l'application pour la production

# Tests
npm test           # Lance les tests

# Eject (irréversible)
npm run eject      # Éjecte la configuration Create React App
```

## 🔧 Configuration Netlify

Le fichier `netlify.toml` configure :
- Le dossier de build (`REACT`)
- Les redirections pour React Router
- Les headers de sécurité
- Le cache des assets statiques

## 📱 Responsive Design

- **Mobile** : Navigation adaptée, grille 1 colonne
- **Tablet** : Grille 2 colonnes
- **Desktop** : Grille 3-4 colonnes, navigation complète

## 🛡️ Sécurité

- Variables d'environnement pour les clés Supabase
- Authentification par numéro de téléphone
- RLS (Row Level Security) activé sur Supabase
- Headers de sécurité configurés sur Netlify

## 📄 Documentation

Consultez les fichiers `.md` dans `REACT/` pour :
- Configuration Supabase
- Setup des utilisateurs admin
- Configuration du système premium
- Résolution de problèmes

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est développé pour SIGGIL. Tous droits réservés.

## 👥 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation dans `REACT/*.md`

---

**SIGGIL** - Plus qu'une marque, une identité urbaine. 🏪✨

