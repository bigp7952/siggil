import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getPopularProducts, PopularProduct } from '../../services/popularProductsService.ts';
import { useFavorites } from '../../contexts/FavoritesContext.tsx';
import { useCart } from '../../contexts/CartContext.tsx';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<PopularProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Timeout de 10 secondes pour éviter le blocage
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout: Chargement trop long')), 10000);
        });
        
        const productsPromise = getPopularProducts(8);
        
        const featuredProducts = await Promise.race([productsPromise, timeoutPromise]) as PopularProduct[];
        
        console.log('✅ Produits populaires chargés:', featuredProducts.length);
        setProducts(featuredProducts);
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement des produits populaires:', error);
        setError(error instanceof Error ? error.message : 'Erreur inconnue');
        
        // Fallback: produits par défaut
        setProducts([
          {
            id: '1',
            product_id: 'prod1',
            name: 'T-shirt SIGGIL Premium',
            category: 'Vêtements',
            price: 5000,
            original_price: 6000,
            is_new: true,
            is_active: true,
            stock: 10,
            order_count: 15,
            total_quantity_ordered: 25,
            total_revenue: 125000,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            product_id: 'prod2',
            name: 'Casquette SIGGIL',
            category: 'Accessoires',
            price: 3000,
            is_new: false,
            is_active: true,
            stock: 20,
            order_count: 12,
            total_quantity_ordered: 18,
            total_revenue: 54000,
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            product_id: 'prod3',
            name: 'Sneakers SIGGIL Sport',
            category: 'Chaussures',
            price: 15000,
            original_price: 18000,
            is_new: true,
            is_active: true,
            stock: 8,
            order_count: 8,
            total_quantity_ordered: 12,
            total_revenue: 180000,
            created_at: new Date().toISOString()
          },
          {
            id: '4',
            product_id: 'prod4',
            name: 'Sac SIGGIL Urban',
            category: 'Accessoires',
            price: 8000,
            is_new: false,
            is_active: true,
            stock: 15,
            order_count: 6,
            total_quantity_ordered: 9,
            total_revenue: 72000,
            created_at: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const handleFavoriteToggle = (product: PopularProduct) => {
    if (isFavorite(product.product_id)) {
      removeFavorite(product.product_id);
    } else {
      addFavorite(product.product_id);
    }
  };

  const handleAddToCart = (product: PopularProduct) => {
    addToCart({
      id: product.product_id,
      name: product.name,
      price: product.price,
      image: product.image_data || product.image_url || '',
      category: product.category,
      quantity: 1
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Produits en Vedette</h2>
            <p className="text-gray-400">Les produits les plus commandés par nos clients</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="bg-gray-700 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-700 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && products.length === 0) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Produits en Vedette</h2>
          <p className="text-red-400 mb-4">
            Erreur de chargement: {error}
          </p>
          <p className="text-gray-400 mb-8">Affichage des produits par défaut</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Produits en Vedette</h2>
          <p className="text-gray-400">Les produits les plus commandés par nos clients</p>
          {error && (
            <p className="text-yellow-400 text-sm mt-2">
              ⚠️ Données de fallback (erreur: {error})
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative">
                {/* Image du produit */}
                <div className="h-48 bg-gray-700 relative overflow-hidden">
                  {product.image_data ? (
                    <img
                      src={`data:image/jpeg;base64,${product.image_data}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800">
                      <span className="text-4xl font-bold text-gray-400">
                        {product.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Badge Nouveau */}
                  {product.is_new && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Nouveau
                    </div>
                  )}

                  {/* Badge Réduction */}
                  {product.original_price && product.original_price > product.price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                    </div>
                  )}

                  {/* Bouton Favori */}
                  <button
                    onClick={() => handleFavoriteToggle(product)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
                    style={{ 
                      right: product.original_price && product.original_price > product.price ? '3.5rem' : '0.5rem'
                    }}
                  >
                    {isFavorite(product.product_id) ? (
                      <span className="text-red-500">❤️</span>
                    ) : (
                      <span>🤍</span>
                    )}
                  </button>
                </div>


              </div>

              <div className="p-4">
                {/* Nom et catégorie */}
                <div className="mb-2">
                  <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{product.category}</p>
                </div>

                {/* Prix */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-white font-bold text-lg">
                    {product.price.toLocaleString()} FCFA
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-gray-400 line-through text-sm">
                      {product.original_price.toLocaleString()} FCFA
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div className="mb-3">
                  <span className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture de stock'}
                  </span>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
                  </button>
                  <Link
                    to={`/produit/${product.product_id}`}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Voir
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link 
            to="/produits" 
            className="inline-block bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg transition-colors font-semibold text-lg"
          >
            Voir tous les produits
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
