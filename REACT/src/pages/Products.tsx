import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header.tsx';
import ProductCard from '../components/products/ProductCard.tsx';
import { useProducts } from '../contexts/ProductContext.tsx';
import { supabase } from '../lib/supabase.ts';

interface Category {
  id: string;
  name: string;
}

const Products: React.FC = () => {
  const { state, filterByCategory, searchProducts, clearFilters, loadProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([{ id: 'all', name: 'Tous' }]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Recharger les produits si la liste est vide (au cas où la navigation ne déclenche pas le chargement)
  useEffect(() => {
    if (state.products.length === 0 && !state.isLoading) {
      loadProducts();
    }
  }, [state.products.length, state.isLoading, loadProducts]);

  // Charger les catégories depuis Supabase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Erreur lors du chargement des catégories:', error);
          // En cas d'erreur, utiliser les catégories par défaut
          setCategories([
            { id: 'all', name: 'Tous' },
            { id: 'T-shirts', name: 'T-Shirts' },
            { id: 'Vestes', name: 'Vestes' },
            { id: 'Pantalons', name: 'Pantalons' },
            { id: 'Chaussures', name: 'Chaussures' },
            { id: 'Accessoires', name: 'Accessoires' }
          ]);
        } else {
          // Ajouter "Tous" en premier, puis les catégories de la base de données
          const dbCategories = (data || []).map((cat: any) => ({
            id: cat.name, // Utiliser le nom comme ID pour le filtrage
            name: cat.name
          }));
          setCategories([
            { id: 'all', name: 'Tous' },
            ...dbCategories
          ]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        // En cas d'erreur, utiliser les catégories par défaut
        setCategories([
          { id: 'all', name: 'Tous' },
          { id: 'T-shirts', name: 'T-Shirts' },
          { id: 'Vestes', name: 'Vestes' },
          { id: 'Pantalons', name: 'Pantalons' },
          { id: 'Chaussures', name: 'Chaussures' },
          { id: 'Accessoires', name: 'Accessoires' }
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

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
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="section-padding">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-male-red mb-2 block">
              Collection
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
              NOS <span className="gradient-text">PRODUITS</span>
            </h1>
            <p className="text-gray-text text-sm max-w-2xl mx-auto">
              Découvrez notre collection streetwear exclusive
            </p>
          </motion.div>

          {/* Filtres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            {/* Barre de recherche */}
            <div className="mb-6">
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-offwhite border border-gray-200 rounded-full px-4 py-2.5 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange transition-colors text-sm"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Catégories */}
            <div className="mb-4">
              <h3 className="text-blacksoft font-semibold text-sm mb-3 text-center">Catégories</h3>
              {loadingCategories ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                        state.selectedCategory === category.id || (category.id === 'all' && !state.selectedCategory)
                          ? 'bg-gradient-karma text-white shadow-md'
                          : 'bg-offwhite text-gray-text hover:bg-gray-light border border-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton Effacer les filtres */}
            {(state.selectedCategory !== null && state.selectedCategory !== 'all') || searchQuery ? (
              <div className="text-center mt-4">
                <motion.button
                  onClick={handleClearFilters}
                  className="text-xs text-gray-text hover:text-male-red transition-colors underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Effacer les filtres
                </motion.button>
              </div>
            ) : null}
          </motion.div>

          {/* Grille de produits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {state.filteredProducts.map((product, index) => (
              <ProductCard
                key={product.product_id}
                product={product}
                delay={0.05 * index}
              />
            ))}
          </motion.div>

          {/* Message si aucun produit */}
          {state.filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 bg-offwhite rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-blacksoft font-semibold text-lg mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-text text-sm">Essayez de modifier vos filtres</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
