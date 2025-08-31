# 🚀 Configuration Supabase pour SIGGIL

## 📋 Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL et votre clé anonyme

### 2. Configuration des variables d'environnement

Créez un fichier `.env` dans le dossier `siggil/` avec les informations suivantes :

```env
REACT_APP_SUPABASE_URL=https://votre-projet.supabase.co
REACT_APP_SUPABASE_ANON_KEY=votre_cle_anonyme_ici
```

### 3. Configuration de la base de données

1. Allez dans votre dashboard Supabase
2. Naviguez vers "SQL Editor"
3. Copiez et exécutez le contenu du fichier `supabase-schema.sql`

### 4. Configuration des politiques RLS

Les politiques Row Level Security sont déjà incluses dans le script SQL. Elles permettent :
- Lecture publique des produits
- Gestion sécurisée des commandes et paniers
- Authentification admin sécurisée

### 5. Données initiales

Le script SQL inclut :
- Un compte admin par défaut :
  - **Username**: `admin`
  - **Password**: `admin123`
- 5 produits de démonstration

### 6. Test de la configuration

1. Démarrez l'application : `npm start`
2. Allez sur `/admin/login`
3. Connectez-vous avec les identifiants admin par défaut

## 🔧 Structure de la base de données

### Tables créées :

1. **products** - Gestion des produits
2. **users** - Utilisateurs clients
3. **admin_users** - Authentification admin
4. **orders** - Commandes
5. **premium_requests** - Demandes premium
6. **cart_items** - Panier utilisateur

### Relations :
- `orders.user_id` → `users.id`
- `cart_items.user_id` → `users.id`
- `cart_items.product_id` → `products.id`
- `premium_requests.user_id` → `users.id`

## 🔐 Sécurité

### Authentification Admin
- Les identifiants admin sont stockés dans la table `admin_users`
- Le mot de passe est stocké en clair (à améliorer en production avec bcrypt)
- Session persistante via localStorage

### Politiques RLS
- Lecture publique des produits
- Écriture sécurisée pour les commandes et paniers
- Accès admin restreint

## 🚨 Important

### En production :
1. Changez le mot de passe admin par défaut
2. Utilisez bcrypt pour le hachage des mots de passe
3. Configurez des politiques RLS plus strictes
4. Activez l'authentification Supabase Auth si nécessaire

### Variables d'environnement :
- Ne committez jamais le fichier `.env` dans Git
- Utilisez des variables d'environnement différentes pour dev/prod

## 🔄 Migration depuis localStorage

L'application migre automatiquement :
- Les produits sont chargés depuis Supabase
- Le panier reste en localStorage pour la simplicité
- Les commandes sont sauvegardées dans Supabase

## 📞 Support

En cas de problème :
1. Vérifiez les variables d'environnement
2. Vérifiez que le script SQL a été exécuté
3. Vérifiez les politiques RLS dans Supabase
4. Consultez les logs de la console navigateur
