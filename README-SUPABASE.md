# Configuration Supabase pour SIGGIL

## 🚀 Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL et votre clé anonyme

### 2. Configurer les variables d'environnement

Créez un fichier `.env` dans le dossier `siggil/` avec le contenu suivant :

```env
# Configuration Supabase
REACT_APP_SUPABASE_URL=votre_url_supabase_ici
REACT_APP_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase_ici

# Configuration de l'application
REACT_APP_APP_NAME=SIGGIL
REACT_APP_APP_VERSION=1.0.0

# Configuration de développement
REACT_APP_DEBUG_MODE=true
REACT_APP_API_TIMEOUT=30000
```

### 3. Exécuter le schéma SQL

1. Dans votre projet Supabase, allez dans l'éditeur SQL
2. Copiez le contenu du fichier `supabase-schema.sql`
3. Exécutez le script SQL

### 4. Vérifier la configuration

Le script SQL va créer :
- ✅ Toutes les tables nécessaires
- ✅ Les index pour les performances
- ✅ Les triggers pour les mises à jour automatiques
- ✅ Les politiques RLS (Row Level Security)
- ✅ Un admin par défaut (username: `admin`, password: `admin123`)
- ✅ Des produits de démonstration

### 5. Tester la connexion

Lancez l'application :
```bash
npm start
```

## 🔐 Sécurité

### Politiques RLS (Row Level Security)

- **Produits** : Lecture publique, écriture admin uniquement
- **Utilisateurs** : Chaque utilisateur peut voir/modifier ses propres données
- **Commandes** : Utilisateurs voient leurs commandes, admin voit tout
- **Demandes Premium** : Utilisateurs voient leurs demandes, admin gère tout
- **Panier** : Chaque utilisateur gère son propre panier

### Admin par défaut

- **Username** : `admin`
- **Password** : `admin123`

⚠️ **Important** : Changez le mot de passe admin en production !

## 📊 Fonctionnalités incluses

### Services disponibles

- ✅ **ProductService** : CRUD complet des produits
- ✅ **OrderService** : Gestion des commandes
- ✅ **UserService** : Gestion des utilisateurs
- ✅ **AdminService** : Authentification admin
- ✅ **PremiumRequestService** : Gestion des demandes premium
- ✅ **CartService** : Gestion du panier

### Fonctions utilitaires

- ✅ **MigrationService** : Conversion des données locales vers Supabase
- ✅ **Fonctions SQL** : Statistiques admin, clients par ville
- ✅ **Gestion d'erreurs** : Try/catch robuste avec messages d'erreur

## 🔧 Dépannage

### Erreurs courantes

1. **"Variables d'environnement Supabase manquantes"**
   - Vérifiez que votre fichier `.env` existe
   - Vérifiez que les variables sont correctement nommées

2. **"Impossible de se connecter à Supabase"**
   - Vérifiez votre URL et clé anonyme
   - Vérifiez que votre projet Supabase est actif

3. **"Erreur de permissions"**
   - Vérifiez que les politiques RLS sont correctement configurées
   - Vérifiez que l'admin par défaut existe

### Logs de débogage

Activez les logs de débogage en ajoutant dans la console :
```javascript
localStorage.setItem('debug', 'true');
```

## 📝 Notes importantes

1. **Migration des données** : Les données existantes dans localStorage seront conservées
2. **Performance** : Les index sont optimisés pour les requêtes fréquentes
3. **Sécurité** : RLS est activé sur toutes les tables
4. **Backup** : Pensez à configurer des sauvegardes automatiques dans Supabase

## 🎯 Prochaines étapes

1. Testez toutes les fonctionnalités
2. Migrez les données existantes si nécessaire
3. Configurez les sauvegardes
4. Changez le mot de passe admin
5. Déployez en production

## 📞 Support

En cas de problème :
1. Vérifiez les logs de la console
2. Vérifiez les logs Supabase
3. Testez la connexion avec l'outil de test Supabase
