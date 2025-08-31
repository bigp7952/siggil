# Configuration Supabase

## Étape 1 : Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Créez un nouveau projet
4. Notez votre URL de projet et votre clé anonyme

## Étape 2 : Configurer les variables d'environnement

Modifiez le fichier `.env` dans le dossier `siggil/` avec vos vraies valeurs :

```env
REACT_APP_SUPABASE_URL=https://votre-projet.supabase.co
REACT_APP_SUPABASE_ANON_KEY=votre-cle-anonyme-ici
```

## Étape 3 : Configurer la base de données

1. Dans votre dashboard Supabase, allez dans l'éditeur SQL
2. Copiez et exécutez le contenu du fichier `supabase-schema.sql`
3. Cela créera toutes les tables nécessaires avec les données initiales

## Étape 4 : Tester la connexion

1. Redémarrez votre serveur de développement : `npm start`
2. Vérifiez que le composant `SupabaseStatus` affiche "Connecté"
3. Testez les fonctionnalités admin avec :
   - Username: `admin`
   - Password: `admin123`

## Étape 5 : Migration des données

Le système migrera automatiquement vos données locales vers Supabase une fois la connexion établie.

## Dépannage

- Si vous voyez "Variables d'environnement Supabase manquantes", vérifiez votre fichier `.env`
- Si la connexion échoue, vérifiez que votre URL et clé sont correctes
- Si les tables n'existent pas, exécutez le script SQL dans Supabase

## Variables d'environnement actuelles

Actuellement configurées avec des valeurs temporaires :
- URL: `https://your-project.supabase.co`
- Clé: `your-anon-key-here`

**Remplacez ces valeurs par vos vraies informations Supabase !**
