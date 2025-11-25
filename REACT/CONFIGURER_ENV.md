# Configuration des Variables d'Environnement

## Problème
Vous recevez l'erreur : `Variables d'environnement Supabase manquantes! Anon Key: MANQUANT`

## Solution

### Étape 1 : Créer le fichier `.env`

Dans le dossier `REACT`, créez un fichier nommé `.env` (sans extension).

### Étape 2 : Ajouter les variables

Ajoutez les lignes suivantes dans le fichier `.env` :

```env
REACT_APP_SUPABASE_URL=https://zkhnngdzqqxzhvxbegxz.supabase.co
REACT_APP_SUPABASE_ANON_KEY=votre_cle_anon_ici
```

### Étape 3 : Obtenir votre clé Supabase

1. Connectez-vous à [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Dans la section **Project API keys**, copiez la clé **anon public**
5. Collez-la dans votre fichier `.env` à la place de `votre_cle_anon_ici`

### Étape 4 : Redémarrer le serveur

**IMPORTANT** : Après avoir créé ou modifié le fichier `.env`, vous devez :

1. Arrêter le serveur de développement (Ctrl+C)
2. Redémarrer avec `npm start`

Les variables d'environnement ne sont chargées qu'au démarrage du serveur.

## Exemple de fichier `.env` complet

```env
# URL de votre projet Supabase
REACT_APP_SUPABASE_URL=https://zkhnngdzqqxzhvxbegxz.supabase.co

# Clé anonyme (anon key) - OBLIGATOIRE
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpraG5uZ2R6cXF4emh2eGJlZ3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MjAxNTU3NTk5OX0.votre_cle_ici

# Clé de service (optionnelle - pour les opérations admin)
REACT_APP_SUPABASE_SERVICE_KEY=
```

## Notes importantes

1. ✅ **Ne mettez PAS de guillemets** autour des valeurs
   - ❌ `REACT_APP_SUPABASE_URL="https://..."`
   - ✅ `REACT_APP_SUPABASE_URL=https://...`

2. ✅ **Les variables doivent commencer par `REACT_APP_`** pour être accessibles dans Create React App

3. ✅ **Ne commitez JAMAIS le fichier `.env`** dans Git (il devrait être dans `.gitignore`)

4. ✅ **Redémarrez toujours le serveur** après avoir modifié `.env`

## Vérification

Après avoir configuré le fichier `.env` et redémarré le serveur, vous ne devriez plus voir l'erreur. Si l'erreur persiste :

1. Vérifiez que le fichier `.env` est bien dans le dossier `REACT` (pas dans `REACT/src`)
2. Vérifiez que les noms des variables sont exactement : `REACT_APP_SUPABASE_URL` et `REACT_APP_SUPABASE_ANON_KEY`
3. Vérifiez qu'il n'y a pas d'espaces avant ou après le signe `=`
4. Redémarrez le serveur

## Emplacement du fichier

Le fichier `.env` doit être à la racine du projet React :

```
REACT/
├── .env          ← ICI
├── package.json
├── src/
│   └── ...
└── ...
```

