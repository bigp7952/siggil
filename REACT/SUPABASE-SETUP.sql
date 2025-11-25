-- ============================================
-- Script SQL pour créer les tables Supabase
-- SIGGIL E-commerce
-- ============================================

-- 1. Table USERS (Utilisateurs)
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

-- 2. Table PRODUCTS (Produits)
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

-- 3. Table CATEGORIES (Catégories)
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

-- 4. Table ORDERS (Commandes)
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

-- 5. Table PREMIUM_REQUESTS (Demandes Premium)
CREATE TABLE IF NOT EXISTS premium_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  code TEXT, -- code premium si approuvé
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Table ADMIN_USERS (Administrateurs)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Index pour améliorer les performances
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);

-- ============================================
-- Fonction pour mettre à jour updated_at automatiquement
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) - À activer après création des tables
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Politiques RLS pour PRODUCTS
-- ============================================

-- Tout le monde peut lire les produits actifs
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (is_active = true);

-- Seuls les admins peuvent insérer/modifier/supprimer
CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  WITH CHECK (false); -- À modifier selon votre système d'auth admin

CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
  USING (false); -- À modifier selon votre système d'auth admin

CREATE POLICY "Only admins can delete products"
  ON products FOR DELETE
  USING (false); -- À modifier selon votre système d'auth admin

-- ============================================
-- Politiques RLS pour ORDERS
-- ============================================

-- Les utilisateurs peuvent voir leurs propres commandes
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid()::text = user_id::text OR user_id IS NULL);

-- Les utilisateurs peuvent créer des commandes
CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Seuls les admins peuvent modifier les commandes
CREATE POLICY "Only admins can update orders"
  ON orders FOR UPDATE
  USING (false); -- À modifier selon votre système d'auth admin

-- ============================================
-- Politiques RLS pour USERS
-- ============================================

-- Les utilisateurs peuvent voir leurs propres infos
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

-- Tout le monde peut s'inscrire
CREATE POLICY "Anyone can register"
  ON users FOR INSERT
  WITH CHECK (true);

-- Les utilisateurs peuvent modifier leurs propres infos
CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- ============================================
-- Politiques RLS pour CATEGORIES
-- ============================================

-- Tout le monde peut lire les catégories actives
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (is_active = true);

-- ============================================
-- Politiques RLS pour PREMIUM_REQUESTS
-- ============================================

-- Tout le monde peut créer une demande premium
CREATE POLICY "Anyone can create premium requests"
  ON premium_requests FOR INSERT
  WITH CHECK (true);

-- ============================================
-- Insérer l'admin par défaut
-- ============================================

-- Note: Le mot de passe doit être hashé (utilisez bcrypt ou similaire)
-- Pour l'instant, on insère avec le hash du mot de passe "siggilepsixella2025"
-- Vous devrez générer le hash correct plus tard
INSERT INTO admin_users (phone_number, password_hash)
VALUES ('221781002253', '$2b$10$...') -- Remplacez par le hash réel
ON CONFLICT (phone_number) DO NOTHING;





