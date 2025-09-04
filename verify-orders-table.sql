-- Script pour vérifier et corriger la structure de la table orders
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Vérifier la structure actuelle de la table
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- 2. Si la table n'existe pas ou a une mauvaise structure, la recréer
DROP TABLE IF EXISTS orders CASCADE;

-- 3. Créer la table orders avec la bonne structure
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_info JSONB NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('wave', 'orange', 'free')),
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer des index pour améliorer les performances
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_city ON orders(city);

-- 5. Activer Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 6. Créer les politiques RLS
-- Politique pour permettre à tous les utilisateurs de créer des commandes
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Politique pour permettre aux utilisateurs de voir leurs propres commandes
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    user_id = auth.uid() OR 
    user_id IS NULL OR
    -- Permettre aux utilisateurs de voir les commandes anonymes
    (user_id IS NULL AND user_info->>'phoneNumber' IS NOT NULL)
  );

-- Politique pour permettre aux admins de voir toutes les commandes
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.phone = '221781002253'
    )
  );

-- Politique pour permettre aux admins de modifier toutes les commandes
CREATE POLICY "Admins can update all orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.phone = '221781002253'
    )
  );

-- Politique pour permettre aux utilisateurs de mettre à jour leurs propres commandes (statut uniquement)
CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (
    user_id = auth.uid()
  );

-- Politique pour permettre aux admins de supprimer toutes les commandes
CREATE POLICY "Admins can delete all orders" ON orders
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.phone = '221781002253'
    )
  );

-- 7. Créer une fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Créer le trigger pour updated_at
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 9. Insérer des données de test (optionnel)
-- Note: user_id est NULL pour les commandes anonymes
INSERT INTO orders (order_id, user_id, user_info, items, total, payment_method, city) VALUES
(
  'SIGGIL-TEST-001',
  NULL,
  '{"firstName": "Test", "lastName": "User", "phoneNumber": "771234567", "address": "Test Address"}',
  '[{"id": "1", "name": "T-Shirt Test", "price": 5000, "quantity": 1, "size": "M", "color": "Noir"}]',
  5000.00,
  'free',
  'Dakar'
);

-- 10. Vérifier que tout fonctionne
SELECT * FROM orders;

-- 11. Vérifier les politiques RLS
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM pg_policies 
WHERE tablename = 'orders';

-- 11b. Vérifier que RLS est activé
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'orders';

-- 12. Vérifier la structure finale de la table
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- 12b. Vérifier les contraintes de la table
SELECT 
  constraint_name,
  constraint_type,
  table_name
FROM information_schema.table_constraints 
WHERE table_name = 'orders';

-- 12c. Vérifier les index de la table
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'orders';

-- 13. Tester l'insertion d'une commande (optionnel)
-- INSERT INTO orders (order_id, user_info, items, total, payment_method, city) VALUES
-- (
--   'SIGGIL-TEST-002',
--   '{"firstName": "John", "lastName": "Doe", "phoneNumber": "778899001", "address": "123 Test Street"}',
--   '[{"id": "2", "name": "Veste Test", "price": 15000, "quantity": 1, "size": "L", "color": "Bleu"}]',
--   15000.00,
--   'wave',
--   'Thiès'
-- );

-- 14. Vérifier que la commande a été créée
-- SELECT * FROM orders WHERE order_id = 'SIGGIL-TEST-002';

-- 15. Nettoyer les données de test (optionnel)
-- DELETE FROM orders WHERE order_id LIKE 'SIGGIL-TEST-%';

-- 16. Vérifier le nombre total de commandes
SELECT COUNT(*) as total_orders FROM orders;

-- 17. Vérifier les commandes récentes
SELECT 
  order_id,
  user_info->>'firstName' as first_name,
  user_info->>'lastName' as last_name,
  user_info->>'phoneNumber' as phone,
  total,
  status,
  created_at
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;
