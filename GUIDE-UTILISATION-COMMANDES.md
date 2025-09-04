# 📋 Guide d'Utilisation - Table des Commandes SIGGIL

## 🚀 Installation et Configuration

### 1. Exécuter le Script SQL
1. Allez dans votre **Dashboard Supabase**
2. Cliquez sur **"SQL Editor"** dans le menu de gauche
3. Copiez et exécutez le script `complete-orders-table.sql`
4. Vérifiez que tous les messages de succès s'affichent

### 2. Vérifications Post-Installation
Après l'exécution, vous devriez voir :
- ✅ Table `orders` créée avec succès
- ✅ 3 commandes de test insérées
- ✅ Vues et fonctions créées
- ✅ Politiques RLS configurées

## 🏗️ Structure de la Table

### Champs Principaux
```sql
id              -- ID auto-incrémenté
order_id        -- ID unique de commande (ex: SIGGIL-12345678)
user_id         -- ID de l'utilisateur (UUID, peut être NULL)
user_info       -- Informations client (JSONB)
items           -- Produits commandés (JSONB)
total           -- Montant total
status          -- Statut de la commande
payment_method  -- Méthode de paiement
city            -- Ville de livraison
```

### Champs Additionnels
```sql
delivery_address    -- Adresse de livraison spécifique
delivery_city       -- Ville de livraison spécifique
tracking_info       -- Informations de suivi
notes               -- Notes admin
created_at          -- Date de création
updated_at          -- Date de dernière modification
```

## 📊 Vues Disponibles

### 1. `orders_summary` - Vue Générale
```sql
SELECT * FROM orders_summary;
```
Affiche toutes les commandes avec les informations client formatées.

### 2. `orders_stats` - Statistiques Globales
```sql
SELECT * FROM orders_stats;
```
Donne le nombre total de commandes, revenus, et répartition par statut.

### 3. `orders_by_city` - Commandes par Ville
```sql
SELECT * FROM orders_by_city;
```
Montre la répartition des commandes et revenus par ville.

## 🔧 Fonctions Utiles

### 1. Rechercher les Commandes d'un Client
```sql
SELECT * FROM get_orders_by_phone('771234567');
```
Retourne toutes les commandes d'un numéro de téléphone donné.

### 2. Mettre à Jour le Statut d'une Commande
```sql
SELECT update_order_status(
  'SIGGIL-TEST-001',           -- ID de la commande
  'delivered',                  -- Nouveau statut
  'Livré avec succès',          -- Info de suivi
  'Client très satisfait'       -- Notes admin
);
```

## 📱 Utilisation depuis l'Application

### 1. Créer une Nouvelle Commande
```typescript
const orderData = {
  order_id: `SIGGIL-${Date.now().toString().slice(-8)}`,
  user_id: user?.id || null,
  user_info: {
    firstName: "Moussa",
    lastName: "Diallo", 
    phoneNumber: "771234567",
    address: "Zone A, Secteur 3"
  },
  items: cartItems.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    size: item.size,
    color: item.color
  })),
  total: cartTotal,
  payment_method: 'wave',
  city: 'Dakar',
  delivery_address: 'Zone A, Secteur 3, Dakar',
  delivery_city: 'Dakar'
};
```

### 2. Récupérer les Commandes d'un Utilisateur
```typescript
const userOrders = await supabase
  .from('orders')
  .select('*')
  .eq('user_info->>phoneNumber', phoneNumber)
  .order('created_at', { ascending: false });
```

## 🎯 Statuts de Commande

| Statut | Description | Action Requise |
|--------|-------------|----------------|
| `pending` | En attente | Attendre le paiement |
| `paid` | Payée | Préparer la commande |
| `shipped` | Expédiée | Suivre la livraison |
| `delivered` | Livrée | Confirmer la réception |
| `cancelled` | Annulée | Traiter le remboursement |

## 🔍 Requêtes Utiles pour l'Admin

### 1. Commandes en Attente
```sql
SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at DESC;
```

### 2. Commandes du Jour
```sql
SELECT * FROM orders 
WHERE DATE(created_at) = CURRENT_DATE 
ORDER BY created_at DESC;
```

### 3. Revenus par Période
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as orders_count,
  SUM(total) as daily_revenue
FROM orders 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 4. Top Clients
```sql
SELECT 
  user_info->>'phoneNumber' as phone,
  user_info->>'firstName' as first_name,
  user_info->>'lastName' as last_name,
  COUNT(*) as orders_count,
  SUM(total) as total_spent
FROM orders 
GROUP BY user_info->>'phoneNumber', user_info->>'firstName', user_info->>'lastName'
ORDER BY total_spent DESC
LIMIT 10;
```

## 🚨 Dépannage

### Problème : "Erreur lors de la sauvegarde de la commande"
**Solutions :**
1. Vérifiez que la table `orders` existe
2. Vérifiez les politiques RLS
3. Vérifiez la structure des données JSON
4. Regardez les logs dans la console

### Problème : Commandes non visibles dans le dashboard
**Solutions :**
1. Vérifiez que `loadOrders()` est appelé
2. Vérifiez les politiques RLS
3. Vérifiez la connexion Supabase

### Problème : Erreur de type UUID
**Solutions :**
1. Utilisez le script `complete-orders-table.sql`
2. Vérifiez que `user_id` est bien de type UUID
3. Utilisez `NULL` pour les commandes anonymes

## 📈 Optimisations

### 1. Index de Performance
- `idx_orders_order_id` : Recherche rapide par ID
- `idx_orders_status` : Filtrage par statut
- `idx_orders_created_at` : Tri par date
- `idx_orders_user_info_gin` : Recherche dans les données JSON

### 2. Politiques RLS
- Politiques simples et permissives
- Pas de restrictions complexes qui causent des erreurs
- Sécurité gérée au niveau de l'application

## 🔄 Maintenance

### 1. Nettoyage des Données de Test
```sql
DELETE FROM orders WHERE order_id LIKE 'SIGGIL-TEST-%';
```

### 2. Sauvegarde
```sql
-- Exporter les données
COPY orders TO '/tmp/orders_backup.csv' WITH CSV HEADER;
```

### 3. Mise à Jour des Politiques
```sql
-- Désactiver temporairement RLS si nécessaire
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Réactiver RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console du navigateur
2. Vérifiez les logs Supabase
3. Testez les requêtes SQL directement
4. Utilisez le script simplifié si nécessaire

---

**🎯 Objectif :** Avoir un système de commandes robuste et performant pour SIGGIL E-commerce !
