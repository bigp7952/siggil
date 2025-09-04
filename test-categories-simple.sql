-- Script de test simple pour vérifier la table des catégories
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier si la table existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'categories'
) as table_exists;

-- 2. Si la table n'existe pas, la créer
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  image_data TEXT,
  color TEXT DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Activer RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 4. Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Allow all operations" ON categories;

-- 5. Créer une politique simple pour permettre l'insertion
CREATE POLICY "Allow all operations" ON categories
  FOR ALL USING (true);

-- 6. Insérer une catégorie de test
INSERT INTO categories (name, description, color, sort_order) 
VALUES ('Test Catégorie', 'Description de test', '#FF0000', 1)
ON CONFLICT (name) DO NOTHING;

-- 7. Vérifier que la catégorie a été créée
SELECT * FROM categories;

-- 8. Vérifier la structure de la table
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;
