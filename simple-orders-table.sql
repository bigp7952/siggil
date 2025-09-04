-- Script simplifié pour créer la table orders
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Supprimer la table existante si elle existe
DROP TABLE IF EXISTS orders CASCADE;

-- 2. Créer la table orders avec une structure simple
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer des index simples
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- 4. Activer RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 5. Politiques RLS simples
-- Permettre à tous de créer des commandes
CREATE POLICY "Allow insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Permettre à tous de voir les commandes (pour simplifier)
CREATE POLICY "Allow select orders" ON orders
  FOR SELECT USING (true);

-- Permettre à tous de modifier les commandes (pour simplifier)
CREATE POLICY "Allow update orders" ON orders
  FOR UPDATE USING (true);

-- 6. Insérer une commande de test
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

-- 7. Vérifier que tout fonctionne
SELECT * FROM orders;

-- 8. Vérifier la structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- 9. Vérifier les politiques RLS
SELECT 
  policyname, 
  cmd, 
  qual
FROM pg_policies 
WHERE tablename = 'orders';
