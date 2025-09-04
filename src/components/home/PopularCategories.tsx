import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getActiveCategories } from '../../services/categoryService.ts';
import { Category } from '../../services/categoryService.ts';

const PopularCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Timeout de 10 secondes pour éviter le blocage
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout: Chargement trop long')), 10000);
        });
        
        const categoriesPromise = getActiveCategories();
        
        const activeCategories = await Promise.race([categoriesPromise, timeoutPromise]) as Category[];
        
        console.log('✅ Catégories chargées:', activeCategories.length);
        setCategories(activeCategories);
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement des catégories:', error);
        setError(error instanceof Error ? error.message : 'Erreur inconnue');
        
        // Fallback: catégories par défaut
        setCategories([
          { id: 1, name: 'Vêtements', color: '#3B82F6', is_active: true, sort_order: 1, product_count: 0 },
          { id: 2, name: 'Chaussures', color: '#10B981', is_active: true, sort_order: 2, product_count: 0 },
          { id: 3, name: 'Accessoires', color: '#F59E0B', is_active: true, sort_order: 3, product_count: 0 },
          { id: 4, name: 'Sport', color: '#EF4444', is_active: true, sort_order: 4, product_count: 0 },
          { id: 5, name: 'Électronique', color: '#8B5CF6', is_active: true, sort_order: 5, product_count: 0 },
          { id: 6, name: 'Maison', color: '#06B6D4', is_active: true, sort_order: 6, product_count: 0 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Catégories <span className="text-red-500">Populaires</span>
            </h2>
            <p className="text-gray-400">
              Découvrez nos collections les plus appréciées
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-800 rounded-lg h-32 mb-3"></div>
                <div className="bg-gray-800 rounded h-4 mb-2"></div>
                <div className="bg-gray-800 rounded h-3 w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && categories.length === 0) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Catégories <span className="text-red-500">Populaires</span>
          </h2>
          <p className="text-red-400 mb-4">
            Erreur de chargement: {error}
          </p>
          <p className="text-gray-400 mb-8">
            Affichage des catégories par défaut
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Catégories <span className="text-red-500">Populaires</span>
          </h2>
          <p className="text-gray-400">
            Découvrez nos collections les plus appréciées
          </p>
          {error && (
            <p className="text-yellow-400 text-sm mt-2">
              ⚠️ Données de fallback (erreur: {error})
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Link to={`/produits?category=${encodeURIComponent(category.name)}`}>
                <div 
                  className="relative h-32 rounded-lg mb-3 overflow-hidden"
                  style={{ backgroundColor: category.color }}
                >
                  {category.image_data ? (
                    <img
                      src={`data:image/jpeg;base64,${category.image_data}`}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-all duration-300"></div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-1">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-400 text-sm line-clamp-2">{category.description}</p>
                  )}
                  {category.product_count > 0 && (
                    <p className="text-gray-500 text-xs mt-1">{category.product_count} produits</p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link 
            to="/produits" 
            className="inline-block bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
          >
            Voir toutes les catégories
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularCategories;
