# Vérification des Utilisateurs dans Supabase

## 🔍 Comment Vérifier les Utilisateurs

Maintenant que l'authentification est connectée à Supabase, voici comment vérifier les utilisateurs inscrits :

## 📊 Accès au Dashboard Supabase

### 1. Connexion à Supabase
- Allez sur [https://supabase.com](https://supabase.com)
- Connectez-vous à votre compte
- Sélectionnez votre projet SIGGIL

### 2. Accès à la Table Users
- Dans le menu de gauche, cliquez sur **"Table Editor"**
- Sélectionnez la table **"users"**
- Vous verrez tous les utilisateurs inscrits

## 👥 Structure des Données Utilisateur

### Champs de la Table Users
```sql
- id (UUID) - Identifiant unique
- first_name (TEXT) - Prénom
- last_name (TEXT) - Nom
- phone_number (TEXT) - Numéro de téléphone
- address (TEXT) - Adresse
- created_at (TIMESTAMP) - Date de création
- updated_at (TIMESTAMP) - Date de modification
```

### Exemple de Données
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+221 77 123 45 67",
  "address": "Dakar, Sénégal",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## 🔧 Requêtes SQL Utiles

### Voir Tous les Utilisateurs
```sql
SELECT * FROM users ORDER BY created_at DESC;
```

### Compter le Nombre d'Utilisateurs
```sql
SELECT COUNT(*) as total_users FROM users;
```

### Rechercher un Utilisateur par Numéro
```sql
SELECT * FROM users WHERE phone_number = '+221 77 123 45 67';
```

### Utilisateurs Inscrits Aujourd'hui
```sql
SELECT * FROM users 
WHERE DATE(created_at) = CURRENT_DATE;
```

## 🚀 Test de l'Inscription

### Étapes pour Tester
1. **Ouvrez votre application** en local ou en production
2. **Allez sur la page d'inscription** (`/auth`)
3. **Remplissez le formulaire** avec vos informations
4. **Cliquez sur "S'inscrire"**
5. **Vérifiez dans Supabase** que l'utilisateur apparaît

### Messages d'Erreur Possibles
- **"Un compte existe déjà avec ce numéro de téléphone"** : L'utilisateur existe déjà
- **"Erreur lors de l'inscription"** : Problème de connexion à Supabase
- **"Tous les champs sont obligatoires"** : Validation côté client

## 🔐 Test de la Connexion

### Étapes pour Tester
1. **Allez sur la page de connexion** (`/auth`)
2. **Entrez le numéro de téléphone** d'un utilisateur inscrit
3. **Cliquez sur "Se connecter"**
4. **Vérifiez que la connexion fonctionne**

### Messages d'Erreur Possibles
- **"Aucun compte trouvé avec ce numéro de téléphone"** : L'utilisateur n'existe pas
- **"Numéro de téléphone invalide"** : Format incorrect
- **"Erreur lors de la connexion"** : Problème de connexion à Supabase

## 📱 Test de l'Admin

### Étapes pour Tester
1. **Entrez le numéro admin** : `221781002253`
2. **L'interface passe en mode admin** (jaune)
3. **Entrez le mot de passe** : `siggilepsixella2025`
4. **Accès au dashboard admin**

## 🔍 Surveillance en Temps Réel

### Logs Supabase
- Allez dans **"Logs"** dans le menu Supabase
- Surveillez les requêtes SQL en temps réel
- Vérifiez les erreurs éventuelles

### Console du Navigateur
- Ouvrez les **Outils de développement** (F12)
- Allez dans l'onglet **"Console"**
- Surveillez les messages d'erreur

## 🛠️ Dépannage

### Problème : Aucun utilisateur n'apparaît
**Solutions :**
1. Vérifiez que Supabase est bien configuré
2. Vérifiez les logs d'erreur dans la console
3. Testez la connexion à Supabase

### Problème : Erreur de connexion
**Solutions :**
1. Vérifiez les clés Supabase dans `src/lib/supabase.ts`
2. Vérifiez que la table `users` existe
3. Vérifiez les politiques RLS (Row Level Security)

### Problème : Données non sauvegardées
**Solutions :**
1. Vérifiez les permissions de la table `users`
2. Vérifiez que les champs correspondent au schéma
3. Vérifiez les contraintes de la base de données

## 📈 Statistiques

### Requêtes Utiles pour les Statistiques
```sql
-- Nombre d'utilisateurs par jour
SELECT 
  DATE(created_at) as date,
  COUNT(*) as new_users
FROM users 
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Top 10 des utilisateurs récents
SELECT 
  first_name,
  last_name,
  phone_number,
  created_at
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
```

## ✅ Checklist de Vérification

- [ ] La table `users` existe dans Supabase
- [ ] Les politiques RLS permettent l'insertion et la lecture
- [ ] L'inscription fonctionne et sauvegarde les données
- [ ] La connexion fonctionne avec un utilisateur existant
- [ ] Les erreurs sont correctement gérées
- [ ] L'admin peut se connecter avec le numéro spécial

## 🎯 Prochaines Étapes

Une fois que vous avez vérifié que les utilisateurs sont bien sauvegardés dans Supabase, vous pouvez :

1. **Tester toutes les fonctionnalités** de l'application
2. **Vérifier la persistance** des données
3. **Tester en production** sur votre site déployé
4. **Configurer des sauvegardes** automatiques
5. **Mettre en place des alertes** pour les nouveaux utilisateurs




