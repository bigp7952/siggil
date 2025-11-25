-- ============================================
-- POLITIQUES RLS POUR SUPABASE STORAGE
-- ============================================
-- 
-- IMPORTANT: Exécutez ces commandes dans l'éditeur SQL de Supabase
-- Dashboard > SQL Editor > New Query
--
-- ============================================

-- ============================================
-- BUCKET: products
-- ============================================

-- Supprimer les politiques existantes si elles existent (pour éviter les erreurs)
DROP POLICY IF EXISTS "Products images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete product images" ON storage.objects;

-- 1. Politique SELECT (Lecture publique) - Permet à tous de lire les images
CREATE POLICY "Products images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- 2. Politique INSERT (Upload) - Permet aux admins d'uploader
-- Note: Cette politique nécessite une authentification admin
-- Pour l'instant, on laisse ouverte pour les tests, mais vous devriez la restreindre
CREATE POLICY "Anyone can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');

-- 3. Politique UPDATE (Mise à jour) - Permet aux admins de modifier
CREATE POLICY "Anyone can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');

-- 4. Politique DELETE (Suppression) - Permet aux admins de supprimer
CREATE POLICY "Anyone can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'products');

-- ============================================
-- BUCKET: categories
-- ============================================

-- Supprimer les politiques existantes si elles existent (pour éviter les erreurs)
DROP POLICY IF EXISTS "Categories images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload category images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update category images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete category images" ON storage.objects;

-- 1. Politique SELECT (Lecture publique) - Permet à tous de lire les images
CREATE POLICY "Categories images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'categories');

-- 2. Politique INSERT (Upload) - Permet aux admins d'uploader
CREATE POLICY "Anyone can upload category images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'categories');

-- 3. Politique UPDATE (Mise à jour) - Permet aux admins de modifier
CREATE POLICY "Anyone can update category images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'categories')
WITH CHECK (bucket_id = 'categories');

-- 4. Politique DELETE (Suppression) - Permet aux admins de supprimer
CREATE POLICY "Anyone can delete category images"
ON storage.objects FOR DELETE
USING (bucket_id = 'categories');

-- ============================================
-- VÉRIFICATION
-- ============================================
-- 
-- Après avoir exécuté ces politiques, vérifiez dans :
-- Storage > Buckets > products > Policies
-- 
-- Vous devriez voir 4 politiques :
-- 1. Products images are publicly accessible (SELECT)
-- 2. Anyone can upload product images (INSERT)
-- 3. Anyone can update product images (UPDATE)
-- 4. Anyone can delete product images (DELETE)
--
-- ============================================
-- NOTES IMPORTANTES
-- ============================================
--
-- 1. Assurez-vous que le bucket "products" est PUBLIC :
--    Storage > Buckets > products > Settings > Public bucket = ON
--
-- 2. Assurez-vous que le bucket "categories" est PUBLIC :
--    Storage > Buckets > categories > Settings > Public bucket = ON
--
-- 3. Pour plus de sécurité, vous pouvez restreindre INSERT/UPDATE/DELETE
--    aux utilisateurs authentifiés avec un rôle admin en modifiant les politiques
--    pour utiliser auth.role() = 'authenticated' ou une table de rôles personnalisée
--
-- ============================================

