-- Script de vérification et création de la table users
-- À exécuter dans l'éditeur SQL de Supabase

-- Vérifier si la table users existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        -- Créer la table users
        CREATE TABLE users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            phone_number TEXT UNIQUE NOT NULL,
            address TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Créer l'index sur phone_number
        CREATE INDEX idx_users_phone_number ON users(phone_number);

        -- Créer le trigger pour updated_at
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER update_users_updated_at 
            BEFORE UPDATE ON users 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();

        -- Activer RLS
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;

        -- Politiques RLS pour permettre l'insertion et la lecture
        CREATE POLICY "Users can insert their own data" ON users
            FOR INSERT WITH CHECK (true);

        CREATE POLICY "Users can read their own data" ON users
            FOR SELECT USING (true);

        CREATE POLICY "Users can update their own data" ON users
            FOR UPDATE USING (true);

        RAISE NOTICE 'Table users créée avec succès';
    ELSE
        RAISE NOTICE 'Table users existe déjà';
    END IF;
END $$;

-- Vérifier la structure de la table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Vérifier les politiques RLS
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
WHERE tablename = 'users';

-- Insérer un utilisateur de test (optionnel)
INSERT INTO users (first_name, last_name, phone_number, address)
VALUES ('Test', 'User', '+221 77 999 99 99', 'Test Address')
ON CONFLICT (phone_number) DO NOTHING;

-- Vérifier les données
SELECT * FROM users;
