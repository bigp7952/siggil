-- Script final corrigé pour les produits populaires
-- À exécuter dans Supabase SQL Editor

-- 1. Supprimer la vue et fonction existantes si elles existent
DROP FUNCTION IF EXISTS get_popular_products(INTEGER);
DROP VIEW IF EXISTS popular_products;

-- 2. Créer une vue avec des types flexibles
CREATE OR REPLACE VIEW popular_products AS
SELECT 
  p.id::TEXT as id,
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

-- 3. Vérifier la vue
SELECT * FROM popular_products LIMIT 3;

-- 4. Créer la fonction avec les bons types
CREATE OR REPLACE FUNCTION get_popular_products(limit_count INTEGER DEFAULT 8)
RETURNS TABLE (
  id TEXT,
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
  sizes JSONB,  -- Changé de TEXT[] à JSONB
  colors JSONB, -- Changé de TEXT[] à JSONB
  created_at TIMESTAMP WITH TIME ZONE,
  order_count BIGINT,
  total_quantity_ordered BIGINT,
  total_revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pp.id::TEXT,
    pp.product_id::TEXT,
    pp.name::TEXT,
    pp.category::TEXT,
    pp.price::DECIMAL,
    pp.original_price::DECIMAL,
    pp.image_url::TEXT,
    pp.image_data::TEXT,
    pp.is_new::BOOLEAN,
    pp.is_active::BOOLEAN,
    pp.stock::INTEGER,
    pp.description::TEXT,
    pp.sizes::JSONB,  -- Changé de TEXT[] à JSONB
    pp.colors::JSONB, -- Changé de TEXT[] à JSONB
    pp.created_at::TIMESTAMP WITH TIME ZONE,
    pp.order_count::BIGINT,
    pp.total_quantity_ordered::BIGINT,
    pp.total_revenue::DECIMAL
  FROM popular_products pp
  ORDER BY pp.order_count DESC, pp.total_quantity_ordered DESC, pp.total_revenue DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 5. Tester la fonction
SELECT * FROM get_popular_products(3);

-- 6. Vérifier que tout fonctionne
SELECT 
  'Vue popular_products' as test_type,
  COUNT(*) as record_count
FROM popular_products
UNION ALL
SELECT 
  'Fonction get_popular_products' as test_type,
  COUNT(*) as record_count
FROM get_popular_products(10);

-- 7. Si vous voulez des données de test, insérer quelques commandes
-- (Décommentez si vous voulez tester avec des données)
/*
INSERT INTO orders (order_id, user_id, user_info, items, total, status, payment_method, city, delivery_address, delivery_city) 
VALUES 
('TEST-001', NULL, '{"firstName": "Test", "lastName": "User"}', 
 '[{"id": "prod1", "name": "T-shirt SIGGIL", "price": 5000, "quantity": 2}]', 
 10000, 'delivered', 'cash', 'Dakar', 'Test Address', 'Dakar'),
('TEST-002', NULL, '{"firstName": "Test2", "lastName": "User2"}', 
 '[{"id": "prod1", "name": "T-shirt SIGGIL", "price": 5000, "quantity": 1}]', 
 5000, 'delivered', 'cash', 'Dakar', 'Test Address 2', 'Dakar');
*/
