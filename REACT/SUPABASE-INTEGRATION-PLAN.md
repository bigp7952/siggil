# 🚀 Plan d'Intégration Supabase - SIGGIL

## 📋 Vue d'ensemble

Ce document décrit étape par étape ce qui est nécessaire pour lier le site SIGGIL avec Supabase.

---

## ÉTAPE 1 : Configuration Supabase

### Ce dont j'ai besoin de votre part :

1. **URL du projet Supabase**
   - Exemple : `https://xxxxx.supabase.co`

2. **Clé API publique (anon key)**
   - Trouvable dans : Settings → API → Project API keys → anon public

3. **Clé API privée (service_role key)** (optionnel, pour les opérations admin)
   - Trouvable dans : Settings → API → Project API keys → service_role

---

## ÉTAPE 2 : Structure de la Base de Données

### Tables à créer dans Supabase :

#### 1. **users** (Utilisateurs)
```sql
- id (uuid, primary key, default: uuid_generate_v4())
- phone_number (text, unique, not null)
- first_name (text)
- last_name (text)
- address (text)
- city (text)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```

#### 2. **products** (Produits)
```sql
- id (uuid, primary key, default: uuid_generate_v4())
- product_id (text, unique, not null)
- name (text, not null)
- category (text, not null)
- description (text)
- price (numeric, not null)
- original_price (numeric)
- stock (integer, default: 0)
- image_url (text)
- image_data (text) -- base64
- sizes (text[]) -- array de tailles
- colors (text[]) -- array de couleurs
- is_new (boolean, default: false)
- is_active (boolean, default: true)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```

#### 3. **categories** (Catégories)
```sql
- id (uuid, primary key, default: uuid_generate_v4())
- name (text, unique, not null)
- description (text)
- color (text) -- couleur hex
- image_data (text) -- base64
- sort_order (integer, default: 0)
- is_active (boolean, default: true)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```

#### 4. **orders** (Commandes)
```sql
- id (uuid, primary key, default: uuid_generate_v4())
- order_id (text, unique, not null)
- user_id (uuid, foreign key → users.id)
- user_info (jsonb) -- {firstName, lastName, phoneNumber, address, city}
- items (jsonb) -- array d'items
- total (numeric, not null)
- status (text, default: 'pending') -- pending, paid, shipped, delivered, cancelled
- payment_method (text) -- wave, orange_money, etc.
- tracking_info (text)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```

#### 5. **premium_requests** (Demandes Premium)
```sql
- id (uuid, primary key, default: uuid_generate_v4())
- name (text, not null)
- phone (text, not null)
- status (text, default: 'pending') -- pending, approved, rejected
- code (text) -- code premium si approuvé
- created_at (timestamp, default: now())
```

#### 6. **admin_users** (Administrateurs)
```sql
- id (uuid, primary key, default: uuid_generate_v4())
- phone_number (text, unique, not null)
- password_hash (text, not null)
- created_at (timestamp, default: now())
```

---

## ÉTAPE 3 : Politiques RLS (Row Level Security)

### À configurer dans Supabase :

1. **Activer RLS sur toutes les tables**
2. **Politiques pour `products`** :
   - SELECT : Public (tous peuvent lire)
   - INSERT/UPDATE/DELETE : Admin seulement

3. **Politiques pour `orders`** :
   - SELECT : Utilisateur peut voir ses propres commandes + Admin peut voir tout
   - INSERT : Authentifié (utilisateurs peuvent créer leurs commandes)
   - UPDATE : Admin seulement

4. **Politiques pour `users`** :
   - SELECT : Utilisateur peut voir ses propres infos + Admin peut voir tout
   - INSERT : Public (inscription)
   - UPDATE : Utilisateur peut modifier ses propres infos + Admin peut modifier tout

---

## ÉTAPE 4 : Installation des Dépendances

### Packages à installer :

```bash
npm install @supabase/supabase-js
```

---

## ÉTAPE 5 : Configuration

### Fichier `.env` à créer :

```env
REACT_APP_SUPABASE_URL=votre_url_supabase
REACT_APP_SUPABASE_ANON_KEY=votre_cle_anon
REACT_APP_SUPABASE_SERVICE_KEY=votre_cle_service_role (optionnel)
```

---

## ÉTAPE 6 : Migration des Données

### Si vous avez déjà des données dans localStorage :

Je créerai un script de migration pour transférer :
- Produits existants
- Commandes existantes
- Utilisateurs existants
- Demandes premium existantes

---

## 📝 Checklist - Ce que je vais faire :

- [ ] Installer @supabase/supabase-js
- [ ] Créer le fichier de configuration Supabase
- [ ] Créer les services Supabase (products, orders, users, etc.)
- [ ] Migrer ProductContext vers Supabase
- [ ] Migrer AdminContext vers Supabase
- [ ] Migrer AuthContext vers Supabase
- [ ] Migrer PaymentContext vers Supabase
- [ ] Créer un script de migration des données localStorage → Supabase
- [ ] Tester toutes les fonctionnalités

---

## 🎯 Ordre d'implémentation :

1. **Configuration de base** (client Supabase)
2. **Produits** (lecture/écriture)
3. **Utilisateurs** (authentification + CRUD)
4. **Commandes** (création + lecture)
5. **Admin** (gestion complète)
6. **Migration des données existantes**

---

## ⚠️ Important :

Une fois que vous m'aurez fourni :
- L'URL Supabase
- La clé API anon
- La confirmation que les tables sont créées

Je commencerai l'intégration complète !

