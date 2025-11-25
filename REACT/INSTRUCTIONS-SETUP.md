# 📋 Instructions de Configuration Supabase

## ✅ Ce qui a été fait

1. ✅ Package `@supabase/supabase-js` installé
2. ✅ Client Supabase créé (`src/lib/supabase.ts`)
3. ✅ Script SQL créé (`SUPABASE-SETUP.sql`)
4. ✅ ProductContext migré vers Supabase

---

## 🔧 À FAIRE MAINTENANT

### ÉTAPE 1 : Créer le fichier `.env`

Créez un fichier `.env` à la racine du dossier `REACT` avec ce contenu :

```env
REACT_APP_SUPABASE_URL=https://zkhnngdzqqxzhvxbegxz.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpraG5uZ2R6cXF4emh2eGJlZ3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NDU5NjcsImV4cCI6MjA3OTQyMTk2N30.nc7-C0TAQDHacxiTF4orML_Fn7q7_7f9mVZQZtUSiJ8
REACT_APP_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpraG5uZ2R6cXF4emh2eGJlZ3h6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzg0NTk2NywiZXhwIjoyMDc5NDIxOTY3fQ.XWfXKc060JqWx_A1Miy4pI8d7vsdd6ALROi9Ex0UH-U
```

### ÉTAPE 2 : Exécuter le script SQL dans Supabase

1. Allez sur votre dashboard Supabase : https://supabase.com/dashboard/project/zkhnngdzqqxzhvxbegxz
2. Cliquez sur **SQL Editor** dans le menu de gauche
3. Cliquez sur **New Query**
4. Copiez tout le contenu du fichier `SUPABASE-SETUP.sql`
5. Collez-le dans l'éditeur SQL
6. Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)

⚠️ **Important** : Le script va créer toutes les tables nécessaires avec les politiques RLS.

### ÉTAPE 3 : Vérifier les tables créées

1. Dans Supabase, allez dans **Table Editor**
2. Vous devriez voir ces 6 tables :
   - `users`
   - `products`
   - `categories`
   - `orders`
   - `premium_requests`
   - `admin_users`

---

## 🚀 Prochaines étapes

Une fois les tables créées, dites-moi et je continuerai avec :
- Migration de AuthContext
- Migration de AdminContext
- Migration de PaymentContext
- Script de migration des données localStorage → Supabase

---

## ⚠️ Note importante

Les politiques RLS dans le script SQL sont basiques. Une fois que tout fonctionne, on pourra les affiner selon vos besoins de sécurité.





