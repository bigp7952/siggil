import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2 } from 'lucide-react';

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
  console.log('🔍 ProductForm - Catégories reçues:', categories);
  console.log('🔍 ProductForm - Type de categories:', typeof categories);
  console.log('🔍 ProductForm - Longueur de categories:', categories?.length);
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
    is_active: true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || '',
        price: initialData.price || 0,
        original_price: initialData.original_price || 0,
        stock: initialData.stock || 0,
        colors: initialData.colors || [],
        sizes: initialData.sizes || [],
        images: initialData.images || [],
        is_new: initialData.is_new || false,
        is_active: initialData.is_active !== false
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner uniquement des fichiers image.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold text-white">
              {mode === 'create' ? 'Ajouter un Produit' : 'Modifier le Produit'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="Ex: T-shirt SIGGIL Premium"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Catégorie *
                </label>
                                 <select
                   value={formData.category}
                   onChange={(e) => handleInputChange('category', e.target.value)}
                   className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                     errors.category ? 'border-red-500' : 'border-gray-700'
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
                  <p className="text-red-400 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                  errors.description ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="Décrivez votre produit en détail..."
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Prix et stock */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prix de vente (FCFA) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                    errors.price ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="5000"
                  min="0"
                />
                {errors.price && (
                  <p className="text-red-400 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prix original (FCFA)
                </label>
                <input
                  type="number"
                  value={formData.original_price}
                  onChange={(e) => handleInputChange('original_price', Number(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  placeholder="6000"
                  min="0"
                />
                <p className="text-gray-500 text-xs mt-1">Laissez vide si pas de réduction</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stock disponible *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                    errors.stock ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="10"
                  min="0"
                />
                {errors.stock && (
                  <p className="text-red-400 text-sm mt-1">{errors.stock}</p>
                )}
              </div>
            </div>

            {/* Couleurs */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Couleurs disponibles *
              </label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color) => (
                    <span
                      key={color}
                      className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-7 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => addColor(color)}
                      disabled={formData.colors.includes(color)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        formData.colors.includes(color)
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                {errors.colors && (
                  <p className="text-red-400 text-sm mt-1">{errors.colors}</p>
                )}
              </div>
            </div>

            {/* Tailles */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tailles disponibles *
              </label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
                  {predefinedSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => addSize(size)}
                      disabled={formData.sizes.includes(size)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        formData.sizes.includes(size)
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {errors.sizes && (
                  <p className="text-red-400 text-sm mt-1">{errors.sizes}</p>
                )}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Images du produit *
              </label>
              <div className="space-y-4">
                {/* Zone de drop */}
                <div
                  className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-red-500 transition-colors"
                  onClick={() => document.getElementById('product-images')?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">
                    Cliquez pour sélectionner des images
                  </p>
                  <p className="text-gray-500 text-sm">
                    Formats acceptés: JPG, PNG, GIF • Max: 5MB par image
                  </p>
                  <input
                    id="product-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Aperçu des images */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                                                 <img
                           src={image}
                           alt={`Aperçu ${index + 1}`}
                           className="w-full h-32 object-cover rounded-lg"
                         />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {errors.images && (
                  <p className="text-red-400 text-sm mt-1">{errors.images}</p>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => handleInputChange('is_new', e.target.checked)}
                  className="w-4 h-4 text-red-500 bg-gray-800 border-gray-700 rounded focus:ring-red-500 focus:ring-2"
                />
                <span className="text-gray-300">Marquer comme nouveau produit</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="w-4 h-4 text-red-500 bg-gray-800 border-gray-700 rounded focus:ring-red-500 focus:ring-2"
                />
                <span className="text-gray-300">Produit actif</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {mode === 'create' ? 'Ajout en cours...' : 'Modification...'}
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
