# 🔧 Dépannage - Erreur d'Inscription

## 🚨 Problème Signalé
"Erreur lors de l'inscription" lors de la création d'un compte utilisateur.

## 🔍 Étapes de Diagnostic

### 1. Test de Connexion Supabase
Allez sur `/test-supabase` dans votre application pour diagnostiquer le problème.

### 2. Vérification de la Base de Données

#### A. Exécuter le Script de Vérification
1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous à votre projet SIGGIL
3. Cliquez sur **"SQL Editor"** dans le menu
4. Copiez et exécutez le contenu de `setup-database.sql`

#### B. Vérifier la Table Users
```sql
-- Vérifier si la table existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'users'
);

-- Vérifier la structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';
```

#### C. Vérifier les Politiques RLS
```sql
-- Vérifier les politiques
SELECT policyname, cmd, permissive 
FROM pg_policies 
WHERE tablename = 'users';
```

### 3. Vérification de la Configuration

#### A. Clés Supabase
Vérifiez dans `src/lib/supabase.ts` :
```typescript
const supabaseUrl = 'https://qibvvvbneqhsmuxrlfyg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

#### B. Console du Navigateur
1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet "Console"
3. Essayez de vous inscrire
4. Notez les erreurs exactes

## 🛠️ Solutions Possibles

### Solution 1: Table Users Manquante
**Symptôme :** Erreur "relation 'users' does not exist"

**Solution :**
1. Exécutez le script `setup-database.sql` dans Supabase
2. Vérifiez que la table a été créée

### Solution 2: Politiques RLS Trop Restrictives
**Symptôme :** Erreur de permission

**Solution :**
```sql
-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- Créer des politiques plus permissives
CREATE POLICY "Enable insert for all users" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Enable update for all users" ON users
    FOR UPDATE USING (true);
```

### Solution 3: Problème de Format de Données
**Symptôme :** Erreur de validation

**Solution :**
Vérifiez que les données envoyées correspondent au schéma :
```typescript
{
  first_name: string,    // Requis
  last_name: string,     // Requis
  phone_number: string,  // Requis, unique
  address: string        // Requis
}
```

### Solution 4: Problème de Connexion
**Symptôme :** Erreur réseau ou timeout

**Solution :**
1. Vérifiez votre connexion internet
2. Vérifiez que Supabase est accessible
3. Testez avec l'outil de test intégré

## 🧪 Test de Diagnostic

### Utilisez la Page de Test
1. Allez sur `http://localhost:3000/test-supabase`
2. Cliquez sur "Tester la Connexion"
3. Vérifiez les résultats dans la console
4. Testez l'inscription avec des données valides

### Test Manuel dans Supabase
```sql
-- Test d'insertion manuel
INSERT INTO users (first_name, last_name, phone_number, address)
VALUES ('Test', 'User', '+221 77 888 88 88', 'Test Address')
RETURNING *;

-- Vérifier l'insertion
SELECT * FROM users WHERE phone_number = '+221 77 888 88 88';
```

## 📋 Checklist de Vérification

- [ ] La table `users` existe dans Supabase
- [ ] Les politiques RLS permettent l'insertion
- [ ] Les clés Supabase sont correctes
- [ ] La connexion internet fonctionne
- [ ] Aucune erreur dans la console du navigateur
- [ ] Le format des données est correct

## 🆘 Si le Problème Persiste

### 1. Collecter les Informations
- Capturez d'écran de l'erreur
- Copiez les logs de la console
- Notez les étapes exactes pour reproduire

### 2. Vérifier les Logs Supabase
1. Allez dans **"Logs"** dans Supabase
2. Surveillez les requêtes en temps réel
3. Identifiez les erreurs spécifiques

### 3. Test de Connexion Simple
```typescript
// Test simple dans la console du navigateur
import { supabase } from './src/lib/supabase.ts';

// Test de connexion
const { data, error } = await supabase
  .from('users')
  .select('count')
  .limit(1);

console.log('Data:', data);
console.log('Error:', error);
```

## 🎯 Prochaines Étapes

Une fois le problème résolu :
1. Testez l'inscription avec différents numéros
2. Vérifiez que les utilisateurs apparaissent dans Supabase
3. Testez la connexion avec les utilisateurs créés
4. Supprimez la page de test (`/test-supabase`) en production


