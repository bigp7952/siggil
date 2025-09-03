import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header.tsx';
import AnimatedText from '../components/common/AnimatedText.tsx';
import ProductCard from '../components/products/ProductCard.tsx';
import { useProducts } from '../contexts/ProductContext.tsx';

const Products: React.FC = () => {
  const { state, filterByCategory, searchProducts, clearFilters } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'T-shirts', name: 'T-Shirts' },
    { id: 'Vestes', name: 'Vestes' },
    { id: 'Pantalons', name: 'Pantalons' },
    { id: 'Chaussures', name: 'Chaussures' },
    { id: 'Accessoires', name: 'Accessoires' }
  ];



  const handleCategoryChange = async (category: string) => {
    await filterByCategory(category);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    await searchProducts(query);
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchQuery('');
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
                      state.selectedCategory === category.id
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

            {/* Bouton Effacer les filtres */}
            <div className="mb-4 sm:mb-6">
              <motion.button
                onClick={handleClearFilters}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Effacer les filtres
              </motion.button>
            </div>
          </motion.div>

          {/* Grille de produits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            {state.filteredProducts.map((product, index) => (
              <ProductCard
                key={product.product_id}
                product={product}
                delay={0.1 * index}
              />
            ))}
          </motion.div>

          {/* Message si aucun produit */}
          {state.filteredProducts.length === 0 && (
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
