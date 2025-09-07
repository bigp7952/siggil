# Guide de Test Complet - Système SIGGIL avec Supabase

## 🎯 Objectif
Vérifier que tout le site utilise les données réelles de Supabase et que la communication entre admin et utilisateur fonctionne parfaitement.

## 📋 Prérequis
1. Avoir exécuté les scripts SQL dans Supabase :
   - `create-orders-table.sql`
   - `create-products-table.sql`
   - `create-users-table.sql`

2. Avoir les bonnes credentials Supabase dans `src/lib/supabase.ts`

## 🚀 Test 1 : Configuration de la Base de Données

### 1.1 Vérifier les Tables
Dans Supabase Dashboard > SQL Editor, exécuter :
```sql
-- Vérifier les tables existantes
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('orders', 'products', 'users');
```

### 1.2 Vérifier les Données de Test
```sql
-- Vérifier les produits
SELECT product_id, name, category, price, is_active FROM products;

-- Vérifier les commandes
SELECT order_id, user_info->>'firstName' as first_name, total, status FROM orders;

-- Vérifier les utilisateurs
SELECT first_name, last_name, phone_number FROM users;
```

## 🛒 Test 2 : Fonctionnalités Utilisateur

### 2.1 Page d'Accueil
1. Aller sur `/`
2. Vérifier que les "Produits en Vedette" affichent les vrais produits de Supabase
3. Vérifier que les liens vers les produits fonctionnent

### 2.2 Page Produits
1. Aller sur `/produits`
2. Vérifier que tous les produits actifs de Supabase s'affichent
3. Tester les filtres par catégorie
4. Tester la recherche de produits
5. Vérifier que les images s'affichent correctement

### 2.3 Détail Produit
1. Cliquer sur un produit
2. Vérifier que les détails correspondent à la base de données
3. Tester l'ajout au panier
4. Tester l'ajout aux favoris

### 2.4 Panier et Commande
1. Ajouter des produits au panier
2. Aller sur `/panier`
3. Vérifier les produits ajoutés
4. Passer la commande
5. Remplir le formulaire de paiement
6. Valider la commande

