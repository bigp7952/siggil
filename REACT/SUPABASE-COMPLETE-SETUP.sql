-- ============================================
-- SCRIPT SQL COMPLET POUR SIGGIL E-COMMERCE
-- À COPIER-COLLER DANS SUPABASE SQL EDITOR
-- ============================================

-- ============================================
-- 1. CRÉATION DES TABLES
-- ============================================

-- Table USERS (Utilisateurs)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  address TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table PRODUCTS (Produits)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  image_data TEXT, -- base64
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  is_new BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table CATEGORIES (Catégories)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT, -- couleur hex
  image_data TEXT, -- base64
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table ORDERS (Commandes)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_info JSONB NOT NULL, -- {firstName, lastName, phoneNumber, address, city}
  items JSONB NOT NULL, -- array d'items
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, paid, shipped, delivered, cancelled
  payment_method TEXT, -- wave, orange_money, etc.
  tracking_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table PREMIUM_REQUESTS (Demandes Premium)
CREATE TABLE IF NOT EXISTS premium_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  code TEXT, -- code premium si approuvé
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table ADMIN_USERS (Administrateurs)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CRÉATION DES INDEX POUR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_premium_requests_status ON premium_requests(status);

-- ============================================
-- 3. FONCTION POUR MISE À JOUR AUTOMATIQUE updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- 4. TRIGGERS POUR updated_at
-- ============================================

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. ACTIVATION ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. SUPPRESSION DES ANCIENNES POLITIQUES (si elles existent)
-- ============================================

DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Only admins can insert products" ON products;
DROP POLICY IF EXISTS "Only admins can update products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Only admins can update orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Anyone can register" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Anyone can create premium requests" ON premium_requests;
DROP POLICY IF EXISTS "Premium requests are viewable by admins" ON premium_requests;
DROP POLICY IF EXISTS "Admin users are viewable by admins" ON admin_users;

-- ============================================
-- 7. POLITIQUES RLS POUR PRODUCTS
-- ============================================

-- Tout le monde peut lire les produits actifs
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (is_active = true);

-- Permettre l'insertion (sera géré par l'application avec service_role)
CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

-- Permettre la mise à jour (sera géré par l'application avec service_role)
CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Permettre la suppression (sera géré par l'application avec service_role)
CREATE POLICY "Anyone can delete products"
  ON products FOR DELETE
  USING (true);

-- ============================================
-- 8. POLITIQUES RLS POUR ORDERS
-- ============================================

-- Les utilisateurs peuvent voir leurs propres commandes (basé sur user_info.phoneNumber)
-- Pour l'instant, on permet à tous de voir toutes les commandes (sera affiné plus tard)
CREATE POLICY "Orders are viewable by everyone"
  ON orders FOR SELECT
  USING (true);

-- Tout le monde peut créer des commandes
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Permettre la mise à jour (sera géré par l'application avec service_role)
CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 9. POLITIQUES RLS POUR USERS
-- ============================================

-- Tout le monde peut voir les utilisateurs (pour l'instant)
CREATE POLICY "Users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- Tout le monde peut s'inscrire
CREATE POLICY "Anyone can register"
  ON users FOR INSERT
  WITH CHECK (true);

-- Les utilisateurs peuvent modifier leurs propres infos (basé sur phone_number)
-- Pour l'instant, on permet à tous de modifier (sera affiné plus tard)
CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 10. POLITIQUES RLS POUR CATEGORIES
-- ============================================

-- Tout le monde peut lire les catégories actives
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (is_active = true);

-- Permettre l'insertion (sera géré par l'application avec service_role)
CREATE POLICY "Anyone can insert categories"
  ON categories FOR INSERT
  WITH CHECK (true);

-- Permettre la mise à jour (sera géré par l'application avec service_role)
CREATE POLICY "Anyone can update categories"
  ON categories FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Permettre la suppression (sera géré par l'application avec service_role)
CREATE POLICY "Anyone can delete categories"
  ON categories FOR DELETE
  USING (true);

-- ============================================
-- 11. POLITIQUES RLS POUR PREMIUM_REQUESTS
-- ============================================

-- Tout le monde peut créer une demande premium
CREATE POLICY "Anyone can create premium requests"
  ON premium_requests FOR INSERT
  WITH CHECK (true);

-- Tout le monde peut voir les demandes (pour l'admin)
CREATE POLICY "Premium requests are viewable by everyone"
  ON premium_requests FOR SELECT
  USING (true);

-- Permettre la mise à jour (sera géré par l'application avec service_role)
CREATE POLICY "Anyone can update premium requests"
  ON premium_requests FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 12. POLITIQUES RLS POUR ADMIN_USERS
-- ============================================

-- Seuls les admins peuvent voir les admins (pour l'instant, on permet à tous)
-- En production, vous devrez affiner cette politique
CREATE POLICY "Admin users are viewable by everyone"
  ON admin_users FOR SELECT
  USING (true);

-- ============================================
-- 13. DONNÉES INITIALES (OPTIONNEL)
-- ============================================

-- Insérer un admin par défaut
-- NOTE: Le mot de passe hashé doit être généré avec bcrypt
-- Pour l'instant, on laisse vide - vous devrez l'ajouter manuellement
-- ou utiliser un script de hashage de mot de passe

-- Exemple (à remplacer par le hash réel du mot de passe "siggilepsixella2025"):
-- INSERT INTO admin_users (phone_number, password_hash)
-- VALUES ('221781002253', '$2b$10$VOTRE_HASH_BCRYPT_ICI')
-- ON CONFLICT (phone_number) DO NOTHING;

-- ============================================
-- FIN DU SCRIPT
-- ============================================

-- Vérification : Exécutez cette requête pour voir toutes les tables créées
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;





