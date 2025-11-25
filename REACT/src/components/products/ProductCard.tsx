import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext.tsx';
import { useFavorites } from '../../contexts/FavoritesContext.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';
import { formatImageSrc, handleImageError } from '../../utils/imageUtils.ts';

interface Product {
  id?: string;
  product_id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  stock: number;
  image_url?: string;
  image_data?: string;
  sizes: string[];
  colors: string[];
  is_new: boolean;
  is_active: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface ProductCardProps {
  product: Product;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, delay = 0 }) => {
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showWarning } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.sizes.length === 0) {
      showWarning('Ce produit n\'a pas de tailles disponibles');
      return;
    }

    setIsAddingToCart(true);
    
    addItem({
      id: product.product_id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price || product.price,
      image: product.image_url || product.image_data || '/back.jpg',
      size: product.sizes[0],
      color: product.colors[0] || 'Noir',
      quantity: 1
    });

    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.product_id);
  };

  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/produit/${product.product_id}`}>
        <div className="product-card">
          {/* Image Container */}
          <div className="product-image-wrapper">
            <img
              src={formatImageSrc(product.image_url, product.image_data)}
              alt={product.name}
              className="product-image"
              onError={handleImageError}
              loading="lazy"
            />
            
            {/* Badge Nouveau */}
            {product.is_new && (
              <div className="badge-new">
                NOUVEAU
              </div>
            )}
            
            {/* Badge Réduction */}
            {discount > 0 && (
              <div className="badge-sale">
                -{discount}%
              </div>
            )}
            
            {/* Favorite Button */}
            <motion.button
              type="button"
              onClick={handleToggleFavorite}
              aria-label={isFavorite(product.product_id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className={`absolute top-2 z-20 p-1.5 rounded-full backdrop-blur-sm transition-all ${
                discount > 0 ? 'right-16' : 'right-2'
              } ${
                isFavorite(product.product_id)
                  ? 'bg-male-red text-white'
                  : 'bg-white/80 text-gray-text hover:bg-white'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-4 h-4"
                fill={isFavorite(product.product_id) ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </motion.button>
            
            {/* Quick Add Button - Appears on Hover */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10
              }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 left-3 right-3 z-20"
            >
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
                aria-label="Ajouter au panier"
                className={`w-full py-2 px-3 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                  product.stock === 0
                    ? 'bg-gray-medium text-white cursor-not-allowed'
                    : isAddingToCart
                    ? 'bg-green-500 text-white'
                    : 'btn-primary'
                }`}
              >
                {product.stock === 0 ? (
                  'Rupture de stock'
                ) : isAddingToCart ? (
                  <div className="flex items-center justify-center space-x-1">
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Ajouté !</span>
                  </div>
                ) : (
                  'Ajouter au panier'
                )}
              </button>
            </motion.div>
          </div>
          
          {/* Product Info */}
          <div className="p-4">
            <div className="mb-2">
              <p className="text-xs text-gray-medium uppercase tracking-wider mb-1">
                {product.category}
              </p>
              <h3 className="text-blacksoft font-display font-semibold text-sm mb-2 line-clamp-2 group-hover:text-male-red transition-colors">
                {product.name}
              </h3>
            </div>
            
            {/* Price */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-male-red font-bold text-base">
                {formatCurrency(product.price)}
              </span>
              {product.original_price && (
                <span className="text-gray-medium line-through text-xs">
                  {formatCurrency(product.original_price)}
                </span>
              )}
            </div>
            
            {/* Sizes Preview */}
            {product.sizes.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {product.sizes.slice(0, 4).map((size) => (
                  <span
                    key={size}
                    className="text-xs px-1.5 py-0.5 rounded bg-offwhite text-gray-text border border-gray-200"
                  >
                    {size}
                  </span>
                ))}
                {product.sizes.length > 4 && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-offwhite text-gray-text border border-gray-200">
                    +{product.sizes.length - 4}
                  </span>
                )}
              </div>
            )}
            
            {/* Stock Status */}
            <div className="flex items-center justify-between">
              <div className="text-xs">
                {product.stock > 0 ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    En stock
                  </span>
                ) : (
                  <span className="text-male-red flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-male-red rounded-full"></span>
                    Rupture
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
