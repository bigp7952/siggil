-- ============================================
-- VÉRIFIER LES PRODUITS SANS IMAGES
-- ============================================
-- 
-- Ce script liste tous les produits qui n'ont pas d'image
-- (ni image_url ni image_data)
--
-- ============================================

-- Lister tous les produits sans images
SELECT 
  id,
  product_id,
  name,
  category,
  price,
  stock,
  image_url,
  image_data,
  is_active,
  created_at
FROM products
WHERE (image_url IS NULL OR image_url = '')
  AND (image_data IS NULL OR image_data = '')
ORDER BY created_at DESC;

-- ============================================
-- STATISTIQUES
-- ============================================

-- Nombre total de produits
SELECT COUNT(*) as total_products FROM products;

-- Nombre de produits avec images
SELECT COUNT(*) as products_with_images 
FROM products
WHERE (image_url IS NOT NULL AND image_url != '')
   OR (image_data IS NOT NULL AND image_data != '');

-- Nombre de produits sans images
SELECT COUNT(*) as products_without_images 
FROM products
WHERE (image_url IS NULL OR image_url = '')
  AND (image_data IS NULL OR image_data = '');

-- Pourcentage de produits avec images
SELECT 
  ROUND(
    (COUNT(CASE WHEN (image_url IS NOT NULL AND image_url != '') 
                 OR (image_data IS NOT NULL AND image_data != '') 
            THEN 1 END) * 100.0 / COUNT(*)), 
    2
  ) as percentage_with_images
FROM products;

-- ============================================
-- PRODUITS SANS IMAGES PAR CATÉGORIE
-- ============================================

SELECT 
  category,
  COUNT(*) as products_without_images
FROM products
WHERE (image_url IS NULL OR image_url = '')
  AND (image_data IS NULL OR image_data = '')
GROUP BY category
ORDER BY products_without_images DESC;

