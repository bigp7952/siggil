# Configuration du champ `is_premium` dans Supabase

## 📋 Instructions

Pour activer la fonctionnalité des produits premium, vous devez exécuter le script SQL dans votre base de données Supabase.

### Étape 1 : Accéder au SQL Editor de Supabase

1. Connectez-vous à votre projet Supabase : https://supabase.com
2. Sélectionnez votre projet
3. Dans le menu de gauche, cliquez sur **SQL Editor**

### Étape 2 : Exécuter le script SQL

1. Cliquez sur **New Query** (Nouvelle requête)
2. Ouvrez le fichier `ADD_PREMIUM_FIELD.sql` dans votre éditeur
3. Copiez tout le contenu du fichier
4. Collez-le dans l'éditeur SQL de Supabase
5. Cliquez sur **Run** (Exécuter) ou appuyez sur `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### Étape 3 : Vérifier que la colonne a été ajoutée

Pour vérifier que la colonne `is_premium` a bien été ajoutée, exécutez cette requête :

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'products' 
AND column_name = 'is_premium';
```

Vous devriez voir :
- `column_name`: `is_premium`
- `data_type`: `boolean`
- `column_default`: `false`

### Étape 4 : Vérifier les produits existants

Pour voir les produits et leur statut premium :

```sql
SELECT id, product_id, name, is_premium, is_active
FROM products
ORDER BY created_at DESC
LIMIT 10;
```

## ✅ Résultat attendu

Après l'exécution du script :
- ✅ La colonne `is_premium` est ajoutée à la table `products`
- ✅ Tous les produits existants ont `is_premium = false` par défaut
- ✅ Un index est créé pour améliorer les performances des requêtes
- ✅ Vous pouvez maintenant créer des produits premium depuis l'interface admin

## 🔧 Dépannage

### Erreur : "column already exists"
Si vous voyez cette erreur, c'est que la colonne existe déjà. C'est normal, le script est idempotent (peut être exécuté plusieurs fois sans problème).

### Erreur : "permission denied"
Assurez-vous d'être connecté en tant qu'administrateur du projet Supabase.

## 📝 Notes

- Le script est **idempotent** : vous pouvez l'exécuter plusieurs fois sans problème
- Les produits existants auront `is_premium = false` par défaut
- Vous pouvez modifier manuellement le statut premium d'un produit existant via SQL si nécessaire

## 🎯 Prochaines étapes

Une fois le script exécuté :
1. Rechargez votre application React
2. Allez dans `/admin/premium-products`
3. Créez un nouveau produit premium en cochant "Produit Premium"
4. Le produit apparaîtra uniquement dans l'onglet "Produits Premium"


