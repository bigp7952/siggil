# Guide - Système de Commandes avec Supabase

## 🎯 Objectif
Tester le nouveau système de commandes qui utilise Supabase comme base de données au lieu du localStorage.

## 📋 Étapes de Configuration

### 1. Créer la table des commandes dans Supabase
1. Allez sur votre dashboard Supabase
2. Ouvrez l'éditeur SQL
3. Copiez et exécutez le contenu du fichier `create-orders-table.sql`
4. Vérifiez que la table `orders` a été créée avec les données de test

### 2. Vérifier la connexion Supabase
Le fichier `src/lib/supabase.ts` doit contenir les bonnes credentials :
```typescript
const supabaseUrl = 'https://qibvvvbneqhsmuxrlfyg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYnZ2dmJuZXFoc211eHJsZnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NDQ5NDUsImV4cCI6MjA3MjIyMDQ0NX0.CaZfiurdUVBFRKna4zFb8mpjP-0EqHGNjBAwFyYhed8';
```

## 🧪 Tests à Effectuer

### Test 1 : Création de Commande
1. **Ajouter des produits au panier** sur la page `/produits`
2. **Aller sur `/panier`** et cliquer sur "Passer la commande"
3. **Remplir le formulaire** de livraison avec :
   - Prénom : Test
   - Nom : User
   - Téléphone : 221771234567
   - Adresse : 123 Rue Test, Dakar
   - Ville : Dakar
4. **Sélectionner un mode de paiement** (Wave, Orange Money, ou Paiement à la livraison)
5. **Cliquer sur "Valider le paiement"**
6. **Vérifier** que la page de confirmation s'affiche avec "En cours de traitement"

### Test 2 : Vérification dans Supabase
1. **Aller sur le dashboard Supabase**
2. **Ouvrir la table `orders`**
3. **Vérifier** qu'une nouvelle ligne a été ajoutée avec :
   - `order_id` : SIGGIL-XXXXXXXX
   - `user_info` : JSON avec les informations utilisateur
   - `items` : JSON avec les produits commandés
   - `total` : Montant total
   - `status` : "pending"
   - `payment_method` : Méthode sélectionnée

### Test 3 : Affichage dans l'Admin
1. **Se connecter en tant qu'admin** :
   - Numéro : `221781002253`
   - Mot de passe : `siggilepsixella2025`
2. **Aller sur `/admin/dashboard`**
3. **Vérifier** que la nouvelle commande apparaît dans l'onglet "Commandes"
4. **Vérifier** que le statut est "En cours de traitement"
5. **Cliquer sur "Actualiser"** pour recharger les données

### Test 4 : Gestion des Statuts
1. **Dans l'admin**, aller sur l'onglet "Commandes"
2. **Modifier le statut** d'une commande de "En cours de traitement" à "En préparation"
3. **Vérifier** que le changement est sauvegardé
4. **Recharger la page** et vérifier que le changement persiste
5. **Vérifier dans Supabase** que le statut a été mis à jour

### Test 5 : Statistiques
1. **Dans l'admin**, vérifier que les statistiques se mettent à jour :
   - Nombre total de commandes
   - Revenus totaux
   - Commandes en attente
   - Nombre de clients

## 🔧 Débogage

### Problème : Commandes non créées dans Supabase
**Vérifications :**
1. Console du navigateur pour les erreurs
2. Vérifier que `createOrder` est appelé
3. Vérifier les permissions RLS dans Supabase

### Problème : Commandes non affichées dans l'admin
**Vérifications :**
1. Vérifier que `getAllOrders` fonctionne
2. Vérifier la connexion Supabase
3. Utiliser le bouton "Actualiser"

### Problème : Erreurs de connexion
**Vérifications :**
1. Credentials Supabase corrects
2. Table `orders` créée
3. Politiques RLS configurées

## 📊 Données de Test

### Commande de Test dans Supabase
```sql
INSERT INTO orders (order_id, user_id, user_info, items, total, status, payment_method, city) VALUES
(
  'SIGGIL-TEST-001',
  'test-user',
  '{"firstName": "Test", "lastName": "User", "phoneNumber": "221771234567", "address": "123 Rue Test, Dakar"}',
  '[{"id": "1", "name": "SIGGIL Classic T-Shirt", "price": 19500, "quantity": 1, "size": "M", "color": "noir"}]',
  19500,
  'pending',
  'wave',
  'Dakar'
);
```

## ✅ Checklist de Validation

- [ ] Table `orders` créée dans Supabase
- [ ] Données de test insérées
- [ ] Création de commande fonctionne
- [ ] Commande apparaît dans Supabase
- [ ] Admin peut voir les commandes
- [ ] Gestion des statuts fonctionne
- [ ] Statistiques se mettent à jour
- [ ] Page de confirmation affiche les bonnes données
- [ ] Bouton "Actualiser" fonctionne

## 🚀 Avantages du Nouveau Système

1. **Persistance des données** : Les commandes sont sauvegardées en base
2. **Synchronisation** : Tous les utilisateurs voient les mêmes données
3. **Sécurité** : Contrôle d'accès via RLS
4. **Scalabilité** : Support de nombreuses commandes
5. **Backup automatique** : Supabase gère les sauvegardes
6. **API REST** : Accès programmatique aux données

## 🔄 Migration depuis localStorage

Le système migre automatiquement :
- Les nouvelles commandes vont dans Supabase
- L'admin charge depuis Supabase
- Plus de dépendance au localStorage pour les commandes

**Le système de commandes est maintenant entièrement basé sur Supabase ! 🎉**


