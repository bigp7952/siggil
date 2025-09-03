# Guide de Test - Suivi des Commandes Utilisateur

## 🎯 Objectif
Tester la nouvelle fonctionnalité permettant aux utilisateurs de voir et suivre leurs commandes.

## 🚀 Fonctionnalités à Tester

### 1. **Accès à la Page "Mes Commandes"**
- [ ] **Navigation depuis le Header** : Cliquer sur l'avatar utilisateur → "Mes Commandes"
- [ ] **Navigation mobile** : Menu hamburger → "Mes Commandes" (visible uniquement si connecté)
- [ ] **URL directe** : `/mes-commandes` doit fonctionner

### 2. **Affichage des Commandes**
- [ ] **Liste des commandes** : Vérifier que toutes les commandes de l'utilisateur s'affichent
- [ ] **Informations de base** :
  - Numéro de commande
  - Date de création
  - Statut avec couleur appropriée
  - Montant total
- [ ] **Détails de livraison** :
  - Nom complet
  - Téléphone
  - Adresse

### 3. **Statuts des Commandes**
- [ ] **Couleurs des statuts** :
  - `pending` → Jaune (En attente de validation)
  - `confirmed` → Bleu (Commande confirmée)
  - `processing` → Violet (En cours de traitement)
  - `shipped` → Indigo (Commande expédiée)
  - `delivered` → Vert (Commande livrée)
  - `cancelled` → Rouge (Commande annulée)

### 4. **Suivi des Commandes**
- [ ] **Informations de suivi** : Vérifier l'affichage des `tracking_info` si disponibles
- [ ] **Articles commandés** :
  - Image du produit
  - Nom du produit
  - Quantité
  - Prix unitaire et total

### 5. **Gestion des États**
- [ ] **Utilisateur non connecté** : Message "Vous devez être connecté pour voir vos commandes"
- [ ] **Aucune commande** : Message "Aucune commande" avec icône appropriée
- [ ] **Chargement** : Spinner de chargement pendant la récupération des données
- [ ] **Erreur** : Message d'erreur si problème de récupération

### 6. **Fonctionnalités Interactives**
- [ ] **Bouton Actualiser** : Recharge la liste des commandes
- [ ] **Responsive Design** : Vérifier l'affichage sur mobile et desktop

## 🧪 Scénarios de Test

### **Scénario 1 : Utilisateur avec Commandes**
1. Se connecter avec un compte utilisateur
2. Aller sur `/mes-commandes`
3. Vérifier l'affichage de toutes les commandes
4. Vérifier les détails de chaque commande
5. Tester le bouton "Actualiser"

### **Scénario 2 : Utilisateur sans Commandes**
1. Se connecter avec un compte sans commandes
2. Aller sur `/mes-commandes`
3. Vérifier l'affichage du message "Aucune commande"
4. Vérifier l'absence de la liste des commandes

### **Scénario 3 : Utilisateur Non Connecté**
1. Se déconnecter
2. Essayer d'accéder à `/mes-commandes`
3. Vérifier l'affichage du message de connexion requise

### **Scénario 4 : Navigation depuis le Header**
1. Se connecter
2. Cliquer sur l'avatar utilisateur dans le header
3. Vérifier l'apparition du dropdown
4. Cliquer sur "Mes Commandes"
5. Vérifier la redirection vers la page

### **Scénario 5 : Navigation Mobile**
1. Se connecter sur mobile
2. Ouvrir le menu hamburger
3. Vérifier la présence de "Mes Commandes"
4. Cliquer et vérifier la redirection

## 🔍 Points de Vérification Techniques

### **Console Browser**
- [ ] Aucune erreur JavaScript
- [ ] Appels API corrects vers Supabase
- [ ] Gestion des erreurs appropriée

### **Network Tab**
- [ ] Requêtes vers la table `orders` de Supabase
- [ ] Filtrage par `user_id`
- [ ] Tri par `created_at` décroissant

### **Responsive Design**
- [ ] Affichage correct sur desktop (≥768px)
- [ ] Affichage correct sur mobile (<768px)
- [ ] Navigation mobile fonctionnelle

## 🐛 Bugs Potentiels à Surveiller

1. **Affichage des images** : Vérifier que les images des produits s'affichent correctement
2. **Formatage des dates** : Vérifier le format français des dates
3. **Gestion des statuts** : Vérifier que tous les statuts sont gérés
4. **Performance** : Vérifier que le chargement n'est pas trop lent avec beaucoup de commandes
5. **Synchronisation** : Vérifier que les nouvelles commandes apparaissent après actualisation

## ✅ Critères de Validation

La fonctionnalité est considérée comme **fonctionnelle** si :
- [ ] Tous les scénarios de test passent
- [ ] Aucune erreur dans la console
- [ ] L'affichage est cohérent sur tous les appareils
- [ ] La navigation fonctionne correctement
- [ ] Les données sont récupérées et affichées correctement

## 📝 Notes de Test

- **Date de test** : _______________
- **Testeur** : _______________
- **Version** : _______________
- **Observations** : _______________
- **Bugs trouvés** : _______________
- **Statut final** : ✅ Fonctionnel / ❌ Non fonctionnel

