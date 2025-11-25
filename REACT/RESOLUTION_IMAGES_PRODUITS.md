# Résolution : Images des Produits ne s'Affichent Pas

## Problème Identifié

Les images des produits ne s'affichent pas car **les politiques RLS (Row Level Security) ne sont pas configurées** pour le bucket "products" dans Supabase Storage.

## Solution en 3 Étapes

### ÉTAPE 1 : Rendre le Bucket Public

1. Allez dans votre **Supabase Dashboard**
2. Cliquez sur **Storage** dans le menu de gauche
3. Cliquez sur **Buckets**
4. Cliquez sur le bucket **products**
5. Allez dans l'onglet **Settings**
6. **Activez** le toggle **Public bucket**
7. Cliquez sur **Save**

### ÉTAPE 2 : Créer les Politiques RLS

Vous avez deux options :

#### Option A : Via SQL Editor (RECOMMANDÉ - Plus Rapide)

1. Allez dans **SQL Editor** dans le menu de gauche
2. Cliquez sur **New Query**
3. Ouvrez le fichier `SUPABASE_STORAGE_POLICIES.sql` dans votre projet
4. **Copiez-collez** tout le contenu dans l'éditeur SQL
5. Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)

#### Option B : Via l'Interface Supabase

1. Dans **Storage** > **Buckets** > **products**
2. Cliquez sur l'onglet **Policies**
3. Cliquez sur **New Policy** pour chaque politique :

**Politique 1 : SELECT (Lecture publique)**
- Policy name: `Products images are publicly accessible`
- Allowed operation: `SELECT`
- Policy definition: `bucket_id = 'products'`

**Politique 2 : INSERT (Upload)**
- Policy name: `Anyone can upload product images`
- Allowed operation: `INSERT`
- Policy definition: `bucket_id = 'products'`

**Politique 3 : UPDATE (Mise à jour)**
- Policy name: `Anyone can update product images`
- Allowed operation: `UPDATE`
- Policy definition (USING): `bucket_id = 'products'`
- Policy definition (WITH CHECK): `bucket_id = 'products'`

**Politique 4 : DELETE (Suppression)**
- Policy name: `Anyone can delete product images`
- Allowed operation: `DELETE`
- Policy definition: `bucket_id = 'products'`

### ÉTAPE 3 : Vérifier la Configuration

1. Allez dans **Storage** > **Buckets** > **products** > **Policies**
2. Vous devriez voir **4 politiques** créées :
   - ✅ Products images are publicly accessible (SELECT)
   - ✅ Anyone can upload product images (INSERT)
   - ✅ Anyone can update product images (UPDATE)
   - ✅ Anyone can delete product images (DELETE)

3. **Testez une URL d'image** :
   - Allez dans **Storage** > **Buckets** > **products** > **Files**
   - Cliquez sur un fichier image
   - Copiez l'URL publique
   - Ouvrez-la dans votre navigateur
   - L'image devrait s'afficher

## Vérification dans le Code

Le code utilise déjà `formatImageSrc()` qui construit correctement les URLs Supabase Storage. Après avoir configuré les politiques, les images devraient s'afficher automatiquement.

### Format des URLs

Les URLs générées suivent ce format :
```
https://zkhnngdzqqxzhvxbegxz.supabase.co/storage/v1/object/public/products/[CHEMIN_FICHIER]
```

### Exemples de Chemins

- Si `image_url = "temp-1234567890/temp-1234567890-1234567890.png"` dans la base de données
- L'URL complète sera : `https://zkhnngdzqqxzhvxbegxz.supabase.co/storage/v1/object/public/products/temp-1234567890/temp-1234567890-1234567890.png`

## Dépannage

### Les images ne s'affichent toujours pas ?

1. **Vérifiez que le bucket est public** :
   - Storage > Buckets > products > Settings > Public bucket = **ON**

2. **Vérifiez que les politiques sont créées** :
   - Storage > Buckets > products > Policies
   - Vous devriez voir **4 politiques**

3. **Vérifiez l'URL dans la base de données** :
   - Table Editor > products
   - Regardez le champ `image_url`
   - L'URL devrait commencer par `https://zkhnngdzqqxzhvxbegxz.supabase.co/storage/v1/object/public/products/`

4. **Testez l'URL directement** :
   - Copiez l'URL depuis la base de données
   - Ouvrez-la dans un navigateur
   - Si elle fonctionne → le problème est dans le code
   - Si elle ne fonctionne pas → le problème est dans Supabase (bucket non public ou politique RLS)

5. **Vérifiez la console du navigateur** :
   - Ouvrez les DevTools (F12)
   - Allez dans l'onglet Console
   - Regardez les messages de `formatImageSrc`
   - Vérifiez s'il y a des erreurs **403 (Forbidden)** ou **404 (Not Found)**

## Erreurs Courantes

### Erreur 403 (Forbidden)
- **Cause** : Le bucket n'est pas public OU les politiques RLS ne sont pas configurées
- **Solution** : Vérifiez l'étape 1 et 2 ci-dessus

### Erreur 404 (Not Found)
- **Cause** : Le fichier n'existe pas à cet emplacement dans le bucket
- **Solution** : Vérifiez que le fichier existe dans Storage > Buckets > products > Files

### Image par défaut s'affiche
- **Cause** : L'URL est incorrecte ou le fichier n'existe pas
- **Solution** : Vérifiez l'URL dans la base de données et testez-la directement

## Fichiers Créés

J'ai créé deux fichiers pour vous aider :

1. **`SUPABASE_STORAGE_POLICIES.sql`** : Script SQL avec toutes les politiques à exécuter
2. **`CONFIGURATION_STORAGE_POLICIES.md`** : Guide détaillé de configuration

## Prochaines Étapes

1. ✅ Exécutez le script SQL ou créez les politiques manuellement
2. ✅ Vérifiez que le bucket est public
3. ✅ Testez une URL d'image directement dans le navigateur
4. ✅ Rafraîchissez votre application React
5. ✅ Les images devraient maintenant s'afficher !

