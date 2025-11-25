# Configuration du Système Premium

## ✅ Ce qui a été implémenté

Un système complet de gestion des demandes premium avec :

1. **Upload d'images** : Les utilisateurs peuvent uploader jusqu'à 6 images de preuves
2. **Visualisation admin** : L'admin peut voir toutes les images dans un modal avec zoom
3. **Génération de code unique** : Code alphanumérique unique généré automatiquement
4. **Validation de code** : Les utilisateurs peuvent entrer leur code pour activer l'accès
5. **Invalidation automatique** : Le code est invalidé après une commande premium
6. **Design responsive** : Interface optimisée pour mobile et desktop

## 🔧 Configuration requise

### Étape 1 : Mettre à jour la table premium_requests

Exécutez le script SQL dans Supabase SQL Editor :

```sql
-- Voir le fichier UPDATE_PREMIUM_REQUESTS_TABLE.sql
```

Ce script ajoute :
- `instagram` : Compte Instagram
- `tiktok` : Compte TikTok
- `images` : Tableau JSONB des URLs d'images
- `code_used` : Boolean indiquant si le code a été utilisé
- `code_used_at` : Timestamp d'utilisation
- `updated_at` : Timestamp de mise à jour

### Étape 2 : Créer le bucket Storage (optionnel)

Si vous voulez un bucket dédié pour les preuves premium :

1. Allez dans Supabase Dashboard > Storage
2. Créez un nouveau bucket nommé `premium-proofs`
3. Rendez-le **public** (ou configurez les politiques RLS)
4. Mettez à jour `REACT/src/services/premiumService.ts` :
   ```typescript
   const PREMIUM_BUCKET = 'premium-proofs';
   ```

**Note** : Par défaut, le système utilise le bucket `products`. C'est fonctionnel mais moins organisé.

### Étape 3 : Configurer les politiques RLS pour Storage

Si vous créez un bucket dédié, ajoutez ces politiques :

```sql
-- Permettre l'upload des preuves
CREATE POLICY "Allow public uploads for premium proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'premium-proofs');

-- Permettre la lecture publique des preuves
CREATE POLICY "Allow public reads for premium proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'premium-proofs');
```

## 📱 Fonctionnalités

### Côté Utilisateur

1. **Demande d'accès** :
   - Formulaire avec nom, téléphone, Instagram, TikTok
   - Upload de 6 images de preuves
   - Soumission de la demande

2. **Après soumission** :
   - Message de confirmation
   - Champ pour entrer le code (si déjà reçu)
   - Explication claire du processus

3. **Activation du code** :
   - Entrée du code reçu par WhatsApp
   - Vérification automatique
   - Activation de l'accès premium

4. **Après commande premium** :
   - Le code est automatiquement invalidé
   - L'accès premium est révoqué
   - Nouvelle demande nécessaire pour réactiver

### Côté Admin

1. **Visualisation des demandes** :
   - Vue en grille (cards) avec aperçu des images
   - Statut visible (en attente, approuvée, rejetée)
   - Code généré affiché si approuvée

2. **Modal de détail** :
   - Toutes les informations du demandeur
   - Galerie d'images avec zoom
   - Actions d'approbation/rejet

3. **Génération de code** :
   - Code unique généré automatiquement
   - Format : `SIGGIL-XXXXXX` (6 caractères alphanumériques)
   - Vérification d'unicité

## 🎨 Design

- **Composants compacts** : Tailles réduites pour mobile
- **Responsive** : Adaptation automatique desktop/mobile
- **Animations** : Transitions fluides avec Framer Motion
- **Couleurs** : Cohérence avec le design system SIGGIL

## 🔍 Dépannage

### Les images ne s'affichent pas

1. Vérifiez que le bucket Storage existe
2. Vérifiez les politiques RLS du bucket
3. Vérifiez que les URLs sont correctement sauvegardées dans `images` (JSONB)

### Le code n'est pas généré

1. Vérifiez les logs de la console
2. Vérifiez que la fonction `generate_premium_code()` existe dans Supabase
3. Vérifiez que la colonne `code` existe dans la table

### Le code ne se valide pas

1. Vérifiez que le numéro de téléphone correspond exactement
2. Vérifiez que le code n'a pas déjà été utilisé
3. Vérifiez que le statut de la demande est "approved"

## 📝 Notes importantes

- **Un code = une commande** : Après une commande premium, le code est invalidé
- **Nouvelle demande requise** : Pour réactiver l'accès, il faut refaire une demande
- **Codes uniques** : Chaque code est unique et lié à un numéro de téléphone
- **Images stockées** : Les images sont stockées dans Supabase Storage avec URLs publiques


