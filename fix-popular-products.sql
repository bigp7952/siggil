-- Script corrigé pour les produits populaires
-- À exécuter dans Supabase SQL Editor

-- 1. D'abord, vérifions la structure de la table products
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- 2. Supprimer la vue et fonction existantes si elles existent
DROP FUNCTION IF EXISTS get_popular_products(INTEGER);
DROP VIEW IF EXISTS popular_products;

-- 3. Créer une vue corrigée avec les bons types
CREATE OR REPLACE VIEW popular_products AS
SELECT 
  p.id::TEXT as id,  -- Convertir UUID en TEXT
  p.product_id,
  p.name,
  p.category,
  p.price,
  p.original_price,
  p.image_url,
  p.image_data,
  p.is_new,
  p.is_active,
  p.stock,
  p.description,
  p.sizes,
  p.colors,
  p.created_at,
  -- Compter le nombre de fois que ce produit apparaît dans les commandes
  COUNT(o.id)::BIGINT as order_count,
  -- Calculer le total des quantités commandées
  COALESCE(SUM(
    (o.items::jsonb -> 'quantity')::int
  ), 0)::BIGINT as total_quantity_ordered,
  -- Calculer le revenu total généré par ce produit
  COALESCE(SUM(
    (o.items::jsonb -> 'price')::decimal * (o.items::jsonb -> 'quantity')::int
  ), 0)::DECIMAL as total_revenue
FROM products p
LEFT JOIN orders o ON 
  -- Vérifier si le produit est dans les items de la commande
  o.items::jsonb @> jsonb_build_array(
    jsonb_build_object(
      'id', p.product_id,
      'name', p.name
    )
  )
WHERE p.is_active = true
GROUP BY p.id, p.product_id, p.name, p.category, p.price, p.original_price, 
         p.image_url, p.image_data, p.is_new, p.is_active, p.stock, 
         p.description, p.sizes, p.colors, p.created_at
ORDER BY order_count DESC, total_quantity_ordered DESC, total_revenue DESC;

-- 4. Vérifier la vue
SELECT * FROM popular_products LIMIT 5;

-- 5. Créer la fonction corrigée
CREATE OR REPLACE FUNCTION get_popular_products(limit_count INTEGER DEFAULT 8)
RETURNS TABLE (
  id TEXT,  -- Changé de BIGINT à TEXT pour correspondre à UUID converti
  product_id TEXT,
  name TEXT,
  category TEXT,
  price DECIMAL,
  original_price DECIMAL,
  image_url TEXT,
  image_data TEXT,
  is_new BOOLEAN,
  is_active BOOLEAN,
  stock INTEGER,
  description TEXT,
  sizes TEXT[],
  colors TEXT[],
  created_at TIMESTAMP WITH TIME ZONE,
  order_count BIGINT,
  total_quantity_ordered BIGINT,
  total_revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pp.id,
    pp.product_id,
    pp.name,
    pp.category,
    pp.price,
    pp.original_price,
    pp.image_url,
    pp.image_data,
    pp.is_new,
    pp.is_active,
    pp.stock,
    pp.description,
    pp.sizes,
    pp.colors,
    pp.created_at,
    pp.order_count,
    pp.total_quantity_ordered,
    pp.total_revenue
  FROM popular_products pp
  ORDER BY pp.order_count DESC, pp.total_quantity_ordered DESC, pp.total_revenue DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 6. Tester la fonction
SELECT * FROM get_popular_products(5);

-- 7. Vérifier que tout fonctionne
SELECT 
  'Vue popular_products' as test_type,
  COUNT(*) as record_count
FROM popular_products
UNION ALL
SELECT 
  'Fonction get_popular_products' as test_type,
  COUNT(*) as record_count
FROM get_popular_products(10);
