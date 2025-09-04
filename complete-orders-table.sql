-- =====================================================
-- SCRIPT COMPLET POUR LA TABLE DES COMMANDES
-- SIGGIL E-COMMERCE - SUPABASE
-- =====================================================

-- 1. SUPPRIMER LA TABLE EXISTANTE (SI ELLE EXISTE)
DROP TABLE IF EXISTS orders CASCADE;

-- 2. CRÉER LA TABLE ORDERS
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  user_id UUID,
  user_info JSONB NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  city TEXT NOT NULL,
  delivery_address TEXT,
  delivery_city TEXT,
  tracking_info TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRÉER LES INDEX POUR LES PERFORMANCES
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_city ON orders(city);
CREATE INDEX idx_orders_payment_method ON orders(payment_method);

-- 4. CRÉER UN INDEX GIN POUR LES RECHERCHES JSON
CREATE INDEX idx_orders_user_info_gin ON orders USING GIN (user_info);
CREATE INDEX idx_orders_items_gin ON orders USING GIN (items);

-- 5. ACTIVER ROW LEVEL SECURITY (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 6. CRÉER LES POLITIQUES RLS
-- Politique pour permettre à tous de créer des commandes
CREATE POLICY "Allow insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Politique pour permettre à tous de voir les commandes
CREATE POLICY "Allow select orders" ON orders
  FOR SELECT USING (true);

-- Politique pour permettre à tous de modifier les commandes
CREATE POLICY "Allow update orders" ON orders
  FOR UPDATE USING (true);

-- Politique pour permettre à tous de supprimer les commandes
CREATE POLICY "Allow delete orders" ON orders
  FOR DELETE USING (true);

-- 7. CRÉER LA FONCTION POUR MISE À JOUR AUTOMATIQUE
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. CRÉER LE TRIGGER
CREATE TRIGGER trigger_update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

-- 9. CRÉER DES CONTRAINTES DE VALIDATION
ALTER TABLE orders 
ADD CONSTRAINT check_status 
CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled'));

ALTER TABLE orders 
ADD CONSTRAINT check_payment_method 
CHECK (payment_method IN ('wave', 'orange', 'free'));

ALTER TABLE orders 
ADD CONSTRAINT check_total_positive 
CHECK (total > 0);

-- 10. INSÉRER DES DONNÉES DE TEST
INSERT INTO orders (
  order_id, 
  user_id, 
  user_info, 
  items, 
  total, 
  payment_method, 
  city,
  delivery_address,
  delivery_city,
  status
) VALUES
-- Commande de test 1
(
  'SIGGIL-TEST-001',
  NULL,
  '{"firstName": "Moussa", "lastName": "Diallo", "phoneNumber": "771234567", "address": "Zone A, Secteur 3"}',
  '[
    {"id": "1", "name": "T-Shirt Premium", "price": 8000, "quantity": 2, "size": "L", "color": "Noir"},
    {"id": "2", "name": "Veste Sport", "price": 15000, "quantity": 1, "size": "M", "color": "Bleu"}
  ]',
  31000.00,
  'wave',
  'Dakar',
  'Zone A, Secteur 3, Dakar',
  'Dakar',
  'pending'
),

-- Commande de test 2
(
  'SIGGIL-TEST-002',
  NULL,
  '{"firstName": "Fatou", "lastName": "Sow", "phoneNumber": "778899001", "address": "Rue 12, Zone B"}',
  '[
    {"id": "3", "name": "Pantalon Jeans", "price": 12000, "quantity": 1, "size": "S", "color": "Bleu"},
    {"id": "4", "name": "Casquette SIGGIL", "price": 3000, "quantity": 1, "size": "M", "color": "Noir"}
  ]',
  15000.00,
  'orange',
  'Thiès',
  'Rue 12, Zone B, Thiès',
  'Thiès',
  'paid'
),

-- Commande de test 3
(
  'SIGGIL-TEST-003',
  NULL,
  '{"firstName": "Omar", "lastName": "Ndiaye", "phoneNumber": "776655443", "address": "Avenue Kennedy"}',
  '[
    {"id": "5", "name": "Sneakers Urban", "price": 25000, "quantity": 1, "size": "42", "color": "Blanc"}
  ]',
  25000.00,
  'free',
  'Saint-Louis',
  'Avenue Kennedy, Saint-Louis',
  'Saint-Louis',
  'shipped'
);

-- 11. CRÉER DES VUES UTILES POUR L'ADMIN
CREATE OR REPLACE VIEW orders_summary AS
SELECT 
  order_id,
  user_info->>'firstName' as first_name,
  user_info->>'lastName' as last_name,
  user_info->>'phoneNumber' as phone,
  total,
  status,
  payment_method,
  city,
  delivery_address,
  delivery_city,
  created_at,
  updated_at
FROM orders
ORDER BY created_at DESC;

-- Vue pour les statistiques
CREATE OR REPLACE VIEW orders_stats AS
SELECT 
  COUNT(*) as total_orders,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
  COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_orders,
  COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
  COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
  SUM(total) as total_revenue,
  AVG(total) as average_order_value
FROM orders;

-- Vue pour les commandes par ville
CREATE OR REPLACE VIEW orders_by_city AS
SELECT 
  city,
  COUNT(*) as order_count,
  SUM(total) as city_revenue
FROM orders
GROUP BY city
ORDER BY city_revenue DESC;

-- 12. CRÉER DES FONCTIONS UTILES
-- Fonction pour obtenir les commandes d'un utilisateur par téléphone
CREATE OR REPLACE FUNCTION get_orders_by_phone(phone_number TEXT)
RETURNS TABLE (
  order_id TEXT,
  total DECIMAL(10,2),
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.order_id,
    o.total,
    o.status,
    o.created_at
  FROM orders o
  WHERE o.user_info->>'phoneNumber' = phone_number
  ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour le statut d'une commande
CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id TEXT,
  p_status TEXT,
  p_tracking_info TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE orders 
  SET 
    status = p_status,
    tracking_info = COALESCE(p_tracking_info, tracking_info),
    notes = COALESCE(p_notes, notes),
    updated_at = NOW()
  WHERE order_id = p_order_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- 13. VÉRIFICATIONS FINALES
-- Vérifier que la table a été créée
SELECT 'Table orders créée avec succès!' as message;

-- Vérifier la structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Vérifier les politiques RLS
SELECT 
  policyname, 
  cmd, 
  qual
FROM pg_policies 
WHERE tablename = 'orders';

-- Vérifier les index
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'orders';

-- Vérifier les données de test
SELECT 
  order_id,
  user_info->>'firstName' as first_name,
  user_info->>'lastName' as last_name,
  total,
  status,
  city
FROM orders
ORDER BY created_at DESC;

-- Vérifier les statistiques
SELECT * FROM orders_stats;

-- Vérifier les commandes par ville
SELECT * FROM orders_by_city;

-- 14. INSTRUCTIONS D'UTILISATION
-- Pour tester les fonctions :
-- SELECT * FROM get_orders_by_phone('771234567');
-- SELECT update_order_status('SIGGIL-TEST-001', 'delivered', 'Livré avec succès', 'Client satisfait');

-- 15. NETTOYAGE DES DONNÉES DE TEST (OPTIONNEL)
-- DELETE FROM orders WHERE order_id LIKE 'SIGGIL-TEST-%';

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
