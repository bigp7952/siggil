import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext.tsx';
import { useFavorites } from '../../contexts/FavoritesContext.tsx';

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
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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
      alert('Ce produit n\'a pas de tailles disponibles');
      return;
    }

    setIsAddingToCart(true);
    
    // Ajouter au panier avec la première taille et couleur disponibles
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

    // Animation de feedback
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
      transition={{ duration: 0.6, delay }}
      className="group relative"
    >
             <Link to={`/produit/${product.product_id}`}>
        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-red-500/50 transition-colors">
          {/* Image du produit */}
          <div className="relative aspect-square bg-gray-800 overflow-hidden">
                         <img
               src={product.image_url || product.image_data || '/back.jpg'}
               alt={product.name}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
             />
            
                         {/* Badge Nouveau */}
             {product.is_new && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                NOUVEAU
              </div>
            )}
            
            {/* Badge de réduction */}
            {discount > 0 && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                -{discount}%
              </div>
            )}
            
            {/* Bouton Like */}
            <button
              onClick={handleToggleFavorite}
              className={`absolute top-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-20 ${
                discount > 0 ? 'right-16' : 'right-2'
              }`}
            >
              <svg
                                 className={`w-5 h-5 transition-colors ${
                   isFavorite(product.product_id) 
                     ? 'text-red-500 fill-current' 
                     : 'text-white hover:text-red-500'
                 }`}
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
            </button>
            
            {/* Overlay au hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Bouton Ajouter au panier */}
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
                className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  product.stock === 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : isAddingToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {product.stock === 0 ? (
                  'Rupture de stock'
                ) : isAddingToCart ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Ajouté !</span>
                  </div>
                ) : (
                  'Ajouter au panier'
                )}
              </button>
            </div>
          </div>
          
          {/* Informations du produit */}
          <div className="p-4">
            <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
              {product.name}
            </h3>
            
            {/* Prix */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-500 font-bold text-lg">
                {formatCurrency(product.price)}
              </span>
                             {product.original_price && (
                <span className="text-gray-500 line-through text-sm">
                                     {formatCurrency(product.original_price)}
                </span>
              )}
            </div>
            
            {/* Tailles disponibles */}
            <div className="flex flex-wrap gap-1 mb-2">
              {product.sizes.slice(0, 3).map((size) => (
                <span
                  key={size}
                  className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 3 && (
                <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded">
                  +{product.sizes.length - 3}
                </span>
              )}
            </div>
            
            {/* Stock */}
            <div className="text-xs text-gray-400">
              {product.stock > 0 ? (
                <span className="text-green-400">En stock ({product.stock})</span>
              ) : (
                <span className="text-red-400">Rupture de stock</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
