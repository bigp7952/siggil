-- =====================================================
-- SCRIPT POUR CRÉER LA TABLE DES CATÉGORIES POPULAIRES
-- SIGGIL E-COMMERCE - SUPABASE
-- =====================================================

-- 1. SUPPRIMER LA TABLE EXISTANTE (SI ELLE EXISTE)
DROP TABLE IF EXISTS categories CASCADE;

-- 2. CRÉER LA TABLE CATEGORIES
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  image_data TEXT, -- Base64 pour l'image
  color TEXT DEFAULT '#3B82F6', -- Couleur de la catégorie
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRÉER LES INDEX POUR LES PERFORMANCES
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
CREATE INDEX idx_categories_created_at ON categories(created_at);

-- 4. ACTIVER ROW LEVEL SECURITY (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 5. CRÉER LES POLITIQUES RLS
-- Politique pour permettre à tous de voir les catégories actives
CREATE POLICY "Allow select active categories" ON categories
  FOR SELECT USING (is_active = true);

-- Politique pour permettre aux admins de tout faire
CREATE POLICY "Allow admin all operations" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.phone = '221781002253'
    )
  );

-- 6. CRÉER LA FONCTION POUR MISE À JOUR AUTOMATIQUE
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. CRÉER LE TRIGGER
CREATE TRIGGER trigger_update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();

-- 8. CRÉER DES CONTRAINTES DE VALIDATION
ALTER TABLE categories 
ADD CONSTRAINT check_color_format 
CHECK (color ~ '^#[0-9A-Fa-f]{6}$');

ALTER TABLE categories 
ADD CONSTRAINT check_sort_order_positive 
CHECK (sort_order >= 0);

-- 9. INSÉRER DES CATÉGORIES DE TEST
INSERT INTO categories (
  name, 
  description, 
  color, 
  sort_order,
  product_count
) VALUES
-- Catégorie 1
(
  'Vêtements',
  'T-shirts, pantalons, vestes et plus encore',
  '#EF4444',
  1,
  25
),

-- Catégorie 2
(
  'Chaussures',
  'Sneakers, sandales et chaussures élégantes',
  '#10B981',
  2,
  18
),

-- Catégorie 3
(
  'Accessoires',
  'Sacs, montres, bijoux et accessoires de mode',
  '#F59E0B',
  3,
  32
),

-- Catégorie 4
(
  'Sport',
  'Équipements et vêtements de sport',
  '#8B5CF6',
  4,
  15
),

-- Catégorie 5
(
  'Électronique',
  'Smartphones, écouteurs et gadgets',
  '#06B6D4',
  5,
  22
),

-- Catégorie 6
(
  'Maison',
  'Décoration et articles pour la maison',
  '#84CC16',
  6,
  28
);

-- 10. CRÉER DES VUES UTILES
CREATE OR REPLACE VIEW categories_summary AS
SELECT 
  id,
  name,
  description,
  image_url,
  color,
  is_active,
  sort_order,
  product_count,
  created_at
FROM categories
WHERE is_active = true
ORDER BY sort_order ASC, name ASC;

-- Vue pour les statistiques des catégories
CREATE OR REPLACE VIEW categories_stats AS
SELECT 
  COUNT(*) as total_categories,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_categories,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_categories,
  SUM(product_count) as total_products,
  AVG(product_count) as average_products_per_category
FROM categories;

-- 11. CRÉER DES FONCTIONS UTILES
-- Fonction pour mettre à jour le nombre de produits d'une catégorie
CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE categories 
    SET product_count = product_count + 1 
    WHERE name = NEW.category;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE categories 
    SET product_count = GREATEST(0, product_count - 1) 
    WHERE name = OLD.category;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.category != NEW.category THEN
      UPDATE categories 
      SET product_count = GREATEST(0, product_count - 1) 
      WHERE name = OLD.category;
      UPDATE categories 
      SET product_count = product_count + 1 
      WHERE name = NEW.category;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 12. VÉRIFICATIONS FINALES
-- Vérifier que la table a été créée
SELECT 'Table categories créée avec succès!' as message;

-- Vérifier la structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;

-- Vérifier les politiques RLS
SELECT 
  policyname, 
  cmd, 
  qual
FROM pg_policies 
WHERE tablename = 'categories';

-- Vérifier les données de test
SELECT 
  name,
  description,
  color,
  sort_order,
  product_count,
  is_active
FROM categories
ORDER BY sort_order;

-- Vérifier les statistiques
SELECT * FROM categories_stats;

-- Vérifier le résumé des catégories
SELECT * FROM categories_summary;

-- 13. INSTRUCTIONS D'UTILISATION
-- Pour ajouter une nouvelle catégorie :
-- INSERT INTO categories (name, description, color, sort_order) VALUES ('Nouvelle Catégorie', 'Description', '#FF0000', 7);

-- Pour désactiver une catégorie :
-- UPDATE categories SET is_active = false WHERE name = 'Nom de la catégorie';

-- Pour changer l'ordre :
-- UPDATE categories SET sort_order = 1 WHERE name = 'Nom de la catégorie';

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
