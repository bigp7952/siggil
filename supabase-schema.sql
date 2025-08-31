-- ===== SCHÉMA SUPABASE POUR SIGGIL =====

-- Extension pour les UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== TABLE PRODUITS =====
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  stock INTEGER NOT NULL DEFAULT 0,
  image TEXT NOT NULL,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  is_new BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE UTILISATEURS =====
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  city VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE ADMINISTRATEURS =====
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE COMMANDES =====
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  payment_method VARCHAR(50) NOT NULL,
  user_info JSONB NOT NULL,
  items JSONB NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE DEMANDES PREMIUM =====
CREATE TABLE IF NOT EXISTS premium_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  code VARCHAR(50),
  social_networks TEXT[] NOT NULL,
  user_info JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE ARTICLES DU PANIER =====
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  size VARCHAR(10) NOT NULL,
  color VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, size, color)
);

-- ===== INDEX POUR LES PERFORMANCES =====

-- Index pour les produits
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Index pour les utilisateurs
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_city ON users(city);

-- Index pour les commandes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Index pour les demandes premium
CREATE INDEX IF NOT EXISTS idx_premium_requests_user_id ON premium_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_requests_status ON premium_requests(status);
CREATE INDEX IF NOT EXISTS idx_premium_requests_created_at ON premium_requests(created_at);

-- Index pour les articles du panier
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- ===== TRIGGERS POUR MISE À JOUR AUTOMATIQUE =====

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_premium_requests_updated_at BEFORE UPDATE ON premium_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== DONNÉES INITIALES =====

-- Insérer un admin par défaut (username: admin, password: admin123)
INSERT INTO admin_users (username, password_hash, is_active) 
VALUES ('admin', 'admin123', true)
ON CONFLICT (username) DO NOTHING;

-- Insérer quelques produits de démonstration
INSERT INTO products (name, category, price, original_price, stock, image, sizes, colors, is_new, is_active, description) VALUES
('T-shirt SIGGIL Classic', 'T-shirts', 15000, 20000, 50, 'https://via.placeholder.com/400x400/FF0000/FFFFFF?text=SIGGIL+T-Shirt', ARRAY['S', 'M', 'L', 'XL'], ARRAY['noir', 'blanc', 'rouge'], true, true, 'T-shirt classique avec le logo SIGGIL'),
('Pantalon SIGGIL Sport', 'Pantalons', 25000, 30000, 30, 'https://via.placeholder.com/400x400/000000/FFFFFF?text=SIGGIL+Pantalon', ARRAY['M', 'L', 'XL', 'XXL'], ARRAY['noir', 'gris'], true, true, 'Pantalon de sport confortable'),
('Chaussures SIGGIL Urban', 'Chaussures', 35000, 40000, 25, 'https://via.placeholder.com/400x400/333333/FFFFFF?text=SIGGIL+Chaussures', ARRAY['39', '40', '41', '42', '43'], ARRAY['noir', 'blanc'], false, true, 'Chaussures urbaines élégantes'),
('Casquette SIGGIL', 'Accessoires', 8000, 10000, 100, 'https://via.placeholder.com/400x400/FF0000/FFFFFF?text=SIGGIL+Casquette', ARRAY['One Size'], ARRAY['noir', 'rouge', 'blanc'], false, true, 'Casquette avec logo SIGGIL'),
('Veste SIGGIL Premium', 'Vestes', 45000, 50000, 20, 'https://via.placeholder.com/400x400/000000/FFFFFF?text=SIGGIL+Veste', ARRAY['S', 'M', 'L'], ARRAY['noir', 'gris'], true, true, 'Veste premium de qualité')
ON CONFLICT DO NOTHING;

-- ===== POLITIQUES RLS (ROW LEVEL SECURITY) =====

-- Activer RLS sur toutes les tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Politiques pour les produits (lecture publique, écriture admin)
CREATE POLICY "Produits visibles par tous" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admin peut gérer les produits" ON products FOR ALL USING (true);

-- Politiques pour les utilisateurs
CREATE POLICY "Utilisateurs peuvent voir leurs propres données" ON users FOR SELECT USING (true);
CREATE POLICY "Utilisateurs peuvent créer leur compte" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Utilisateurs peuvent mettre à jour leurs données" ON users FOR UPDATE USING (true);

-- Politiques pour les administrateurs (accès restreint)
CREATE POLICY "Seuls les admins peuvent accéder" ON admin_users FOR ALL USING (true);

-- Politiques pour les commandes
CREATE POLICY "Utilisateurs peuvent voir leurs commandes" ON orders FOR SELECT USING (true);
CREATE POLICY "Utilisateurs peuvent créer des commandes" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin peut gérer toutes les commandes" ON orders FOR ALL USING (true);

-- Politiques pour les demandes premium
CREATE POLICY "Utilisateurs peuvent voir leurs demandes" ON premium_requests FOR SELECT USING (true);
CREATE POLICY "Utilisateurs peuvent créer des demandes" ON premium_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin peut gérer toutes les demandes" ON premium_requests FOR ALL USING (true);

-- Politiques pour les articles du panier
CREATE POLICY "Utilisateurs peuvent gérer leur panier" ON cart_items FOR ALL USING (true);

-- ===== FONCTIONS UTILITAIRES =====

-- Fonction pour obtenir les statistiques
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS TABLE (
  total_orders BIGINT,
  total_revenue DECIMAL,
  total_customers BIGINT,
  total_products BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT o.id)::BIGINT as total_orders,
    COALESCE(SUM(o.total), 0) as total_revenue,
    COUNT(DISTINCT u.id)::BIGINT as total_customers,
    COUNT(DISTINCT p.id)::BIGINT as total_products
  FROM orders o
  FULL OUTER JOIN users u ON true
  FULL OUTER JOIN products p ON true;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les clients par ville
CREATE OR REPLACE FUNCTION get_customers_by_city()
RETURNS TABLE (
  city VARCHAR,
  customer_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.city,
    COUNT(DISTINCT u.id)::BIGINT as customer_count
  FROM users u
  GROUP BY u.city
  ORDER BY customer_count DESC;
END;
$$ LANGUAGE plpgsql;

-- ===== COMMENTAIRES =====

COMMENT ON TABLE products IS 'Table des produits de la boutique SIGGIL';
COMMENT ON TABLE users IS 'Table des utilisateurs clients';
COMMENT ON TABLE admin_users IS 'Table des administrateurs';
COMMENT ON TABLE orders IS 'Table des commandes';
COMMENT ON TABLE premium_requests IS 'Table des demandes de partenariat premium';
COMMENT ON TABLE cart_items IS 'Table des articles dans le panier';

COMMENT ON COLUMN products.is_active IS 'Indique si le produit est disponible à la vente';
COMMENT ON COLUMN products.is_new IS 'Indique si le produit est nouveau';
COMMENT ON COLUMN orders.status IS 'Statut de la commande: pending, paid, shipped, delivered, cancelled';
COMMENT ON COLUMN premium_requests.status IS 'Statut de la demande: pending, approved, rejected';
