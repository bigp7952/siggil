# 🔐 Session Admin - Persistance

## ✅ Fonctionnalités implémentées

### Persistance automatique
- ✅ La session admin est **automatiquement sauvegardée** dans `localStorage` lors de la connexion
- ✅ La session est **automatiquement restaurée** au chargement de la page
- ✅ La session **persiste** même après fermeture/ouverture du navigateur
- ✅ La session **ne se déconnecte que** lors d'une déconnexion explicite

### Redirection automatique
- ✅ Si l'admin est déjà connecté et va sur `/admin/login`, il est **automatiquement redirigé** vers `/admin/dashboard`
- ✅ Si l'admin n'est pas connecté et va sur `/admin/dashboard`, il est **automatiquement redirigé** vers `/admin/login`

### Vérification en arrière-plan
- ✅ Vérification silencieuse que l'admin existe toujours dans Supabase
- ✅ En cas d'erreur réseau, la session locale est **conservée** (pas de déconnexion)
- ✅ Seulement déconnexion si l'admin est supprimé de la base de données

## 🔄 Flux de connexion

1. **Connexion** :
   - Admin entre numéro de téléphone + mot de passe
   - Vérification dans Supabase
   - Session sauvegardée dans `localStorage` avec timestamp
   - Redirection vers `/admin/dashboard`

2. **Rechargement de page** :
   - Session restaurée depuis `localStorage` (instantané)
   - Vérification en arrière-plan dans Supabase
   - Session reste active

3. **Navigation** :
   - Si admin connecté → `/admin/login` → redirection vers `/admin/dashboard`
   - Si admin non connecté → `/admin/dashboard` → redirection vers `/admin/login`

4. **Déconnexion** :
   - Clic sur "Déconnexion" dans AdminHeader
   - Session supprimée de `localStorage`
   - Redirection vers `/admin/login`

## 📝 Clé localStorage

- **Admin** : `siggil_admin`

## 🔒 Sécurité

- Vérification périodique que l'admin existe toujours dans Supabase
- En cas de suppression du compte admin, la session est automatiquement invalidée
- Résistance aux erreurs réseau (session conservée)

## ⚠️ Notes

- La session admin **ne expire pas automatiquement**
- La session admin **ne se déconnecte pas** en cas d'erreur réseau temporaire
- La session admin **ne se déconnecte que** lors d'une déconnexion explicite

