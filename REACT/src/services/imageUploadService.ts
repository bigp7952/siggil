import { supabaseAdmin } from '../lib/supabase.ts';

/**
 * Service pour uploader des images vers Supabase Storage
 */

// Nom du bucket Supabase Storage pour les images
const PRODUCTS_BUCKET = 'products';
const CATEGORIES_BUCKET = 'categories';

/**
 * Initialise les buckets Supabase Storage s'ils n'existent pas
 * À exécuter une seule fois dans Supabase Dashboard > Storage
 */
export const initializeStorageBuckets = async () => {
  // Note: Cette fonction nécessite les permissions admin
  // Les buckets doivent être créés manuellement dans Supabase Dashboard
  console.log('ℹ️ Les buckets doivent être créés manuellement dans Supabase Dashboard > Storage');
};

/**
 * Upload une image de produit vers Supabase Storage
 * @param file - Fichier image à uploader
 * @param productId - ID du produit (pour nommer le fichier)
 * @returns URL publique de l'image ou null en cas d'erreur
 */
export const uploadProductImage = async (
  file: File,
  productId: string
): Promise<string | null> => {
  try {
    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${productId}-${timestamp}.${fileExt}`;
    
    // Si c'est un ID temporaire (temp-XXX), uploader directement à la racine
    // Sinon, créer un dossier avec le product_id
    const filePath = productId.startsWith('temp-') 
      ? fileName  // Upload direct à la racine pour les temp
      : `${productId}/${fileName}`;

    console.log('Upload de l\'image produit:', filePath);
    console.log('Product ID:', productId);

    // Upload vers Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(PRODUCTS_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Erreur upload image:', error);
      throw error;
    }

    // Obtenir l'URL publique
    const { data: urlData } = supabaseAdmin.storage
      .from(PRODUCTS_BUCKET)
      .getPublicUrl(filePath);

    console.log('Image uploadée avec succès:', urlData.publicUrl);
    console.log('Chemin du fichier:', filePath);
    console.log('IMPORTANT: Assurez-vous que le bucket "products" est PUBLIC dans Supabase Dashboard > Storage > Buckets');
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image:', error);
    return null;
  }
};

/**
 * Upload plusieurs images de produit
 * @param files - Tableau de fichiers images
 * @param productId - ID du produit
 * @returns Tableau d'URLs publiques
 */
export const uploadMultipleProductImages = async (
  files: File[],
  productId: string
): Promise<string[]> => {
  const uploadPromises = files.map((file, index) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}-${index}-${Date.now()}.${fileExt}`;
    return uploadProductImage(file, productId);
  });

  const urls = await Promise.all(uploadPromises);
  return urls.filter((url): url is string => url !== null);
};

/**
 * Upload une image de catégorie vers Supabase Storage
 * @param file - Fichier image à uploader
 * @param categoryName - Nom de la catégorie (pour nommer le fichier)
 * @returns URL publique de l'image ou null en cas d'erreur
 */
export const uploadCategoryImage = async (
  file: File,
  categoryName: string
): Promise<string | null> => {
  try {
    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const sanitizedName = categoryName.toLowerCase().replace(/\s+/g, '-');
    const fileName = `${sanitizedName}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    console.log('Upload de l\'image catégorie:', filePath);

    // Upload vers Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(CATEGORIES_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Erreur upload image:', error);
      throw error;
    }

    // Obtenir l'URL publique
    const { data: urlData } = supabaseAdmin.storage
      .from(CATEGORIES_BUCKET)
      .getPublicUrl(filePath);

    console.log('Image uploadée avec succès:', urlData.publicUrl);
    console.log('Chemin du fichier:', filePath);
    console.log('IMPORTANT: Assurez-vous que le bucket "categories" est PUBLIC dans Supabase Dashboard > Storage > Buckets');
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image:', error);
    return null;
  }
};

/**
 * Supprime une image de Supabase Storage
 * @param imageUrl - URL publique de l'image à supprimer
 * @param bucket - Bucket (products ou categories)
 */
export const deleteImage = async (
  imageUrl: string,
  bucket: 'products' | 'categories' = 'products'
): Promise<boolean> => {
  try {
    // Extraire le chemin du fichier depuis l'URL
    const urlParts = imageUrl.split('/');
    const filePath = urlParts.slice(-2).join('/'); // Prendre les 2 derniers segments

    console.log('Suppression de l\'image:', filePath);

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('❌ Erreur suppression image:', error);
      return false;
    }

    console.log('Image supprimée avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    return false;
  }
};

/**
 * Convertit un fichier en base64 (fallback si Storage échoue)
 * @param file - Fichier à convertir
 * @returns Promise<string> - Base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Upload avec fallback base64
 * Essaie d'abord Supabase Storage, puis base64 si échec
 */
export const uploadImageWithFallback = async (
  file: File,
  productId: string,
  useStorage: boolean = true
): Promise<{ url: string | null; base64: string | null }> => {
  if (useStorage) {
    const url = await uploadProductImage(file, productId);
    if (url) {
      return { url, base64: null };
    }
    console.log('Échec upload Storage, fallback vers base64');
  }

  // Fallback vers base64
  const base64 = await fileToBase64(file);
  return { url: null, base64 };
};

