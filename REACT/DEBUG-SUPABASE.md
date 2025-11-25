# 🔍 Guide de Debug Supabase

## ✅ Vérifications à faire

### 1. Vérifier le fichier `.env`

Assurez-vous que le fichier `.env` existe dans le dossier `REACT` avec :

```env
REACT_APP_SUPABASE_URL=https://zkhnngdzqqxzhvxbegxz.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
REACT_APP_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Important** : Après avoir créé/modifié le `.env`, redémarrez le serveur de développement :
```bash
npm start
```

### 2. Vérifier que les tables existent dans Supabase

1. Allez sur https://supabase.com/dashboard/project/zkhnngdzqqxzhvxbegxz
2. Cliquez sur **Table Editor**
3. Vérifiez que ces 6 tables existent :
   - `users`
   - `products`
   - `categories`
   - `orders`
   - `premium_requests`
   - `admin_users`

### 3. Tester la connexion dans la console du navigateur

Ouvrez la console du navigateur (F12) et tapez :

```javascript
// Vérifier si Supabase est chargé
console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);

// Tester une requête simple
import { supabase } from './lib/supabase';
const { data, error } = await supabase.from('products').select('count');
console.log('Test connexion:', error ? '❌ Erreur' : '✅ OK', error || data);
```

### 4. Vérifier les erreurs dans la console

Les logs de debug affichent :
- `🔄 Chargement des produits depuis Supabase...` - Début du chargement
- `✅ Produits chargés: X` - Succès avec nombre de produits
- `❌ Erreur Supabase: ...` - Erreur détaillée
- `⚠️ Tentative de chargement depuis localStorage...` - Fallback activé

### 5. Erreurs courantes et solutions

#### Erreur : "relation 'products' does not exist"
**Solution** : Les tables n'ont pas été créées. Exécutez le script SQL dans Supabase.

#### Erreur : "new row violates row-level security policy"
**Solution** : Les politiques RLS bloquent l'accès. Vérifiez que les politiques sont bien créées dans Supabase.

#### Erreur : "Invalid API key"
**Solution** : Vérifiez que les clés dans `.env` sont correctes et que le serveur a été redémarré.

#### Erreur : "Network request failed"
**Solution** : Vérifiez votre connexion internet et que l'URL Supabase est correcte.

### 6. Mode Fallback

Si Supabase échoue, le système bascule automatiquement vers localStorage pour :
- Charger les produits
- Charger les nouveaux produits
- Filtrer par catégorie

Les logs indiquent quand le fallback est utilisé.

### 7. Vérifier les données dans Supabase

Dans Supabase SQL Editor, exécutez :

```sql
-- Vérifier les produits
SELECT COUNT(*) FROM products;

-- Vérifier les produits actifs
SELECT COUNT(*) FROM products WHERE is_active = true;

-- Voir les dernières commandes
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
```





