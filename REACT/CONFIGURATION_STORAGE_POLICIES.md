# Configuration des Politiques RLS pour Supabase Storage

## Problème
Les images des produits ne s'affichent pas car les politiques RLS (Row Level Security) ne sont pas configurées pour le bucket "products" dans Supabase Storage.

## Solution : Configurer les Politiques RLS

### Étape 1 : Rendre le bucket public

1. Allez dans votre **Supabase Dashboard**
2. Cliquez sur **Storage** dans le menu de gauche
3. Cliquez sur **Buckets**
4. Cliquez sur le bucket **products**
5. Allez dans l'onglet **Settings**
6. Activez le toggle **Public bucket**
7. Cliquez sur **Save**

### Étape 2 : Créer les Politiques RLS

#### Option A : Via l'interface Supabase (Recommandé)

1. Dans **Storage** > **Buckets** > **products**
2. Cliquez sur l'onglet **Policies**
3. Cliquez sur **New Policy**
4. Créez les 4 politiques suivantes :

##### Politique 1 : SELECT (Lecture publique)
- **Policy name**: `Products images are publicly accessible`
- **Allowed operation**: `SELECT`
- **Policy definition**: 
  ```sql
  bucket_id = 'products'
  ```
- Cliquez sur **Review** puis **Save**

##### Politique 2 : INSERT (Upload)
- **Policy name**: `Anyone can upload product images`
- **Allowed operation**: `INSERT`
- **Policy definition**: 
  ```sql
  bucket_id = 'products'
  ```
- Cliquez sur **Review** puis **Save**

##### Politique 3 : UPDATE (Mise à jour)
- **Policy name**: `Anyone can update product images`
- **Allowed operation**: `UPDATE`
- **Policy definition (USING)**: 
  ```sql
  bucket_id = 'products'
  ```
- **Policy definition (WITH CHECK)**: 
  ```sql
  bucket_id = 'products'
  ```
- Cliquez sur **Review** puis **Save**

##### Politique 4 : DELETE (Suppression)
- **Policy name**: `Anyone can delete product images`
- **Allowed operation**: `DELETE`
- **Policy definition**: 
  ```sql
  bucket_id = 'products'
  ```
- Cliquez sur **Review** puis **Save**

#### Option B : Via SQL Editor (Plus rapide)

1. Allez dans **SQL Editor** dans le menu de gauche
2. Cliquez sur **New Query**
3. Copiez-collez le contenu du fichier `SUPABASE_STORAGE_POLICIES.sql`
4. Cliquez sur **Run** (ou Ctrl+Enter)

### Étape 3 : Vérifier la Configuration

1. Allez dans **Storage** > **Buckets** > **products** > **Policies**
2. Vous devriez voir 4 politiques créées :
   - ✅ Products images are publicly accessible (SELECT)
   - ✅ Anyone can upload product images (INSERT)
   - ✅ Anyone can update product images (UPDATE)
   - ✅ Anyone can delete product images (DELETE)

3. Testez une URL d'image directement dans votre navigateur :
   ```
   https://zkhnngdzqqxzhvxbegxz.supabase.co/storage/v1/object/public/products/[CHEMIN_VERS_VOTRE_IMAGE]
   ```
   L'image devrait s'afficher.

### Étape 4 : Répéter pour le bucket "categories"

Si vous avez aussi des images de catégories, répétez les étapes 1-3 pour le bucket **categories**.

## Vérification dans le Code

Après avoir configuré les politiques, les images devraient s'afficher automatiquement car le code utilise déjà `formatImageSrc()` qui construit les URLs Supabase Storage correctement.

### Structure des URLs attendues

Les URLs générées par `formatImageSrc()` suivent ce format :
```
https://zkhnngdzqqxbegxz.supabase.co/storage/v1/object/public/products/[CHEMIN_FICHIER]
```

### Exemple de chemin de fichier

Si un produit a `image_url = "temp-1234567890/temp-1234567890-1234567890.png"`, l'URL complète sera :
```
https://zkhnngdzqqxbegxz.supabase.co/storage/v1/object/public/products/temp-1234567890/temp-1234567890-1234567890.png
```

## Dépannage

### Les images ne s'affichent toujours pas ?

1. **Vérifiez que le bucket est public** :
   - Storage > Buckets > products > Settings > Public bucket = ON

2. **Vérifiez que les politiques sont créées** :
   - Storage > Buckets > products > Policies
   - Vous devriez voir 4 politiques

3. **Vérifiez l'URL dans la base de données** :
   - Table Editor > products
   - Regardez le champ `image_url`
   - L'URL devrait commencer par `https://zkhnngdzqqxbegxz.supabase.co/storage/v1/object/public/products/`

4. **Testez l'URL directement** :
   - Copiez l'URL depuis la base de données
   - Ouvrez-la dans un navigateur
   - Si elle fonctionne, le problème est dans le code
   - Si elle ne fonctionne pas, le problème est dans Supabase (bucket non public ou politique RLS)

5. **Vérifiez la console du navigateur** :
   - Ouvrez les DevTools (F12)
   - Allez dans l'onglet Console
   - Regardez les messages de `formatImageSrc`
   - Vérifiez s'il y a des erreurs 403 (Forbidden) ou 404 (Not Found)

## Sécurité (Optionnel)

Pour plus de sécurité, vous pouvez restreindre les opérations INSERT/UPDATE/DELETE aux utilisateurs authentifiés uniquement. Modifiez les politiques pour utiliser :

```sql
-- Exemple pour INSERT (seulement les utilisateurs authentifiés)
CREATE POLICY "Only authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);
```

Mais pour l'instant, les politiques ouvertes permettent de tester rapidement.

