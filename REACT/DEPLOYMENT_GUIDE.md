# 🚀 Guide de Déploiement SIGGIL

## ✅ Vérifications Avant Déploiement

### 1. Fichier .env Local

Assurez-vous que `REACT/.env` existe et contient vos clés Supabase :

```env
REACT_APP_SUPABASE_URL=https://zkhnngdzqqxzhvxbegxz.supabase.co
REACT_APP_SUPABASE_ANON_KEY=votre_anon_key
REACT_APP_SUPABASE_SERVICE_KEY=votre_service_key
```

⚠️ **Ce fichier ne doit JAMAIS être commité sur GitHub !**

### 2. Vérifier que .env est ignoré

```bash
git check-ignore REACT/.env
```

Si la commande retourne `REACT/.env`, c'est bon ✅

## 🌐 Configuration Netlify

### Étape 1 : Variables d'Environnement

1. Allez sur [Netlify Dashboard](https://app.netlify.com)
2. Sélectionnez votre site SIGGIL
3. Allez dans **Site settings** → **Environment variables**
4. Ajoutez les trois variables suivantes :

| Variable | Valeur |
|----------|--------|
| `REACT_APP_SUPABASE_URL` | `https://zkhnngdzqqxzhvxbegxz.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | Votre clé anon Supabase |
| `REACT_APP_SUPABASE_SERVICE_KEY` | Votre clé service Supabase |

### Étape 2 : Configuration du Build

Netlify devrait détecter automatiquement la configuration dans `netlify.toml` :

- **Base directory** : `REACT`
- **Build command** : `npm run build`
- **Publish directory** : `REACT/build`

Si ce n'est pas automatique, configurez manuellement dans **Site settings** → **Build & deploy**.

### Étape 3 : Déploiement Automatique

Si vous avez connecté GitHub à Netlify :
- Chaque push sur `master` déclenchera un nouveau déploiement
- Les variables d'environnement sont utilisées automatiquement

## 🔄 Workflow de Déploiement

### Développement Local

```bash
cd REACT
npm install
npm start
```

### Build de Production

```bash
cd REACT
npm run build
```

Le dossier `REACT/build` contient les fichiers à déployer.

### Push vers GitHub

```bash
git add .
git commit -m "Votre message"
git push origin master
```

Netlify déploiera automatiquement si connecté à GitHub.

## 🐛 Résolution de Problèmes

### Erreur : "Variables d'environnement Supabase manquantes"

**Solution** :
1. Vérifiez que `.env` existe dans `REACT/`
2. Vérifiez les variables dans Netlify Dashboard
3. Redémarrez le build sur Netlify

### Erreur : "Cannot connect to Supabase"

**Solution** :
1. Vérifiez que l'URL Supabase est correcte
2. Vérifiez que les clés sont correctes
3. Vérifiez les politiques RLS dans Supabase

### Build échoue sur Netlify

**Solution** :
1. Vérifiez les logs de build dans Netlify
2. Assurez-vous que `package.json` est dans `REACT/`
3. Vérifiez que toutes les dépendances sont listées

## 📋 Checklist de Déploiement

- [ ] Fichier `.env` configuré localement
- [ ] Variables d'environnement configurées dans Netlify
- [ ] `netlify.toml` présent à la racine
- [ ] Build fonctionne en local (`npm run build`)
- [ ] Application fonctionne en local (`npm start`)
- [ ] Push vers GitHub réussi
- [ ] Déploiement Netlify réussi
- [ ] Application accessible en ligne
- [ ] Connexion Supabase fonctionne

## 🔐 Sécurité

### ✅ À FAIRE
- Utiliser des variables d'environnement pour les secrets
- Garder `.env` dans `.gitignore`
- Utiliser `.env.example` comme template
- Configurer les variables dans Netlify Dashboard

### ❌ À NE JAMAIS FAIRE
- Commiter le fichier `.env`
- Mettre les clés directement dans le code
- Partager les clés Supabase publiquement
- Utiliser la service key côté client

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Netlify
2. Vérifiez les logs Supabase
3. Consultez `SETUP_ENV.md` pour la configuration
4. Consultez `README.md` pour l'installation

---

**Note** : Après chaque modification des variables d'environnement dans Netlify, vous devez redéployer le site.

