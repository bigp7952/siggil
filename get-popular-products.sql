-- Script pour récupérer les produits les plus commandés
-- À exécuter dans Supabase SQL Editor

-- 1. Créer une vue pour calculer le nombre de commandes par produit
CREATE OR REPLACE VIEW popular_products AS
SELECT 
  p.id,
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
  COUNT(o.id) as order_count,
  -- Calculer le total des quantités commandées
  COALESCE(SUM(
    (o.items::jsonb -> 'quantity')::int
  ), 0) as total_quantity_ordered,
  -- Calculer le revenu total généré par ce produit
  COALESCE(SUM(
    (o.items::jsonb -> 'price')::decimal * (o.items::jsonb -> 'quantity')::int
  ), 0) as total_revenue
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

-- 2. Vérifier la vue
SELECT * FROM popular_products LIMIT 10;

-- 3. Créer une fonction pour obtenir les produits les plus populaires
CREATE OR REPLACE FUNCTION get_popular_products(limit_count INTEGER DEFAULT 8)
RETURNS TABLE (
  id BIGINT,
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

-- 4. Tester la fonction
SELECT * FROM get_popular_products(5);

-- 5. Si vous voulez des données de test, insérer quelques commandes
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
