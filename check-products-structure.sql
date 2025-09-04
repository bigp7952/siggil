-- Script pour vérifier la structure exacte de la table products
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier la structure exacte de la table products
SELECT 
  column_name, 
  data_type, 
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- 2. Vérifier les contraintes
SELECT 
  constraint_name,
  constraint_type,
  table_name
FROM information_schema.table_constraints 
WHERE table_name = 'products';

-- 3. Vérifier les types personnalisés
SELECT 
  typname,
  typtype,
  typlen
FROM pg_type 
WHERE typname IN (
  SELECT DISTINCT udt_name 
  FROM information_schema.columns 
  WHERE table_name = 'products'
);

-- 4. Vérifier quelques exemples de données
SELECT 
  id,
  product_id,
  name,
  category,
  price,
  original_price,
  is_new,
  is_active,
  stock
FROM products 
LIMIT 3;
