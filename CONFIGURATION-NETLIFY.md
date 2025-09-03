# Configuration Netlify pour Supabase

## Problème
L'erreur `supabaseUrl is required.` se produit en production parce que les variables d'environnement Supabase ne sont pas configurées sur Netlify.

## Solution : Configurer les variables d'environnement sur Netlify

### Étape 1 : Accéder aux paramètres Netlify
1. Connectez-vous à votre compte Netlify
2. Sélectionnez votre site
3. Allez dans **Site settings** > **Environment variables**

### Étape 2 : Ajouter les variables d'environnement
Ajoutez ces deux variables :

**Variable 1 :**
- **Key :** `REACT_APP_SUPABASE_URL`
- **Value :** `https://votre-projet.supabase.co`
- **Scopes :** All scopes (Production, Deploy previews, Branch deploys)

**Variable 2 :**
- **Key :** `REACT_APP_SUPABASE_ANON_KEY`
- **Value :** `votre-cle-anonyme-supabase`
- **Scopes :** All scopes (Production, Deploy previews, Branch deploys)

### Étape 3 : Redéployer
1. Après avoir ajouté les variables, allez dans **Deploys**
2. Cliquez sur **Trigger deploy** > **Deploy site**
3. Attendez que le déploiement se termine

### Étape 4 : Vérifier
1. Vérifiez que votre site fonctionne sans erreur
2. Le composant `SupabaseStatus` devrait afficher "Connecté"

## Où trouver vos informations Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre projet
3. Allez dans **Settings** > **API**
4. Copiez :
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **anon public** → `REACT_APP_SUPABASE_ANON_KEY`

## Alternative temporaire

Si vous n'avez pas encore configuré Supabase, l'application fonctionnera en mode local uniquement. Les fonctionnalités Supabase seront désactivées en production jusqu'à configuration.

## Dépannage

- **Erreur persiste après configuration :** Vérifiez que les variables sont bien ajoutées et redéployez
- **Variables non visibles :** Assurez-vous d'être dans le bon projet Netlify
- **Déploiement échoue :** Vérifiez que les valeurs des variables sont correctes
