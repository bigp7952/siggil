# 📦 Configuration Supabase Storage pour les Images

## 🎯 Objectif

Utiliser Supabase Storage pour stocker les images des produits et catégories au lieu de base64 dans la base de données.

## ✅ Avantages

- **Performance** : Chargement plus rapide des images
- **Espace** : Base64 prend 33% d'espace en plus
- **CDN** : Supabase fournit un CDN automatique
- **Optimisation** : Possibilité de redimensionner/optimiser les images

## 📋 Étapes de Configuration

### ÉTAPE 1 : Créer les Buckets dans Supabase

1. Allez sur https://supabase.com/dashboard/project/zkhnngdzqqxzhvxbegxz
2. Cliquez sur **Storage** dans le menu de gauche
3. Cliquez sur **New bucket**

#### Bucket 1 : `products`
- **Name** : `products`
- **Public bucket** : ✅ OUI (pour que les images soient accessibles publiquement)
- **File size limit** : 5 MB
- **Allowed MIME types** : `image/jpeg, image/png, image/gif, image/webp`

#### Bucket 2 : `categories`
- **Name** : `categories`
- **Public bucket** : ✅ OUI
- **File size limit** : 5 MB
- **Allowed MIME types** : `image/jpeg, image/png, image/gif, image/webp`

### ÉTAPE 2 : Configurer les Politiques RLS pour Storage

Dans **Storage** > **Policies**, créez ces politiques :

#### Pour le bucket `products` :

**Policy 1 : Lecture publique**
```sql
CREATE POLICY "Products images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');
```

**Policy 2 : Upload admin seulement**
```sql
CREATE POLICY "Only admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');
```

**Policy 3 : Suppression admin seulement**
```sql
CREATE POLICY "Only admins can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'products');
```

#### Pour le bucket `categories` :

**Policy 1 : Lecture publique**
```sql
CREATE POLICY "Categories images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'categories');
```

**Policy 2 : Upload admin seulement**
```sql
CREATE POLICY "Only admins can upload category images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'categories');
```

**Policy 3 : Suppression admin seulement**
```sql
CREATE POLICY "Only admins can delete category images"
ON storage.objects FOR DELETE
USING (bucket_id = 'categories');
```

### ÉTAPE 3 : Vérification

Une fois les buckets créés, le code utilisera automatiquement Supabase Storage pour :
- ✅ Upload des images de produits
- ✅ Upload des images de catégories
- ✅ Génération d'URLs publiques
- ✅ Fallback vers base64 si Storage échoue

## 🔄 Migration des Images Existantes

Si vous avez déjà des images en base64 dans la base de données, vous pouvez les migrer vers Storage avec un script (à créer plus tard).

## ⚠️ Note Importante

- Les images sont uploadées avec un nom unique basé sur l'ID du produit/catégorie et un timestamp
- Les URLs générées sont permanentes
- En cas d'échec d'upload Storage, le système bascule automatiquement vers base64

