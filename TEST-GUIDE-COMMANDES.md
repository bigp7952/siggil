# Guide de Test - Système de Commandes SIGGIL

## 🎯 Objectif
Vérifier que le système de commandes fonctionne correctement de bout en bout :
1. Ajout au panier
2. Likes/Favoris
3. Validation de paiement
4. Affichage des commandes dans l'admin
5. Gestion des statuts de commande

## 📋 Tests à Effectuer

### 1. Test d'Ajout au Panier
- [ ] Aller sur la page `/produits`
- [ ] Cliquer sur "Ajouter au panier" sur un produit
- [ ] Vérifier que le produit apparaît dans le panier
- [ ] Vérifier que le compteur du panier se met à jour

### 2. Test des Likes/Favoris
- [ ] Aller sur la page `/produits`
- [ ] Cliquer sur l'icône cœur d'un produit
- [ ] Vérifier que le cœur devient rouge (favori)
- [ ] Recharger la page et vérifier que le favori persiste
- [ ] Cliquer à nouveau pour retirer des favoris

### 3. Test de Création de Commande
- [ ] Ajouter des produits au panier
- [ ] Aller sur `/panier`
- [ ] Cliquer sur "Passer la commande"
- [ ] Remplir le formulaire de livraison
- [ ] Sélectionner un mode de paiement
- [ ] Cliquer sur "Valider le paiement"
- [ ] Vérifier que la page de confirmation s'affiche avec "En cours de traitement"

### 4. Test Admin - Affichage des Commandes
- [ ] Se connecter en tant qu'admin avec :
  - Numéro : `221781002253`
  - Mot de passe : `siggilepsixella2025`
- [ ] Aller sur `/admin/dashboard`
- [ ] Vérifier que les nouvelles commandes apparaissent dans l'onglet "Commandes"
- [ ] Vérifier que le statut est "En cours de traitement"

### 5. Test Admin - Gestion des Statuts
- [ ] Dans le dashboard admin, aller sur l'onglet "Commandes"
- [ ] Cliquer sur "Modifier le statut" pour une commande
- [ ] Changer le statut de "En cours de traitement" à "En préparation"
- [ ] Vérifier que le changement est sauvegardé
- [ ] Recharger la page et vérifier que le changement persiste

### 6. Test d'Ajout de Produit
- [ ] Dans le dashboard admin, cliquer sur "Ajouter un produit"
- [ ] Remplir tous les champs :
  - Nom du produit
  - Catégorie
  - Prix
  - Stock
  - Uploader une image
  - Sélectionner des tailles
  - Sélectionner des couleurs
- [ ] Cliquer sur "Ajouter le produit"
- [ ] Vérifier que le produit apparaît dans la liste des produits admin
- [ ] Aller sur `/produits` et vérifier que le nouveau produit apparaît

## 🔧 Correction des Problèmes

### Problème : "Commande introuvable"
**Solution :** Vérifier que le PaymentContext sauvegarde correctement les commandes dans `localStorage` avec la clé `siggil_orders`.

### Problème : Images qui ne s'affichent pas
**Solution :** 
1. Vérifier que les variables `imageFile` et `editImageFile` sont bien déclarées
2. Vérifier que l'upload d'image fonctionne avec FileReader
3. Vérifier que l'image est sauvegardée en base64

### Problème : Commandes qui n'apparaissent pas dans l'admin
**Solution :** Vérifier que l'AdminContext charge les commandes depuis `siggil_orders` et non `siggil_admin_orders`.

## 📊 Données de Test

### Produit de Test
```json
{
  "name": "Test Product",
  "category": "T-shirts",
  "price": 15000,
  "originalPrice": 20000,
  "stock": 10,
  "image": "data:image/jpeg;base64,...",
  "sizes": ["S", "M", "L"],
  "colors": ["noir", "blanc"],
  "isNew": true,
  "isActive": true
}
```

### Commande de Test
```json
{
  "id": "SIGGIL-12345678",
  "userId": "user123",
  "userInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "221771234567",
    "address": "123 Rue Test, Dakar"
  },
  "items": [...],
  "total": 15000,
  "status": "pending",
  "paymentMethod": "wave",
  "city": "Dakar",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## ✅ Checklist de Validation

- [ ] Ajout au panier fonctionne
- [ ] Likes/favoris fonctionnent et persistent
- [ ] Validation de paiement crée une commande
- [ ] Page de confirmation affiche "En cours de traitement"
- [ ] Commandes apparaissent dans l'admin
- [ ] Gestion des statuts fonctionne
- [ ] Ajout de produits fonctionne
- [ ] Nouveaux produits apparaissent sur la page produits
- [ ] Upload d'images fonctionne

## 🚀 Déploiement

Une fois tous les tests validés :
1. `npm run build`
2. Déployer le dossier `build` sur Netlify
3. Vérifier que tout fonctionne en production


