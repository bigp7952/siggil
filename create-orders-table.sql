-- Création de la table des commandes pour SIGGIL
-- À exécuter dans l'éditeur SQL de Supabase

-- Supprimer la table si elle existe déjà
DROP TABLE IF EXISTS orders CASCADE;

-- Créer la table des commandes
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id VARCHAR(50) UNIQUE NOT NULL, -- SIGGIL-12345678
  user_id VARCHAR(255),
  user_info JSONB NOT NULL, -- {firstName, lastName, phoneNumber, address}
  items JSONB NOT NULL, -- [{id, name, price, quantity, size, color}]
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('wave', 'orange', 'free')),
  city VARCHAR(100) DEFAULT 'Dakar',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un index sur order_id pour les recherches rapides
CREATE INDEX idx_orders_order_id ON orders(order_id);

-- Créer un index sur user_id pour filtrer par utilisateur
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Créer un index sur status pour filtrer par statut
CREATE INDEX idx_orders_status ON orders(status);

-- Créer un index sur created_at pour trier par date
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion de nouvelles commandes (tout le monde peut créer une commande)
CREATE POLICY "Allow insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Politique pour permettre la lecture de toutes les commandes (pour l'admin)
CREATE POLICY "Allow select orders" ON orders
  FOR SELECT USING (true);

-- Politique pour permettre la mise à jour des commandes (pour l'admin)
CREATE POLICY "Allow update orders" ON orders
  FOR UPDATE USING (true);

-- Politique pour permettre la suppression des commandes (pour l'admin)
CREATE POLICY "Allow delete orders" ON orders
  FOR DELETE USING (true);

-- Insérer quelques commandes de test
INSERT INTO orders (order_id, user_id, user_info, items, total, status, payment_method, city) VALUES
(
  'SIGGIL-001',
  'user-001',
  '{"firstName": "John", "lastName": "Doe", "phoneNumber": "221771234567", "address": "123 Rue Test, Dakar"}',
  '[{"id": "1", "name": "SIGGIL Classic T-Shirt", "price": 19500, "quantity": 2, "size": "M", "color": "noir"}]',
  39000,
  'pending',
  'wave',
  'Dakar'
),
(
  'SIGGIL-002',
  'user-002',
  '{"firstName": "Jane", "lastName": "Smith", "phoneNumber": "221772345678", "address": "456 Avenue Test, Dakar"}',
  '[{"id": "2", "name": "SIGGIL Premium Hoodie", "price": 45000, "quantity": 1, "size": "L", "color": "gris"}]',
  45000,
  'paid',
  'orange',
  'Dakar'
),
(
  'SIGGIL-003',
  'user-003',
  '{"firstName": "Bob", "lastName": "Johnson", "phoneNumber": "221773456789", "address": "789 Boulevard Test, Dakar"}',
  '[{"id": "3", "name": "SIGGIL Urban Jacket", "price": 75000, "quantity": 1, "size": "XL", "color": "noir"}]',
  75000,
  'shipped',
  'free',
  'Dakar'
);

-- Vérifier que les données ont été insérées
SELECT 
  order_id,
  user_info->>'firstName' as first_name,
  user_info->>'lastName' as last_name,
  total,
  status,
  payment_method,
  created_at
FROM orders
ORDER BY created_at DESC;
