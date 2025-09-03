ãã&é-- Création de la table des produits pour SIGGIL
-- À exécuter dans l'éditeur SQL de Supabase

-- Supprimer la table si elle existe déjà
DROP TABLE IF EXISTS products CASCADE;

-- Créer la table des produits
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id VARCHAR(50) UNIQUE NOT NULL, -- PROD-12345678
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  image_data TEXT, -- Base64 encoded image
  sizes JSONB DEFAULT '[]', -- ["S", "M", "L", "XL"]
  colors JSONB DEFAULT '[]', -- ["noir", "blanc", "rouge"]
  is_new BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un index sur product_id pour les recherches rapides
CREATE INDEX idx_products_product_id ON products(product_id);

-- Créer un index sur category pour filtrer par catégorie
CREATE INDEX idx_products_category ON products(category);

-- Créer un index sur is_active pour filtrer les produits actifs
CREATE INDEX idx_products_is_active ON products(is_active);

-- Créer un index sur is_new pour les nouveaux produits
CREATE INDEX idx_products_is_new ON products(is_new);

-- Créer un index sur created_at pour trier par date
CREATE INDEX idx_products_created_at ON products(created_at);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_products_updated_at();

-- Activer Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture de tous les produits actifs (pour les utilisateurs)
CREATE POLICY "Allow select active products" ON products
  FOR SELECT USING (is_active = true);

-- Politique pour permettre l'insertion de nouveaux produits (pour l'admin)
CREATE POLICY "Allow insert products" ON products
  FOR INSERT WITH CHECK (true);

-- Politique pour permettre la mise à jour des produits (pour l'admin)
CREATE POLICY "Allow update products" ON products
  FOR UPDATE USING (true);

-- Politique pour permettre la suppression des produits (pour l'admin)
CREATE POLICY "Allow delete products" ON products
  FOR DELETE USING (true);

-- Insérer quelques produits de test
INSERT INTO products (product_id, name, category, price, original_price, stock, image_url, sizes, colors, is_new, is_active, description) VALUES
(
  'PROD-001',
  'SIGGIL Classic T-Shirt',
  'T-Shirts',
  19500,
  25000,
  50,
  'https://example.com/siggil-classic-tshirt.jpg',
  '["S", "M", "L", "XL"]',
  '["noir", "blanc", "rouge"]',
  true,
  true,
  'T-shirt classique SIGGIL avec design exclusif. Matériau 100% coton, coupe confortable.'
),
(
  'PROD-002',
  'SIGGIL Premium Hoodie',
  'Hoodies',
  45000,
  55000,
  30,
  'https://example.com/siggil-premium-hoodie.jpg',
  '["M", "L", "XL", "XXL"]',
  '["gris", "noir", "bleu"]',
  true,
  true,
  'Hoodie premium SIGGIL avec capuche et poches. Matériau doux et chaud, parfait pour l''hiver.'
),
(
  'PROD-003',
  'SIGGIL Urban Jacket',
  'Vestes',
  75000,
  85000,
  20,
  'https://example.com/siggil-urban-jacket.jpg',
  '["S", "M", "L", "XL"]',
  '["noir", "gris"]',
  false,
  true,
  'Veste urbaine SIGGIL avec style moderne. Imperméable et résistante aux intempéries.'
),
(
  'PROD-004',
  'SIGGIL Sport Cap',
  'Casquettes',
  15000,
  18000,
  100,
  'https://example.com/siggil-sport-cap.jpg',
  '["One Size"]',
  '["noir", "blanc", "rouge", "bleu"]',
  true,
  true,
  'Casquette sport SIGGIL avec logo brodé. Ajustable et confortable pour tous les sports.'
),
(
  'PROD-005',
  'SIGGIL Denim Jeans',
  'Pantalons',
  35000,
  42000,
  40,
  'https://example.com/siggil-denim-jeans.jpg',
  '["28", "30", "32", "34", "36"]',
  '["bleu", "noir"]',
  false,
  true,
  'Jeans denim SIGGIL avec coupe moderne. Matériau durable et confortable.'
);

-- Vérifier que les données ont été insérées
SELECT 
  product_id,
  name,
  category,
  price,
  stock,
  is_new,
  is_active,
  created_at
FROM products
ORDER BY created_at DESC;
