# Configuration de la base de données Supabase

## ✅ Configuration Supabase terminée

Votre projet Supabase est maintenant configuré avec :
- **URL :** `https://qibvvvbneqhsmuxrlfyg.supabase.co`
- **Clé anonyme :** Configurée dans le code

## 📋 Prochaines étapes : Configurer la base de données

### Étape 1 : Accéder à votre dashboard Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet : `qibvvvbneqhsmuxrlfyg`

### Étape 2 : Exécuter le script SQL
1. Dans votre dashboard, allez dans **SQL Editor**
2. Cliquez sur **New query**
3. Copiez et collez le contenu du fichier `supabase-schema.sql`
4. Cliquez sur **Run** pour exécuter le script

### Étape 3 : Vérifier les tables créées
Le script va créer :
- ✅ Table `products` (produits)
- ✅ Table `users` (utilisateurs)
- ✅ Table `admin_users` (administrateurs)
- ✅ Table `orders` (commandes)
- ✅ Table `premium_requests` (demandes premium)
- ✅ Table `cart_items` (articles du panier)

### Étape 4 : Vérifier les données initiales
Le script va aussi insérer :
- ✅ Un admin par défaut (username: `admin`, password: `admin123`)
- ✅ Des produits d'exemple

## 🔐 Informations de connexion admin

Une fois la base configurée, vous pourrez vous connecter avec :
- **Username :** `admin`
- **Password :** `admin123`

## 🚀 Test de l'application

1. Redémarrez votre serveur local : `npm start`
2. Vérifiez que le composant `SupabaseStatus` affiche "Connecté"
3. Testez la connexion admin
4. Testez l'ajout/modification de produits

## 📁 Fichiers importants

- `src/lib/supabase.ts` - Configuration Supabase
- `supabase-schema.sql` - Script de création de la base
- `src/services/supabaseService.ts` - Services pour interagir avec Supabase
- `src/hooks/useSupabaseMigration.ts` - Migration des données locales

## 🔧 Dépannage

Si vous rencontrez des erreurs :
1. Vérifiez que le script SQL a bien été exécuté
2. Vérifiez que toutes les tables existent dans votre dashboard
3. Vérifiez les logs dans la console du navigateur
4. Vérifiez les logs dans votre dashboard Supabase

## 🎉 Félicitations !

Votre application est maintenant connectée à Supabase et prête pour la production !




