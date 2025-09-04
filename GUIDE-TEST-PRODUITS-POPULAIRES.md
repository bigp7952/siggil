# Guide de Test - Produits Populaires

## Objectif
Tester le système de produits en vedette basé sur les produits les plus commandés.

## Prérequis
1. Avoir exécuté le script SQL `fix-popular-products-final.sql` dans Supabase
2. Avoir des produits dans la table `products`
3. Avoir des commandes dans la table `orders` (optionnel pour le test)

## Étapes de Test

### 1. Exécuter le Script SQL
```sql
-- Exécuter dans Supabase SQL Editor
-- Le script fix-popular-products-final.sql
```

### 2. Vérifier la Vue
```sql
-- Vérifier que la vue fonctionne
SELECT * FROM popular_products LIMIT 5;
```

### 3. Tester la Fonction
```sql
-- Tester la fonction avec 3 produits
SELECT * FROM get_popular_products(3);

-- Tester avec 8 produits (par défaut)
SELECT * FROM get_popular_products();
```

### 4. Vérifier les Types
```sql
-- Vérifier la structure de la vue
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'popular_products' 
ORDER BY ordinal_position;
```

### 5. Tester l'Interface
1. Aller sur la page d'accueil
2. Vérifier que la section "Produits en Vedette" s'affiche
3. Vérifier que les produits sont chargés
4. Vérifier que les statistiques de popularité s'affichent

## Résultats Attendus

### ✅ Succès
- La vue `popular_products` se crée sans erreur
- La fonction `get_popular_products()` retourne des données
- L'interface affiche les produits avec leurs statistiques
- Les badges de popularité s'affichent (📦 X commandes, 🔥 Populaire)

### ❌ Problèmes Possibles
- Erreur de types lors de la création de la vue
- Erreur lors de l'appel de la fonction
- Interface qui ne charge pas les produits
- Statistiques qui ne s'affichent pas

## Données de Test (Optionnel)

Si vous voulez tester avec des données réelles :

```sql
-- Insérer des commandes de test
INSERT INTO orders (order_id, user_id, user_info, items, total, status, payment_method, city, delivery_address, delivery_city) 
VALUES 
('TEST-001', NULL, '{"firstName": "Test", "lastName": "User"}', 
 '[{"id": "prod1", "name": "T-shirt SIGGIL", "price": 5000, "quantity": 2}]', 
 10000, 'delivered', 'cash', 'Dakar', 'Test Address', 'Dakar'),
('TEST-002', NULL, '{"firstName": "Test2", "lastName": "User2"}', 
 '[{"id": "prod1", "name": "T-shirt SIGGIL", "price": 5000, "quantity": 1}]', 
 5000, 'delivered', 'cash', 'Dakar', 'Test Address 2', 'Dakar');
```

## Vérifications Console

Dans la console du navigateur, vous devriez voir :
```
🔄 Récupération des produits populaires...
✅ Produits populaires récupérés: X
```

## Fallback

Si la fonction SQL échoue, le système utilise un fallback :
- Récupère les produits actifs les plus récents
- Affiche des statistiques à 0 (pas de commandes)

## Dépannage

### Erreur de Types
- Vérifier que tous les types correspondent entre la vue et la fonction
- Utiliser des conversions de types explicites (::TEXT, ::JSONB, etc.)

### Erreur de Vue
- Vérifier que la table `products` existe et a la bonne structure
- Vérifier que la table `orders` existe

### Erreur de Fonction
- Vérifier que la fonction est créée avec les bons types de retour
- Vérifier que la vue est accessible depuis la fonction

## Succès
Une fois que tout fonctionne, vous devriez voir :
- Des produits en vedette basés sur leur popularité réelle
- Des statistiques de commandes affichées
- Un système dynamique qui s'adapte aux commandes des utilisateurs
