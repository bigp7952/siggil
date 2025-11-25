# Comment Ajouter des Images aux Produits Existants

## Problème

Votre produit "PROD-95115869" (Tshirt jean) n'a pas d'image :
- `image_url` = `null`
- `image_data` = `null`

C'est pourquoi l'image par défaut (`/back.jpg`) s'affiche.

## Solution : Ajouter une Image via l'Interface Admin

### Méthode 1 : Via le Dashboard Admin (Recommandé)

1. **Connectez-vous à l'interface admin** :
   - Allez sur `/admin/login`
   - Connectez-vous avec vos identifiants admin

2. **Accédez au Dashboard** :
   - Vous serez redirigé vers `/admin/dashboard`

3. **Trouvez le produit** :
   - Dans la section "Produits", cherchez "Tshirt jean" (PROD-95115869)
   - Cliquez sur le bouton **"Modifier"** (icône crayon) du produit

4. **Ajoutez une image** :
   - Dans le formulaire de modification, trouvez la section "Images"
   - Cliquez sur **"Choisir des fichiers"** ou glissez-déposez une image
   - Sélectionnez une image (JPG, PNG, etc. - max 5MB)
   - L'image sera automatiquement uploadée vers Supabase Storage

5. **Sauvegardez** :
   - Cliquez sur **"Enregistrer"** ou **"Mettre à jour"**
   - L'image sera uploadée et l'URL sera sauvegardée dans `image_url`

### Méthode 2 : Via SQL (Avancé)

Si vous avez déjà une image dans Supabase Storage, vous pouvez mettre à jour directement via SQL :

```sql
-- Mettre à jour l'image_url d'un produit spécifique
UPDATE products
SET image_url = 'https://zkhnngdzqqxzhvxbegxz.supabase.co/storage/v1/object/public/products/PROD-95115869/nom-image.jpg'
WHERE product_id = 'PROD-95115869';
```

## Vérifier les Produits sans Images

### Via SQL Editor

Exécutez cette requête pour lister tous les produits sans images :

```sql
-- Lister tous les produits sans images
SELECT 
  product_id,
  name,
  category,
  price,
  image_url,
  image_data
FROM products
WHERE (image_url IS NULL OR image_url = '')
  AND (image_data IS NULL OR image_data = '')
ORDER BY created_at DESC;
```

### Via l'Interface Admin

Dans le Dashboard Admin, les produits sans images afficheront l'image par défaut (`/back.jpg`). Vous pouvez les identifier visuellement.

## Script SQL pour Mettre à Jour Plusieurs Produits

Si vous avez plusieurs produits sans images et que vous voulez leur assigner une image par défaut :

```sql
-- Exemple : Mettre à jour tous les produits sans image avec une image par défaut
-- (Remplacez l'URL par l'URL réelle de votre image par défaut)
UPDATE products
SET image_url = 'https://zkhnngdzqqxzhvxbegxz.supabase.co/storage/v1/object/public/products/default-product.jpg'
WHERE (image_url IS NULL OR image_url = '')
  AND (image_data IS NULL OR image_data = '');
```

## Uploader une Image Manuellement dans Supabase Storage

Si vous voulez uploader une image manuellement :

1. **Allez dans Supabase Dashboard** :
   - Storage > Buckets > products

2. **Créez un dossier pour le produit** (optionnel mais recommandé) :
   - Cliquez sur "New folder"
   - Nommez-le avec le `product_id` (ex: `PROD-95115869`)

3. **Uploader l'image** :
   - Cliquez sur "Upload file"
   - Sélectionnez votre image
   - L'image sera uploadée dans le bucket

4. **Copier l'URL publique** :
   - Cliquez sur l'image uploadée
   - Copiez l'URL publique (elle ressemble à : `https://zkhnngdzqqxzhvxbegxz.supabase.co/storage/v1/object/public/products/PROD-95115869/image.jpg`)

5. **Mettre à jour le produit** :
   - Utilisez la méthode 1 (Interface Admin) ou méthode 2 (SQL) pour mettre à jour `image_url`

## Structure Recommandée des Images

Pour une meilleure organisation, structurez vos images comme suit dans Supabase Storage :

```
products/
  ├── PROD-95115869/
  │   └── PROD-95115869-1234567890.jpg
  ├── PROD-95115870/
  │   └── PROD-95115870-1234567891.jpg
  └── ...
```

Cela facilite la gestion et la suppression des images plus tard.

## Vérification

Après avoir ajouté une image :

1. **Vérifiez dans la base de données** :
   ```sql
   SELECT product_id, name, image_url 
   FROM products 
   WHERE product_id = 'PROD-95115869';
   ```
   Le champ `image_url` ne devrait plus être `null`.

2. **Vérifiez dans l'interface** :
   - Allez sur la page du produit dans votre site
   - L'image devrait s'afficher au lieu de l'image par défaut

3. **Testez l'URL directement** :
   - Copiez l'URL depuis `image_url`
   - Ouvrez-la dans un navigateur
   - L'image devrait s'afficher

## Notes Importantes

- **Format des images** : JPG, PNG, GIF, WebP (max 5MB)
- **Nom des fichiers** : Utilisez des noms uniques pour éviter les conflits
- **Politiques RLS** : Assurez-vous que les politiques RLS sont configurées (voir `SUPABASE_STORAGE_POLICIES.sql`)
- **Bucket public** : Le bucket "products" doit être public pour que les images s'affichent

## Problèmes Courants

### L'image ne s'affiche pas après l'upload

1. Vérifiez que le bucket est public
2. Vérifiez que les politiques RLS sont configurées
3. Vérifiez que l'URL dans `image_url` est correcte
4. Testez l'URL directement dans le navigateur

### Erreur lors de l'upload

1. Vérifiez la taille du fichier (max 5MB)
2. Vérifiez le format (JPG, PNG, etc.)
3. Vérifiez que vous êtes connecté en tant qu'admin
4. Vérifiez les politiques RLS pour INSERT

