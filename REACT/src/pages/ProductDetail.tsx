import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/common/Header.tsx';
import { useCart } from '../contexts/CartContext.tsx';
import { useProducts, Product } from '../contexts/ProductContext.tsx';
import { useFavorites } from '../contexts/FavoritesContext.tsx';
import { useToast } from '../contexts/ToastContext.tsx';
import { formatImageSrc, handleImageError } from '../utils/imageUtils.ts';
import { supabase } from '../lib/supabase.ts';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { getProductById } = useProducts();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showWarning } = useToast();

  // Charger le produit depuis le contexte ou depuis Supabase
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      
      // D'abord, essayer de récupérer depuis le contexte
      const contextProduct = getProductById(id || '');
      if (contextProduct) {
        setProduct(contextProduct);
        setIsLoading(false);
        return;
      }

      // Si pas trouvé dans le contexte, charger depuis Supabase (pour les produits premium notamment)
      try {
        // Essayer d'abord avec product_id
        let { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('product_id', id || '')
          .maybeSingle();

        // Si pas trouvé avec product_id, essayer avec id (UUID)
        if (!data && !error) {
          const result = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .eq('id', id || '')
            .maybeSingle();
          data = result.data;
          error = result.error;
        }

        if (error) {
          console.error('Erreur lors du chargement du produit:', error);
          setProduct(null);
        } else if (data) {
          // Convertir au format Product
          const loadedProduct: Product = {
            id: data.id,
            product_id: data.product_id,
            name: data.name,
            category: data.category,
            price: Number(data.price),
            original_price: data.original_price ? Number(data.original_price) : undefined,
            stock: data.stock || 0,
            image_url: data.image_url || undefined,
            image_data: data.image_data || undefined,
            sizes: Array.isArray(data.sizes) ? data.sizes : [],
            colors: Array.isArray(data.colors) ? data.colors : [],
            is_new: data.is_new || false,
            is_active: data.is_active !== false,
            is_premium: data.is_premium || false,
            description: data.description || undefined,
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
          setProduct(loadedProduct);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, getProductById]);

  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="section-padding">
          <div className="container-custom max-w-2xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-male-red border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-text text-sm">Chargement du produit...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="section-padding">
          <div className="container-custom max-w-2xl text-center">
            <h1 className="text-3xl font-display font-bold text-blacksoft mb-4">
              Produit <span className="gradient-text">Introuvable</span>
            </h1>
            <p className="text-gray-text mb-8 text-sm">
              Le produit que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/produits"
                className="btn-primary inline-block"
              >
                Voir tous les produits
              </Link>
              <Link
                to="/premium"
                className="btn-secondary inline-block"
              >
                Voir les produits Premium
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      showWarning('Veuillez sélectionner une taille');
      return;
    }
    
    addItem({
      id: product.product_id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price || product.price,
      image: formatImageSrc(product.image_url, product.image_data),
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    });
  };

  const productImage = formatImageSrc(product.image_url, product.image_data);
  const productImages = [productImage]; // Simple array for now

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumbs */}
      <div className="container-custom py-4 border-b border-gray-200">
        <nav className="flex text-xs text-gray-text">
          <Link to="/" className="hover:text-male-red transition-colors">Accueil</Link>
          <span className="mx-2">/</span>
          <Link to="/produits" className="hover:text-male-red transition-colors">Produits</Link>
          <span className="mx-2">/</span>
          <span className="text-blacksoft truncate">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square overflow-hidden rounded-lg bg-offwhite">
                <img
                  src={productImages[selectedImage] || productImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
              
              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-male-red' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-blacksoft mb-3">{product.name}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-4 h-4 text-karma-yellow"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-text text-sm">4.9 (2k+ Avis)</span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-male-red">{formatCurrency(product.price)}</span>
                  {product.original_price && (
                    <span className="text-lg text-gray-medium line-through">{formatCurrency(product.original_price)}</span>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-male-red font-semibold text-sm">Économisez {discount}% maintenant</p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-base font-semibold text-blacksoft mb-2">Description</h3>
                  <p className="text-gray-text text-sm leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-blacksoft mb-3">Couleurs</h3>
                  <div className="flex space-x-2">
                    {product.colors.map((color) => {
                      const colorMap: { [key: string]: string } = {
                        'noir': '#000000',
                        'blanc': '#FFFFFF',
                        'rouge': '#EF4444',
                        'bleu': '#3B82F6',
                        'vert': '#10B981',
                        'jaune': '#F59E0B',
                        'orange': '#F97316',
                        'rose': '#EC4899',
                        'violet': '#8B5CF6',
                        'gris': '#6B7280',
                        'marron': '#92400E',
                        'beige': '#FEF3C7'
                      };
                      
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            selectedColor === color ? 'border-male-red scale-110' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: colorMap[color.toLowerCase()] || '#6B7280' }}
                          title={color.charAt(0).toUpperCase() + color.slice(1)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-blacksoft mb-3">Tailles</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded border transition-all text-sm font-medium ${
                          selectedSize === size
                            ? 'border-male-red bg-male-red text-white'
                            : 'border-gray-200 text-gray-text hover:border-gray-300 bg-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <motion.button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary text-xs py-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  AJOUTER AU PANIER
                </motion.button>
                <motion.button
                  onClick={() => toggleFavorite(product.product_id)}
                  className={`p-3 border rounded-lg transition-colors ${
                    isFavorite(product.product_id)
                      ? 'border-male-red bg-male-red text-white'
                      : 'border-gray-200 text-gray-text hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill={isFavorite(product.product_id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </motion.button>
              </div>

              {/* Additional Info */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center text-gray-text text-sm">
                  <svg className="w-5 h-5 mr-3 text-male-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Livraison gratuite à Dakar
                </div>
                <div className="flex items-center text-gray-text text-sm">
                  <svg className="w-5 h-5 mr-3 text-male-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Paiement 100% sécurisé
                </div>
                <div className="flex items-center text-gray-text text-sm">
                  <svg className="w-5 h-5 mr-3 text-male-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Fabriqué à Dakar par SIGGIL
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