### 2.5 Vérification de la Commande
1. Vérifier la page de confirmation
2. Vérifier dans Supabase qu'une nouvelle commande a été créée :
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;
```

## 👨‍💼 Test 3 : Fonctionnalités Admin

### 3.1 Connexion Admin
1. Aller sur `/admin/login`
2. Se connecter avec :
   - Numéro : `221781002253`
   - Mot de passe : `siggilepsixella2025`

### 3.2 Dashboard Admin
1. Vérifier les statistiques réelles :
   - Commandes totales
   - Revenus totaux
   - Nombre de clients
   - Nombre de produits

### 3.3 Gestion des Commandes
1. Aller sur l'onglet "Commandes"
2. Vérifier que les commandes utilisateur apparaissent
3. Tester le changement de statut
4. Vérifier que les changements se reflètent en base

### 3.4 Gestion des Produits
1. Aller sur l'onglet "Produits"
2. Vérifier que tous les produits de Supabase s'affichent
3. Tester l'ajout d'un nouveau produit
4. Vérifier que le produit apparaît sur la page utilisateur
5. Tester la modification d'un produit
6. Tester la suppression d'un produit

## 🔄 Test 4 : Synchronisation Admin-User

### 4.1 Test de Synchronisation Produits
1. **En tant qu'admin** : Ajouter un nouveau produit
2. **En tant qu'utilisateur** : Vérifier que le produit apparaît sur `/produits`
3. **En tant qu'admin** : Modifier le prix d'un produit
4. **En tant qu'utilisateur** : Vérifier que le nouveau prix s'affiche
5. **En tant qu'admin** : Désactiver un produit (`is_active = false`)
6. **En tant qu'utilisateur** : Vérifier que le produit n'apparaît plus

### 4.2 Test de Synchronisation Commandes
1. **En tant qu'utilisateur** : Passer une nouvelle commande
2. **En tant qu'admin** : Vérifier que la commande apparaît dans le dashboard
3. **En tant qu'admin** : Changer le statut de "pending" à "paid"
4. **En tant qu'utilisateur** : Vérifier que le statut est mis à jour

## 📊 Test 5 : Statistiques Réelles

### 5.1 Vérification des Statistiques
Dans le dashboard admin, vérifier que :
- Le nombre de commandes correspond à `SELECT COUNT(*) FROM orders;`
- Le revenu total correspond à `SELECT SUM(total) FROM orders WHERE status IN ('paid', 'shipped', 'delivered');`
- Le nombre de produits correspond à `SELECT COUNT(*) FROM products;`
- Le nombre de clients correspond au nombre d'utilisateurs uniques dans les commandes

### 5.2 Test de Mise à Jour
1. Passer une nouvelle commande en tant qu'utilisateur
2. Vérifier que les statistiques se mettent à jour automatiquement dans l'admin

## 🔍 Test 6 : Fonctionnalités Avancées

### 6.1 Recherche et Filtres
1. Tester la recherche de produits par nom
2. Tester les filtres par catégorie
3. Vérifier que les résultats correspondent à la base de données

### 6.2 Gestion des Images
1. Tester l'upload d'image pour un nouveau produit
2. Vérifier que l'image s'affiche correctement
3. Tester la modification d'image d'un produit existant

### 6.3 Gestion des Stocks
1. Modifier le stock d'un produit en admin
2. Vérifier que l'information se reflète côté utilisateur
3. Tester avec un produit en rupture de stock

## 🐛 Test 7 : Gestion d'Erreurs

### 7.1 Erreurs de Connexion
1. Simuler une perte de connexion Supabase
2. Vérifier que l'application gère gracieusement l'erreur
3. Vérifier que les messages d'erreur sont clairs

### 7.2 Erreurs de Validation
1. Tester l'ajout de produit avec des données invalides
2. Tester la commande avec des informations manquantes
3. Vérifier que les validations fonctionnent

## ✅ Checklist de Validation

### Base de Données
- [ ] Tables `orders`, `products`, `users` existent
- [ ] Données de test sont présentes
- [ ] RLS (Row Level Security) est configuré
- [ ] Indexes sont créés pour les performances

### Fonctionnalités Utilisateur
- [ ] Page d'accueil affiche les vrais produits
- [ ] Page produits fonctionne avec filtres
- [ ] Détail produit affiche les bonnes informations
- [ ] Ajout au panier fonctionne
- [ ] Passage de commande fonctionne
- [ ] Commandes sont sauvegardées en base

### Fonctionnalités Admin
- [ ] Connexion admin fonctionne
- [ ] Dashboard affiche les vraies statistiques
- [ ] Gestion des commandes fonctionne
- [ ] Gestion des produits fonctionne
- [ ] Synchronisation admin-user fonctionne

### Performance et Sécurité
- [ ] Pas d'erreurs dans la console
- [ ] Temps de chargement acceptables
- [ ] Données sensibles sont protégées
- [ ] Validation des données côté client et serveur

## 🎯 Résultat Attendu

**Le système SIGGIL fonctionne maintenant parfaitement avec Supabase !**

- ✅ Toutes les données proviennent de la base de données
- ✅ Communication bidirectionnelle admin-user fonctionnelle
- ✅ Statistiques réelles et à jour
- ✅ Gestion complète des produits et commandes
- ✅ Interface utilisateur réactive et moderne
- ✅ Système robuste et sécurisé

## 🚀 Déploiement

Une fois tous les tests validés, le site est prêt pour la production !

**Commandes de déploiement :**
```bash
npm run build
# Déployer le dossier build sur votre hébergeur
```

**Le site SIGGIL est maintenant entièrement connecté à Supabase et prêt pour les utilisateurs ! 🎉**





