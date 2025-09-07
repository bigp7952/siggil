# Système d'Authentification SIGGIL

## 🔐 Nouveau Système d'Authentification

Le système d'authentification a été modifié pour reconnaître automatiquement l'administrateur et permettre aux utilisateurs normaux de se connecter avec leur numéro de téléphone.

## 👑 Accès Administrateur

### Numéro Admin Prédéfini
- **Numéro :** `221781002253`
- **Mot de passe :** `siggilepsixella2025`

### Fonctionnement
1. L'utilisateur entre le numéro `221781002253` dans le champ de connexion
2. Le système détecte automatiquement que c'est le numéro admin
3. L'interface passe en "Mode Administrateur" avec un design jaune
4. L'utilisateur doit entrer le mot de passe prédéfini
5. Si le mot de passe est correct, redirection vers `/admin/dashboard`

### Interface Admin
- **Couleur :** Jaune (pour distinguer du mode normal)
- **Message :** "Mode Administrateur - Accès au panneau d'administration"
- **Bouton :** "Accéder au dashboard"
- **Option :** "Retour à la connexion normale"

## 👥 Accès Utilisateur Normal

### Connexion
- Les utilisateurs entrent leur numéro de téléphone
- Le système vérifie si le numéro existe
- Si oui : connexion directe
- Si non : message d'erreur

### Inscription
- Les utilisateurs remplissent le formulaire complet :
  - Prénom
  - Nom
  - Numéro de téléphone
  - Adresse
- Création automatique du compte

## 🎨 Interface Utilisateur

### Mode Normal (Rouge)
- **Couleur :** Rouge SIGGIL
- **Options :** Connexion / Inscription
- **Champs :** Numéro de téléphone + autres selon le mode

### Mode Admin (Jaune)
- **Couleur :** Jaune d'avertissement
- **Champ unique :** Mot de passe administrateur
- **Indicateur visuel :** Icône d'avertissement

## 🔧 Fonctionnalités Techniques

### Détection Automatique
```javascript
// Vérification du numéro admin
if (formData.phoneNumber.replace(/\D/g, '') === ADMIN_PHONE) {
  setIsAdminMode(true);
  return;
}
```

### Gestion des États
- `isAdminMode` : Détermine l'affichage admin/normal
- `adminPassword` : Stocke le mot de passe saisi
- `formData` : Données du formulaire utilisateur

### Sécurité
- Le numéro admin est codé en dur dans l'application
- Le mot de passe admin est vérifié côté client
- Les utilisateurs normaux ne peuvent pas accéder au dashboard admin

## 📱 Expérience Utilisateur

### Pour l'Admin
1. Entrer `221781002253`
2. Interface passe en mode admin (jaune)
3. Entrer `siggilepsixella2025`
4. Accès direct au dashboard

### Pour les Utilisateurs
1. Entrer leur numéro de téléphone
2. Connexion ou inscription selon le cas
3. Accès aux fonctionnalités utilisateur

## 🚀 Avantages

✅ **Simplicité** : Un seul formulaire pour tous les types d'utilisateurs  
✅ **Sécurité** : Détection automatique de l'admin  
✅ **UX** : Interface claire et intuitive  
✅ **Flexibilité** : Possibilité de revenir au mode normal  

## 🔄 Flux de Navigation

```
Page Auth
├── Numéro normal → Connexion/Inscription utilisateur
└── Numéro admin (221781002253) → Mode admin
    └── Mot de passe correct → Dashboard admin
    └── Mot de passe incorrect → Erreur
```

## 📝 Notes de Développement

- Le système utilise le contexte `AuthContext` pour la gestion des états
- Les erreurs sont gérées via `setError` et `clearError`
- L'interface s'adapte dynamiquement selon le mode (admin/normal)
- Les animations Framer Motion sont préservées pour une UX fluide





