-- Mise à jour de la table premium_requests pour supporter les images et codes
-- Exécutez ce script dans Supabase SQL Editor

-- Ajouter les colonnes manquantes si elles n'existent pas
ALTER TABLE premium_requests 
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS tiktok TEXT,
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS code_used BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS code_used_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Créer un index sur le code pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_premium_requests_code ON premium_requests(code) WHERE code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_premium_requests_phone ON premium_requests(phone);
CREATE INDEX IF NOT EXISTS idx_premium_requests_status ON premium_requests(status);

-- Fonction pour générer un code unique
CREATE OR REPLACE FUNCTION generate_premium_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Générer un code alphanumérique de 8 caractères
    new_code := UPPER(
      SUBSTRING(
        MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) 
        FROM 1 FOR 8
      )
    );
    
    -- Vérifier si le code existe déjà
    SELECT EXISTS(SELECT 1 FROM premium_requests WHERE code = new_code) INTO code_exists;
    
    -- Si le code n'existe pas, on peut l'utiliser
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_premium_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_premium_requests_updated_at ON premium_requests;
CREATE TRIGGER trigger_update_premium_requests_updated_at
  BEFORE UPDATE ON premium_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_premium_requests_updated_at();

