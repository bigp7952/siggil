-- Ajouter le champ is_premium à la table products
-- Ce champ permet de marquer les produits comme premium

-- Vérifier si la colonne existe déjà, sinon l'ajouter
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'is_premium'
    ) THEN
        ALTER TABLE products 
        ADD COLUMN is_premium BOOLEAN DEFAULT FALSE NOT NULL;
        
        -- Créer un index pour améliorer les performances des requêtes
        CREATE INDEX idx_products_is_premium ON products(is_premium) WHERE is_premium = TRUE;
        
        RAISE NOTICE 'Colonne is_premium ajoutée avec succès';
    ELSE
        RAISE NOTICE 'La colonne is_premium existe déjà';
    END IF;
END $$;

-- Mettre à jour les types TypeScript dans supabase.ts si nécessaire
-- Le champ is_premium sera disponible dans les requêtes Supabase


