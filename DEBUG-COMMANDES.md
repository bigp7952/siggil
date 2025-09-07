# Guide de Débogage - Commandes qui n'apparaissent pas dans l'Admin

## 🔍 Étapes de Diagnostic

### 1. Vérifier le localStorage
Ouvrez la console du navigateur (F12) et tapez :

```javascript
// Vérifier si les commandes existent dans localStorage
console.log('Commandes dans localStorage:', localStorage.getItem('siggil_orders'));

// Vérifier toutes les clés localStorage
console.log('Toutes les clés localStorage:', Object.keys(localStorage));
```

### 2. Vérifier la structure des commandes
Si des commandes existent, vérifiez leur structure :

```javascript
const orders = JSON.parse(localStorage.getItem('siggil_orders') || '[]');
console.log('Structure des commandes:', orders);
console.log('Nombre de commandes:', orders.length);
```

### 3. Vérifier l'AdminContext
Dans la console, vérifiez l'état de l'AdminContext :

```javascript
// Dans la console du navigateur, sur la page admin
console.log('État AdminContext:', window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
```

### 4. Test de création de commande manuelle
Créez une commande de test manuellement :

```javascript
// Créer une commande de test
const testOrder = {
  id: 'SIGGIL-TEST-001',
  userId: 'test-user',
  userInfo: {
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '221771234567',
    address: '123 Test Street'
  },
  items: [
    {
      id: '1',
      name: 'Test Product',
      price: 15000,
      quantity: 1
    }
  ],
  total: 15000,
  status: 'pending',
  paymentMethod: 'wave',
  city: 'Dakar',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Sauvegarder dans localStorage
const existingOrders = JSON.parse(localStorage.getItem('siggil_orders') || '[]');
existingOrders.push(testOrder);
localStorage.setItem('siggil_orders', JSON.stringify(existingOrders));

console.log('Commande de test créée:', testOrder);
```

### 5. Vérifier le PaymentContext
Vérifiez que le PaymentContext sauvegarde correctement :

```javascript
// Dans la console, après avoir passé une commande
console.log('PaymentContext state:', document.querySelector('[data-testid="payment-context"]'));
```

## 🛠️ Solutions Possibles

### Problème 1 : Commandes non sauvegardées
**Symptôme :** `localStorage.getItem('siggil_orders')` retourne `null`

**Solution :**
1. Vérifiez que le PaymentContext fonctionne
2. Vérifiez que `processPayment` est appelé avec les bons paramètres
3. Vérifiez que la sauvegarde localStorage fonctionne

### Problème 2 : Commandes sauvegardées mais non affichées
**Symptôme :** Les commandes existent dans localStorage mais n'apparaissent pas dans l'admin

**Solution :**
1. Vérifiez que `loadOrders()` est appelé
2. Vérifiez que l'AdminContext charge les commandes
3. Utilisez le bouton "Actualiser" dans l'admin

### Problème 3 : Structure de données incorrecte
**Symptôme :** Erreurs dans la console

**Solution :**
1. Vérifiez la structure des commandes
2. Assurez-vous que tous les champs requis sont présents

## 📋 Checklist de Vérification

- [ ] Une commande a été créée avec succès
- [ ] La page de confirmation s'affiche avec "En cours de traitement"
- [ ] `localStorage.getItem('siggil_orders')` contient des données
- [ ] L'admin est connecté
- [ ] La page admin charge sans erreur
- [ ] Le bouton "Actualiser" fonctionne
- [ ] Les commandes apparaissent dans le tableau

## 🔧 Commande de Test Rapide

Exécutez cette commande dans la console pour créer une commande de test :

```javascript
// Créer et sauvegarder une commande de test
const testOrder = {
  id: 'SIGGIL-TEST-' + Date.now(),
  userId: 'test-user',
  userInfo: { firstName: 'Test', lastName: 'User', phoneNumber: '221771234567', address: 'Test Address' },
  items: [{ id: '1', name: 'Test Product', price: 15000, quantity: 1 }],
  total: 15000,
  status: 'pending',
  paymentMethod: 'wave',
  city: 'Dakar',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const orders = JSON.parse(localStorage.getItem('siggil_orders') || '[]');
orders.push(testOrder);
localStorage.setItem('siggil_orders', JSON.stringify(orders));

console.log('✅ Commande de test créée:', testOrder.id);
console.log('📊 Total commandes:', orders.length);
```

Puis rechargez la page admin et vérifiez que la commande apparaît.





