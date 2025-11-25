# Debug des images produits

## Problème
Les images des produits ne s'affichent pas depuis Supabase Storage.

## Structure des fichiers dans le bucket
Les fichiers sont organisés comme suit :
- `temp-1763933025036/temp-1763933025036-1763933025036.png`

## URL attendue
L'URL complète devrait être :
```
https://zkhnngdzqqxzhvxbegxz.supabase.co/storage/v1/object/public/products/temp-1763933025036/temp-1763933025036-1763933025036.png
```

## Vérifications à faire

1. **Vérifier que le bucket est public** :
   - Supabase Dashboard > Storage > Buckets > products
   - Le toggle "Public bucket" doit être activé

2. **Vérifier les politiques RLS** :
   - Storage > Buckets > products > Policies
   - Il doit y avoir une politique "Public Access" avec `SELECT` et `true`

3. **Vérifier l'URL dans la base de données** :
   - Table Editor > products
   - Vérifier le champ `image_url`
   - L'URL devrait être complète et commencer par `https://zkhnngdzqqxzhvxbegxz.supabase.co/storage/v1/object/public/products/`

4. **Tester l'URL directement** :
   - Copier l'URL depuis la base de données
   - L'ouvrir dans un navigateur
   - Si elle fonctionne, le problème est dans le code
   - Si elle ne fonctionne pas, le problème est dans Supabase (bucket non public ou politique RLS)

## Solution temporaire
En attendant, les images sont stockées en base64 dans `image_data` comme fallback.

