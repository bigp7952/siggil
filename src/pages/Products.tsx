import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header.tsx';
import AnimatedCard from '../components/common/AnimatedCard.tsx';
import AnimatedText from '../components/common/AnimatedText.tsx';
import { useProducts } from '../contexts/ProductContext.tsx';

const Products: React.FC = () => {
  const { state, setFilters, getFilteredProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'T-shirts', name: 'T-Shirts' },
    { id: 'Vestes', name: 'Vestes' },
    { id: 'Pantalons', name: 'Pantalons' },
    { id: 'Chaussures', name: 'Chaussures' },
    { id: 'Accessoires', name: 'Accessoires' }
  ];

  const sizes = [
    { id: 'all', name: 'Toutes' },
    { id: 'xs', name: 'XS' },
    { id: 's', name: 'S' },
    { id: 'm', name: 'M' },
    { id: 'l', name: 'L' },
    { id: 'xl', name: 'XL' },
    { id: 'xxl', name: 'XXL' }
  ];

  const colors = [
    { id: 'all', name: 'Toutes' },
    { id: 'noir', name: 'Noir' },
    { id: 'blanc', name: 'Blanc' },
    { id: 'rouge', name: 'Rouge' },
    { id: 'bleu', name: 'Bleu' },
    { id: 'gris', name: 'Gris' }
  ];

  const handleCategoryChange = (category: string) => {
    setFilters({ category });
  };

  const handleSizeChange = (size: string) => {
    setFilters({ size });
  };

  const handleColorChange = (color: string) => {
    setFilters({ color });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ searchQuery: query });
  };

  const filteredProducts = getFilteredProducts();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-16 pb-12 px-4 sm:pt-20 md:pt-24">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8 md:mb-12"
          >
            <AnimatedText 
              type="word" 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4"
            >
              NOS <span className="text-red-500">PRODUITS</span>
            </AnimatedText>
            <AnimatedText 
              type="line" 
              className="text-gray-400 text-xs sm:text-sm md:text-lg max-w-2xl mx-auto px-4"
              delay={0.3}
            >
              Découvrez notre collection streetwear exclusive
            </AnimatedText>
          </motion.div>

          {/* Filtres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 sm:mb-8 md:mb-12"
          >
            {/* Barre de recherche */}
            <div className="mb-4 sm:mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Catégories */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base mb-2 sm:mb-3">Catégories</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-2 py-1 sm:px-3 md:px-4 sm:py-1.5 md:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                      state.filters.category === category.id
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tailles */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base mb-2 sm:mb-3">Tailles</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
                {sizes.map((size) => (
                  <motion.button
                    key={size.id}
                    onClick={() => handleSizeChange(size.id)}
                    className={`px-2 py-1 sm:px-3 md:px-4 sm:py-1.5 md:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                      state.filters.size === size.id
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {size.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Couleurs */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base mb-2 sm:mb-3">Couleurs</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
                {colors.map((color) => (
                  <motion.button
                    key={color.id}
                    onClick={() => handleColorChange(color.id)}
                    className={`px-2 py-1 sm:px-3 md:px-4 sm:py-1.5 md:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                      state.filters.color === color.id
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {color.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Grille de produits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            {filteredProducts.map((product, index) => (
              <AnimatedCard
                key={product.id}
                delay={0.1 * index}
                hover={true}
                clickable={true}
                className="group"
              >
                <Link to={`/produit/${product.id}`}>
                  <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-red-500/50 transition-colors">
                    <div className="relative aspect-square bg-gray-800 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.isNew && (
                        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-bold">
                          NOUVEAU
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="p-2.5 sm:p-3 md:p-4">
                      <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <span className="text-red-500 font-bold text-xs sm:text-sm md:text-base">
                          {formatCurrency(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-gray-500 line-through text-xs sm:text-sm">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.slice(0, 3).map((size) => (
                          <span
                            key={size}
                            className="bg-gray-800 text-gray-400 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded"
                          >
                            {size}
                          </span>
                        ))}
                        {product.sizes.length > 3 && (
                          <span className="bg-gray-800 text-gray-400 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                            +{product.sizes.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </motion.div>

          {/* Message si aucun produit */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-400 text-sm">Essayez de modifier vos filtres</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
