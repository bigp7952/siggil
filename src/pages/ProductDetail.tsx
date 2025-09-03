import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/common/Header.tsx';
import { useCart } from '../contexts/CartContext.tsx';
import { useProducts } from '../contexts/ProductContext.tsx';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const { addItem } = useCart();
  const { getProductById } = useProducts();

  const product = getProductById(id || '');

  useEffect(() => {
    if (product) {
      if (product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Produit <span className="text-red-500">Introuvable</span>
            </h1>
            <p className="text-gray-400 mb-8">
              Le produit que vous recherchez n'existe pas.
            </p>
            <button
              onClick={() => navigate('/produits')}
              className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Voir tous les produits
            </button>
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
      alert('Veuillez sélectionner une taille');
      return;
    }
    
    addItem({
      id: product.product_id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price || product.price,
      image: product.image_url || product.image_data || '/back.jpg',
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Breadcrumbs */}
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-3 sm:py-4">
        <nav className="flex text-xs sm:text-sm text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
          <span className="mx-1 sm:mx-2">/</span>
          <Link to="/produits" className="hover:text-white transition-colors">Produits</Link>
          <span className="mx-1 sm:mx-2">/</span>
          <span className="text-white truncate">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          
          {/* Product Images */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-red-500' 
                        : 'border-gray-700 hover:border-gray-500'
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
          <div className="space-y-4 sm:space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        star <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-400 text-sm sm:text-base">{product.reviews} Avis</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <span className="text-2xl sm:text-3xl font-bold text-white">{formatCurrency(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-lg sm:text-xl text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-red-500 font-semibold text-sm sm:text-base">Économisez {discount}% maintenant</p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Description</h3>
                <p className="text-gray-300 text-sm sm:text-base">{product.description}</p>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Couleurs</h3>
                <div className="flex space-x-2 sm:space-x-3">
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
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${
                          selectedColor === color ? 'border-white' : 'border-gray-600'
                        }`}
                        style={{ backgroundColor: colorMap[color] || '#6B7280' }}
                        title={color.charAt(0).toUpperCase() + color.slice(1)}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Tailles</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border transition-all text-sm sm:text-base ${
                      selectedSize === size
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 sm:space-x-4">
                             <motion.button
                 onClick={handleAddToCart}
                 className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
               >
                 AJOUTER AU PANIER
               </motion.button>
              <motion.button
                className="p-3 sm:p-4 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
            </div>

                         {/* Additional Info */}
             <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-gray-800">
               <div className="flex items-center text-gray-400 text-sm sm:text-base">
                 <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                 </svg>
                 Livraison gratuite à Dakar
               </div>
               <div className="flex items-center text-gray-400 text-sm sm:text-base">
                 <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                 </svg>
                 Paiement 100% sécurisé
               </div>
               <div className="flex items-center text-gray-400 text-sm sm:text-base">
                 <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                 </svg>
                 Fabriqué à Dakar par SIGGIL
               </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
