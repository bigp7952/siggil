/**
 * Utilitaires pour formater et afficher les images
 */

/**
 * Formate une image pour l'affichage
 * Gère les cas : URL Supabase Storage, base64, ou chemin local
 */
export const formatImageSrc = (imageUrl?: string | null, imageData?: string | null): string => {
  // Priorité 1: image_url (URL Supabase Storage)
  if (imageUrl) {
    // Si c'est déjà une URL complète (http/https), la retourner telle quelle
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      // Vérifier si c'est une URL Supabase Storage
      if (imageUrl.includes('supabase.co/storage/v1/object/public/')) {
        console.log('formatImageSrc: URL Supabase Storage détectée', imageUrl.substring(0, 100));
        // L'URL est déjà complète, la retourner telle quelle
        return imageUrl;
      }
      console.log('formatImageSrc: URL complète détectée', imageUrl.substring(0, 50));
      return imageUrl;
    }
    
    // Si c'est un chemin relatif, construire l'URL complète
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://zkhnngdzqqxzhvxbegxz.supabase.co';
    let filePath = imageUrl;
    
    // Si le chemin ne commence pas par products/ ou categories/, déterminer le bucket
    if (!imageUrl.startsWith('products/') && !imageUrl.startsWith('categories/')) {
      // Si c'est un fichier temp-XXX, il est dans products/
      if (imageUrl.includes('temp-') || imageUrl.includes('PROD-')) {
        filePath = `products/${imageUrl}`;
      } else {
        // Par défaut, supposer que c'est dans products
        filePath = `products/${imageUrl}`;
      }
    }
    
    const fullUrl = `${supabaseUrl}/storage/v1/object/public/${filePath}`;
    console.log('formatImageSrc: URL Supabase Storage construite', fullUrl.substring(0, 100));
    console.log('Chemin du fichier:', filePath);
    return fullUrl;
  }

  // Priorité 2: image_data (base64)
  if (imageData) {
    // Si c'est déjà un data URL complet, le retourner
    if (imageData.startsWith('data:image/')) {
      console.log('formatImageSrc: Data URL détecté', imageData.substring(0, 50));
      return imageData;
    }
    // Si c'est une URL, la retourner
    if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
      console.log('formatImageSrc: URL dans image_data', imageData.substring(0, 50));
      return imageData;
    }
    // Vérifier si c'est du base64 pur (sans préfixe)
    // Le base64 contient généralement des caractères alphanumériques, +, /, et =
    const base64Pattern = /^[A-Za-z0-9+/=\s]+$/;
    const trimmedData = imageData.trim();
    
    if (trimmedData.length > 50 && base64Pattern.test(trimmedData) && !trimmedData.includes(',')) {
      // Probablement du base64 pur, ajouter le préfixe
      // Essayer de détecter le type d'image en fonction des premiers caractères
      let mimeType = 'image/jpeg'; // Par défaut
      if (trimmedData.startsWith('iVBORw0KGgo')) {
        mimeType = 'image/png';
      } else if (trimmedData.startsWith('/9j/') || trimmedData.startsWith('UklGR')) {
        mimeType = 'image/jpeg';
      }
      const formatted = `data:${mimeType};base64,${trimmedData}`;
      console.log('formatImageSrc: Base64 formaté', formatted.substring(0, 50), '...', `(${trimmedData.length} chars)`);
      return formatted;
    }
    // Si ça ne ressemble pas à du base64, retourner tel quel (peut-être un chemin)
    console.log('formatImageSrc: Format non reconnu, retourné tel quel', imageData.substring(0, 50), `(${imageData.length} chars)`);
    return imageData;
  }

  // Image par défaut
  console.log('formatImageSrc: Aucune image, utilisation du fallback');
  return '/back.jpg';
};

/**
 * Vérifie si une URL d'image est valide
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  return url.startsWith('http://') || 
         url.startsWith('https://') || 
         url.startsWith('data:image/') ||
         url.startsWith('/');
};

/**
 * Gère les erreurs de chargement d'image
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const img = e.currentTarget;
  // Si l'image n'est pas déjà l'image par défaut, la remplacer
  if (img.src !== `${window.location.origin}/back.jpg`) {
    img.src = '/back.jpg';
    img.onerror = null; // Éviter les boucles infinies
  }
};

