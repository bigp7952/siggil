# 🔐 Persistance des Sessions

## ✅ Fonctionnalités implémentées

### Session Utilisateur (AuthContext)

- ✅ **Persistance automatique** : La session est sauvegardée dans `localStorage` lors de la connexion/inscription
- ✅ **Restauration au démarrage** : La session est automatiquement restaurée au chargement de la page
- ✅ **Vérification en arrière-plan** : Vérification silencieuse que l'utilisateur existe toujours dans Supabase
- ✅ **Résistance aux erreurs réseau** : En cas d'erreur réseau, la session locale est conservée (ne se déconnecte pas)
- ✅ **Déconnexion explicite uniquement** : La session ne se déconnecte que lors d'un appel à `logout()`

### Session Admin (AdminContext)

- ✅ **Persistance automatique** : La session admin est sauvegardée dans `localStorage` lors de la connexion
- ✅ **Restauration au démarrage** : La session admin est automatiquement restaurée au chargement de la page
- ✅ **Vérification en arrière-plan** : Vérification silencieuse que l'admin existe toujours dans Supabase
- ✅ **Résistance aux erreurs réseau** : En cas d'erreur réseau, la session locale est conservée
- ✅ **Déconnexion explicite uniquement** : La session ne se déconnecte que lors d'un appel à `adminLogout()`

## 🔄 Comportement

### Connexion
1. L'utilisateur/admin se connecte
2. Les données sont sauvegardées dans `localStorage` avec un timestamp
3. La session est immédiatement active

### Rechargement de page
1. Au chargement, la session est restaurée depuis `localStorage`
2. Vérification en arrière-plan dans Supabase (non bloquante)
3. Si l'utilisateur/admin existe toujours, la session reste active
4. Si erreur réseau, la session locale est conservée

### Déconnexion
1. Appel explicite à `logout()` ou `adminLogout()`
2. Suppression de la session dans `localStorage`
3. État utilisateur/admin remis à `null`

## 📝 Clés localStorage

- **Utilisateur** : `siggil_user`
- **Admin** : `siggil_admin`

## ⚠️ Notes importantes

- Les sessions **ne expirent pas automatiquement**
- Les sessions **ne se déconnectent pas** en cas d'erreur réseau temporaire
- Les sessions **ne se déconnectent que** lors d'une déconnexion explicite
- Les données sont vérifiées en arrière-plan pour s'assurer qu'elles sont à jour

## 🔒 Sécurité

- Les sessions sont stockées localement (localStorage)
- Vérification périodique que l'utilisateur/admin existe toujours dans Supabase
- En cas de suppression du compte, la session est automatiquement invalidée





