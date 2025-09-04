-- Script pour insérer des catégories de test

-- Vérifier d'abord si la table existe
SELECT 'Table categories existe' as status
FROM information_schema.tables 
WHERE table_name = 'categories';

-- Insérer des catégories de test
INSERT INTO categories (name, description, image, is_active, sort_order) VALUES
('T-Shirts', 'T-shirts et tops pour tous les styles', '', true, 1),
('Vestes', 'Vestes et blousons tendance', '', true, 2),
('Pantalons', 'Pantalons et jeans', '', true, 3),
('Chaussures', 'Chaussures et baskets', '', true, 4),
('Accessoires', 'Accessoires de mode', '', true, 5)
ON CONFLICT (name) DO NOTHING;

-- Vérifier les catégories insérées
SELECT id, name, description, is_active, sort_order 
FROM categories 
ORDER BY sort_order;


