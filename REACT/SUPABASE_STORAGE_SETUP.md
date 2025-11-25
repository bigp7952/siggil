# Configuration Supabase Storage - Buckets Publics

## Problème
Les images ne s'affichent pas car les buckets Supabase Storage ne sont pas configurés comme publics.

## Solution : Configurer les buckets comme publics

### Étape 1 : Rendre les buckets publics

1. Allez dans votre **Supabase Dashboard**
2. Cliquez sur **Storage** dans le menu de gauche
3. Cliquez sur **Buckets**
4. Pour chaque bucket (`categories` et `products`) :
   - Cliquez sur le nom du bucket
   - Dans les **Settings**, trouvez l'option **Public bucket**
   - **Activez** le toggle pour rendre le bucket public
   - Cliquez sur **Save**

### Étape 2 : Configurer les politiques RLS (Row Level Security)

1. Toujours dans **Storage** > **Buckets**
2. Cliquez sur le bucket `categories`
3. Allez dans l'onglet **Policies**
4. Créez une nouvelle politique avec ces paramètres :
   - **Policy name**: `Public Access`
   - **Allowed operation**: `SELECT` (pour lire les fichiers)
   - **Policy definition**: 
     ```sql
     true
     ```
   - Cliquez sur **Save**

5. Répétez pour le bucket `products`

### Étape 3 : Vérifier que les fichiers existent

1. Dans **Storage** > **Buckets** > `categories`
2. Cliquez sur **Files**
3. Vérifiez que vos fichiers images sont bien présents
4. Si un fichier est présent, cliquez dessus pour voir son URL publique

### Alternative : Utiliser des URLs signées (si vous ne voulez pas rendre les buckets publics)

Si vous préférez garder les buckets privés, vous pouvez utiliser des URLs signées qui expirent après un certain temps. Cela nécessite de modifier le code pour générer des URLs signées au lieu d'URLs publiques.

## Vérification

Après avoir configuré les buckets comme publics, testez une URL comme :
```
https://zkhnngdzqqxzhvxbegxz.supabase.co/storage/v1/object/public/categories/t-shirts-1763931605665.png
```

Cette URL devrait maintenant fonctionner et afficher l'image.

