-- Script pour créer la table users avec la bonne structure
-- À exécuter dans l'éditeur SQL de Supabase

-- Supprimer la table users si elle existe (attention aux données existantes)
DROP TABLE IF EXISTS users CASCADE;

-- Créer la table users avec la bonne structure
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

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Enable insert for all users" ON users;
DROP POLICY IF EXISTS "Enable select for all users" ON users;
DROP POLICY IF EXISTS "Enable update for all users" ON users;

-- Créer des politiques RLS permissives
CREATE POLICY "Enable insert for all users" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Enable update for all users" ON users
    FOR UPDATE USING (true);

-- Insérer un utilisateur de test
INSERT INTO users (first_name, last_name, phone_number, address)
VALUES ('Test', 'User', '+221 77 999 99 99', 'Test Address')
ON CONFLICT (phone_number) DO NOTHING;

-- Vérifier la structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Vérifier les politiques
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'users';

-- Vérifier les données
SELECT * FROM users;
