# 🔐 Instructions pour Ajouter l'Admin dans Supabase

## 📋 Identifiants Admin

- **Numéro de téléphone** : `221781002253`
- **Mot de passe** : `siggilepsixella2025`

## 🚀 Étapes pour Ajouter l'Admin

### ÉTAPE 1 : Ouvrir Supabase SQL Editor

1. Allez sur https://supabase.com/dashboard/project/zkhnngdzqqxzhvxbegxz
2. Cliquez sur **SQL Editor** dans le menu de gauche
3. Cliquez sur **New Query**

### ÉTAPE 2 : Exécuter le Script SQL

1. Ouvrez le fichier `ADD-ADMIN-USER.sql`
2. Copiez tout le contenu
3. Collez-le dans l'éditeur SQL de Supabase
4. Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)

### ÉTAPE 3 : Vérifier

Après exécution, vous devriez voir :
```
✅ 1 row inserted
```

## 🔍 Vérification Manuelle

Exécutez cette requête pour vérifier que l'admin existe :

```sql
SELECT * FROM admin_users WHERE phone_number = '221781002253';
```

Vous devriez voir une ligne avec :
- `phone_number`: `221781002253`
- `password_hash`: `siggilepsixella2025` (ou un hash bcrypt si vous utilisez l'option 2)

## ⚠️ Notes Importantes

### Option 1 : Mot de passe en clair (Actuel)
- Le code actuel accepte le mot de passe en clair pour compatibilité
- **⚠️ Non recommandé pour la production**
- Fonctionne immédiatement sans configuration supplémentaire

### Option 2 : Hash bcrypt (Recommandé pour production)
- Plus sécurisé
- Nécessite l'extension `pgcrypto` dans Supabase
- Le code devra être mis à jour pour utiliser `bcrypt.compare()` au lieu de la comparaison directe

## 🔒 Sécurité Future

Pour améliorer la sécurité en production :

1. **Activer pgcrypto** :
   ```sql
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   ```

2. **Générer un hash bcrypt** du mot de passe
   - Utilisez https://bcrypt-generator.com/
   - Ou utilisez la fonction SQL `crypt()` avec `gen_salt()`

3. **Mettre à jour le code** dans `AdminContext.tsx` pour utiliser `bcrypt.compare()`

## ✅ Test de Connexion

Une fois l'admin ajouté :

1. Allez sur `/admin/login`
2. Entrez :
   - Numéro : `221781002253`
   - Mot de passe : `siggilepsixella2025`
3. Cliquez sur "Se connecter"

La session sera sauvegardée et vous resterez connecté jusqu'à déconnexion.





