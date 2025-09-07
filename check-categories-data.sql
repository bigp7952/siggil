-- Script pour vérifier les catégories dans la base de données

-- 1. Vérifier si la table existe
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'categories'
ORDER BY ordinal_position;

-- 2. Vérifier le contenu de la table
SELECT * FROM categories;

-- 3. Vérifier les politiques RLS
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
WHERE tablename = 'categories';

-- 4. Insérer quelques catégories de test si la table est vide
INSERT INTO categories (name, description, image, is_active, sort_order) VALUES
('T-Shirts', 'T-shirts et tops pour tous les styles', '', true, 1),
('Vestes', 'Vestes et blousons tendance', '', true, 2),
('Pantalons', 'Pantalons et jeans', '', true, 3),
('Chaussures', 'Chaussures et baskets', '', true, 4),
('Accessoires', 'Accessoires de mode', '', true, 5)
ON CONFLICT (name) DO NOTHING;

-- 5. Vérifier après insertion
SELECT * FROM categories ORDER BY sort_order;



