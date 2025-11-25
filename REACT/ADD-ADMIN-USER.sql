-- ============================================
-- SCRIPT SQL POUR AJOUTER L'UTILISATEUR ADMIN
-- À EXÉCUTER DANS SUPABASE SQL EDITOR
-- ============================================

-- Option 1 : Insertion simple (mot de passe en clair)
-- ⚠️ Note: Le code actuel accepte le mot de passe en clair pour compatibilité
-- Pour la production, utilisez l'Option 2 avec bcrypt

INSERT INTO admin_users (phone_number, password_hash)
VALUES ('221781002253', 'siggilepsixella2025')
ON CONFLICT (phone_number) 
DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  created_at = COALESCE(admin_users.created_at, NOW());

-- ============================================
-- Option 2 : Avec hash bcrypt (RECOMMANDÉ pour la production)
-- ============================================
-- 
-- Pour utiliser bcrypt, vous devez d'abord activer l'extension pgcrypto :
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;
--
-- Ensuite, générez un hash bcrypt du mot de passe 'siggilepsixella2025'
-- Vous pouvez utiliser un outil en ligne comme : https://bcrypt-generator.com/
-- Ou utiliser cette fonction SQL (nécessite pgcrypto) :
--
-- INSERT INTO admin_users (phone_number, password_hash)
-- VALUES ('221781002253', crypt('siggilepsixella2025', gen_salt('bf', 10)))
-- ON CONFLICT (phone_number) 
-- DO UPDATE SET 
--   password_hash = EXCLUDED.password_hash,
--   created_at = COALESCE(admin_users.created_at, NOW());
--
-- Pour vérifier le mot de passe avec bcrypt :
-- SELECT * FROM admin_users 
-- WHERE phone_number = '221781002253' 
-- AND password_hash = crypt('siggilepsixella2025', password_hash);

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Vérifier que l'admin a été créé
SELECT 
  id,
  phone_number,
  created_at,
  CASE 
    WHEN password_hash IS NOT NULL THEN '✅ Mot de passe défini'
    ELSE '❌ Mot de passe manquant'
  END as password_status
FROM admin_users
WHERE phone_number = '221781002253';

-- ============================================
-- INFORMATIONS DE CONNEXION ADMIN
-- ============================================
-- Numéro de téléphone : 221781002253
-- Mot de passe : siggilepsixella2025
-- ============================================





