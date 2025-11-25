# 🔐 Configuration des Variables d'Environnement

## ⚠️ IMPORTANT : Ne jamais commiter le fichier .env sur GitHub !

Le fichier `.env` contient vos clés secrètes Supabase et doit rester local.

## 📝 Étapes de Configuration

### 1. Créer le fichier .env

Dans le dossier `REACT/`, créez un fichier nommé `.env` (sans extension).

### 2. Copier le template

Copiez le contenu de `.env.example` dans `.env` :

```bash
# Sur Windows (PowerShell)
Copy-Item REACT\.env.example REACT\.env

# Sur Mac/Linux
cp REACT/.env.example REACT/.env
```

### 3. Remplir les valeurs

Ouvrez `REACT/.env` et remplacez les valeurs par vos vraies clés Supabase :

```env
REACT_APP_SUPABASE_URL=https://zkhnngdzqqxzhvxbegxz.supabase.co
REACT_APP_SUPABASE_ANON_KEY=votre_vraie_anon_key_ici
REACT_APP_SUPABASE_SERVICE_KEY=votre_vraie_service_key_ici
```

### 4. Où trouver vos clés Supabase ?

1. Allez sur [https://supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **anon public** key → `REACT_APP_SUPABASE_ANON_KEY`
   - **service_role** key → `REACT_APP_SUPABASE_SERVICE_KEY` (⚠️ gardez-la secrète !)

### 5. Vérifier que .env est ignoré

Le fichier `.env` doit être dans `.gitignore`. Vérifiez avec :

```bash
git check-ignore REACT/.env
```

Si la commande retourne le chemin, c'est bon ✅

## 🚀 Après Configuration

1. Redémarrez le serveur de développement :
   ```bash
   npm start
   ```

2. L'application devrait maintenant se connecter à Supabase.

## 🌐 Pour Netlify

Les variables d'environnement doivent être configurées dans Netlify Dashboard :

1. Allez sur votre site Netlify
2. **Site settings** → **Environment variables**
3. Ajoutez les trois variables :
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_SUPABASE_SERVICE_KEY`

⚠️ **Ne mettez JAMAIS ces valeurs dans le code source !**

## ✅ Checklist

- [ ] Fichier `.env` créé dans `REACT/`
- [ ] Variables remplies avec vos vraies clés
- [ ] `.env` est dans `.gitignore` (vérifié avec `git check-ignore`)
- [ ] Variables configurées dans Netlify (pour la production)
- [ ] Application fonctionne en local
- [ ] Application fonctionne sur Netlify

---

**Note** : Si vous partagez le projet, partagez uniquement `.env.example`, jamais `.env` !

