import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2 } from 'lucide-react';
import { uploadImageWithFallback, fileToBase64 } from '../../services/imageUploadService.ts';
import { useToast } from '../../contexts/ToastContext.tsx';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: any) => Promise<void>;
  categories?: Array<{ id: string; name: string; image?: string }>;
  initialData?: any;
  mode: 'create' | 'edit';
}

interface ProductData {
  name: string;
  description: string;
  category: string;
  price: number;
  original_price: number;
  stock: number;
  colors: string[];
  sizes: string[];
  images: string[];
  is_new: boolean;
  is_active: boolean;
  is_premium: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialData,
  mode
}) => {
  // Debug: Log des catégories reçues
  console.log('ProductForm - Catégories reçues:', categories);
  console.log('ProductForm - Type de categories:', typeof categories);
  console.log('ProductForm - Longueur de categories:', categories?.length);
  const { showError, showWarning } = useToast();
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    description: '',
    category: '',
    price: 0,
    original_price: 0,
    stock: 0,
    colors: [],
    sizes: [],
    images: [],
    is_new: false,
    is_active: true,
    is_premium: false
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Couleurs et tailles prédéfinies
  const predefinedColors = [
    'Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Orange', 'Violet', 
    'Rose', 'Marron', 'Gris', 'Beige', 'Doré', 'Argenté'
  ];

  const predefinedSizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL',
    '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'
  ];

  useEffect(() => {
    if (initialData && mode === 'edit') {
      // Construire le tableau d'images (priorité à image_url, puis images, puis image_data)
      const images: string[] = [];
      if (initialData.image_url) {
        images.push(initialData.image_url);
      }
      if (initialData.images && initialData.images.length > 0) {
        images.push(...initialData.images.filter(img => img !== initialData.image_url));
      } else if (initialData.image_data && !images.includes(initialData.image_data)) {
        images.push(initialData.image_data);
      }
      
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || '',
        price: initialData.price || 0,
        original_price: initialData.original_price || 0,
        stock: initialData.stock || 0,
        colors: initialData.colors || [],
        sizes: initialData.sizes || [],
        images: images.length > 0 ? images : [],
        is_new: initialData.is_new || false,
        is_active: initialData.is_active !== false,
        is_premium: initialData.is_premium || false
      });
      // Réinitialiser les fichiers lors de l'édition
      setImageFiles([]);
    } else if (mode === 'create') {
      // Réinitialiser lors de la création
      setImageFiles([]);
      setFormData({
        name: '',
        description: '',
        category: '',
        price: 0,
        original_price: 0,
        stock: 0,
        colors: [],
        sizes: [],
        images: [],
        is_new: false,
        is_active: true,
        is_premium: false
      });
    }
  }, [initialData, mode]);

  const handleInputChange = (field: keyof ProductData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Valider les fichiers
    const validFiles: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        showWarning(`${file.name}: Veuillez sélectionner uniquement des fichiers image.`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        showWarning(`${file.name}: L'image ne doit pas dépasser 5MB.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Stocker les fichiers pour l'upload
    setImageFiles(prev => [...prev, ...validFiles]);

    // Afficher un aperçu immédiat (base64 pour preview)
    for (const file of validFiles) {
      const base64 = await fileToBase64(file);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, base64]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addColor = (color: string) => {
    if (!formData.colors.includes(color)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, color]
      }));
    }
  };

  const removeColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  const addSize = (size: string) => {
    if (!formData.sizes.includes(size)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, size]
      }));
    }
  };

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du produit est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Le stock ne peut pas être négatif';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'Au moins une image est requise';
    }

    if (formData.colors.length === 0) {
      newErrors.colors = 'Au moins une couleur est requise';
    }

    if (formData.sizes.length === 0) {
      newErrors.sizes = 'Au moins une taille est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setUploadingImages(true);

    try {
      // Générer un product_id temporaire si en mode création
      const tempProductId = mode === 'create' 
        ? `temp-${Date.now()}` 
        : (initialData?.product_id || 'temp');

      // Uploader les images vers Supabase Storage
      const uploadedImageUrls: string[] = [];
      const uploadedBase64: string[] = [];

      // Traiter les nouvelles images uploadées
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const existingImage = formData.images[i];

        // Si c'est déjà une URL (mode édition avec image existante), garder l'URL
        if (existingImage && existingImage.startsWith('http')) {
          uploadedImageUrls.push(existingImage);
          continue;
        }

        // Si c'est base64 et qu'on a un fichier, uploader le fichier
        if (file) {
          // Essayer d'uploader vers Supabase Storage
          const result = await uploadImageWithFallback(file, tempProductId, true);
          
          if (result.url) {
            uploadedImageUrls.push(result.url);
          } else if (result.base64) {
            uploadedBase64.push(result.base64);
          }
        } else if (existingImage) {
          // Pas de fichier mais image existante (base64), garder le base64
          uploadedBase64.push(existingImage);
        }
      }

      // Ajouter les images existantes qui n'ont pas été modifiées
      for (let i = imageFiles.length; i < formData.images.length; i++) {
        const existingImage = formData.images[i];
        if (existingImage) {
          if (existingImage.startsWith('http')) {
            uploadedImageUrls.push(existingImage);
          } else {
            uploadedBase64.push(existingImage);
          }
        }
      }

      // Combiner URLs et base64 (priorité aux URLs)
      const allImages = [...uploadedImageUrls, ...uploadedBase64];
      
      // Déterminer image_url et image_data
      // Priorité: URL Supabase Storage > base64 > image existante
      let finalImageUrl: string | null = null;
      let finalImageData: string | null = null;
      
      if (uploadedImageUrls.length > 0) {
        // On a une URL Supabase Storage (priorité absolue)
        finalImageUrl = uploadedImageUrls[0];
        console.log('ProductForm: image_url défini:', finalImageUrl);
      } else if (uploadedBase64.length > 0) {
        // On a du base64 (fallback)
        finalImageData = uploadedBase64[0];
        console.log('ProductForm: image_data défini (base64)');
      } else if (formData.images && formData.images.length > 0) {
        // Image existante (mode édition)
        const existingImage = formData.images[0];
        if (existingImage.startsWith('http://') || existingImage.startsWith('https://')) {
          finalImageUrl = existingImage;
        } else {
          finalImageData = existingImage;
        }
      }
      
      // Préparer les données avec les URLs ou base64
      const productData = {
        ...formData,
        images: allImages.length > 0 ? allImages : formData.images,
        // Toujours définir image_url et image_data explicitement
        image_url: finalImageUrl,
        image_data: finalImageData,
      };
      
      console.log('ProductForm: Données finales - image_url:', finalImageUrl ? 'OUI' : 'NON', finalImageUrl);
      console.log('ProductForm: Données finales - image_data:', finalImageData ? 'OUI' : 'NON');

      await onSubmit(productData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      showError('Erreur lors de l\'upload des images. Veuillez réessayer.');
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="card-modern w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-lg md:text-2xl font-display font-bold text-blacksoft">
              {mode === 'create' ? 'Ajouter un Produit' : 'Modifier le Produit'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-text hover:text-blacksoft transition-colors"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-xs md:text-sm font-medium text-blacksoft mb-1 md:mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full bg-offwhite border rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-blacksoft focus:outline-none focus:border-karma-orange transition-all ${
                    errors.name ? 'border-male-red' : 'border-gray-200'
                  }`}
                  placeholder="Ex: T-shirt SIGGIL Premium"
                />
                {errors.name && (
                  <p className="text-male-red text-xs md:text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-blacksoft mb-1 md:mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full bg-offwhite border rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-blacksoft focus:outline-none focus:border-karma-orange transition-all ${
                    errors.category ? 'border-male-red' : 'border-gray-200'
                  }`}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories && categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Aucune catégorie disponible</option>
                  )}
                </select>
                {errors.category && (
                  <p className="text-male-red text-xs md:text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-blacksoft mb-1 md:mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full bg-offwhite border rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-blacksoft focus:outline-none focus:border-karma-orange transition-all ${
                  errors.description ? 'border-male-red' : 'border-gray-200'
                }`}
                placeholder="Décrivez votre produit en détail..."
              />
              {errors.description && (
                <p className="text-male-red text-xs md:text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Prix et stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div>
                <label className="block text-xs md:text-sm font-medium text-blacksoft mb-1 md:mb-2">
                  Prix de vente (FCFA) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  className={`w-full bg-offwhite border rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-blacksoft focus:outline-none focus:border-karma-orange transition-all ${
                    errors.price ? 'border-male-red' : 'border-gray-200'
                  }`}
                  placeholder="5000"
                  min="0"
                />
                {errors.price && (
                  <p className="text-male-red text-xs md:text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-blacksoft mb-1 md:mb-2">
                  Prix original (FCFA)
                </label>
                <input
                  type="number"
                  value={formData.original_price}
                  onChange={(e) => handleInputChange('original_price', Number(e.target.value))}
                  className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-blacksoft focus:outline-none focus:border-karma-orange transition-all"
                  placeholder="6000"
                  min="0"
                />
                <p className="text-gray-text text-[10px] md:text-xs mt-1">Laissez vide si pas de réduction</p>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-blacksoft mb-1 md:mb-2">
                  Stock disponible *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                  className={`w-full bg-offwhite border rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-blacksoft focus:outline-none focus:border-karma-orange transition-all ${
                    errors.stock ? 'border-male-red' : 'border-gray-200'
                  }`}
                  placeholder="10"
                  min="0"
                />
                {errors.stock && (
                  <p className="text-male-red text-xs md:text-sm mt-1">{errors.stock}</p>
                )}
              </div>
            </div>

            {/* Couleurs */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-blacksoft mb-2 md:mb-2">
                Couleurs disponibles *
              </label>
              <div className="space-y-2 md:space-y-3">
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color) => (
                    <span
                      key={color}
                      className="inline-flex items-center gap-1 md:gap-2 bg-male-red/10 text-male-red px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="text-male-red hover:text-male-red/80"
                      >
                        <X size={12} className="md:w-3.5 md:h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => addColor(color)}
                      disabled={formData.colors.includes(color)}
                      className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm transition-all ${
                        formData.colors.includes(color)
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-offwhite text-blacksoft hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                {errors.colors && (
                  <p className="text-male-red text-xs md:text-sm mt-1">{errors.colors}</p>
                )}
              </div>
            </div>

            {/* Tailles */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-blacksoft mb-2 md:mb-2">
                Tailles disponibles *
              </label>
              <div className="space-y-2 md:space-y-3">
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-1 md:gap-2 bg-[#ff6c00]/10 text-[#ff6c00] px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="text-[#ff6c00] hover:text-[#ff6c00]/80"
                      >
                        <X size={12} className="md:w-3.5 md:h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {predefinedSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => addSize(size)}
                      disabled={formData.sizes.includes(size)}
                      className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm transition-all ${
                        formData.sizes.includes(size)
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-offwhite text-blacksoft hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {errors.sizes && (
                  <p className="text-male-red text-xs md:text-sm mt-1">{errors.sizes}</p>
                )}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-blacksoft mb-2 md:mb-2">
                Images du produit *
              </label>
              {uploadingImages && (
                <div className="mb-3 p-2 bg-karma-orange/10 text-karma-orange text-xs rounded">
                  ⏳ Upload des images en cours...
                </div>
              )}
              <div className="space-y-3 md:space-y-4">
                {/* Zone de drop */}
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-4 md:p-8 text-center cursor-pointer hover:border-karma-orange transition-colors"
                  onClick={() => !uploadingImages && document.getElementById('product-images')?.click()}
                >
                  <Upload className="w-8 h-8 md:w-12 md:h-12 text-gray-text mx-auto mb-2 md:mb-4" />
                  <p className="text-blacksoft text-sm md:text-lg mb-1 md:mb-2">
                    Cliquez pour sélectionner des images
                  </p>
                  <p className="text-gray-text text-xs md:text-sm">
                    Formats acceptés: JPG, PNG, GIF • Max: 5MB par image
                  </p>
                  <p className="text-gray-text text-[10px] md:text-xs mt-1">
                    Les images seront uploadées vers Supabase Storage
                  </p>
                  <input
                    id="product-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                    className="hidden"
                  />
                </div>

                {/* Aperçu des images */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Aperçu ${index + 1}`}
                          className="w-full h-24 md:h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-male-red hover:bg-male-red/90 text-white p-1.5 md:p-2 rounded-full transition-colors"
                          >
                            <Trash2 size={14} className="md:w-4 md:h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {errors.images && (
                  <p className="text-male-red text-xs md:text-sm mt-1">{errors.images}</p>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-6">
              <label className="flex items-center gap-2 md:gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => handleInputChange('is_new', e.target.checked)}
                  className="w-4 h-4 text-male-red bg-offwhite border-gray-200 rounded focus:ring-karma-orange focus:ring-2"
                />
                <span className="text-blacksoft text-xs md:text-sm">Marquer comme nouveau produit</span>
              </label>

              <label className="flex items-center gap-2 md:gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="w-4 h-4 text-male-red bg-offwhite border-gray-200 rounded focus:ring-karma-orange focus:ring-2"
                />
                <span className="text-blacksoft text-xs md:text-sm">Produit actif</span>
              </label>
              <label className="flex items-center gap-2 md:gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_premium}
                  onChange={(e) => handleInputChange('is_premium', e.target.checked)}
                  className="w-4 h-4 text-[#ff6c00] bg-offwhite border-gray-200 rounded focus:ring-karma-orange focus:ring-2"
                />
                <span className="text-blacksoft text-xs md:text-sm">Produit Premium</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary text-[10px] md:text-xs py-2 md:py-3"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary text-[10px] md:text-xs py-2 md:py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {mode === 'create' ? 'Ajout...' : 'Modification...'}
                  </>
                ) : (
                  mode === 'create' ? 'Ajouter le produit' : 'Modifier le produit'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductForm;
