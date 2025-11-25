import React, { useState, useEffect } from 'react';
import { useProducts } from '../../contexts/ProductContext.tsx';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../products/ProductCard.tsx';

interface PopularProduct {
  id: string;
  product_id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  is_new: boolean;
  is_active: boolean;
  stock: number;
  order_count?: number;
  total_quantity_ordered?: number;
  total_revenue?: number;
  created_at: string;
  image_data?: string;
  image_url?: string;
  sizes?: string[];
  colors?: string[];
}

const FeaturedProducts: React.FC = () => {
  const { state } = useProducts();
  const { products, isLoading } = state;
  const [featuredProducts, setFeaturedProducts] = useState<PopularProduct[]>([]);

  // Mettre à jour les produits en vedette quand les produits sont chargés
  useEffect(() => {
    if (products && products.length > 0) {
      const activeProducts = products
        .filter(p => p.is_active !== false && !p.is_premium) // Exclure les produits premium
        .slice(0, 8);
      
      setFeaturedProducts(activeProducts);
    } else if (products && products.length === 0 && !isLoading) {
      setFeaturedProducts([]);
    }
  }, [products, isLoading]);

  if (isLoading) {
    return (
      <section className="section-padding bg-offwhite py-16 lg:py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="skeleton h-8 w-64 mx-auto mb-4 rounded"></div>
            <div className="skeleton h-5 w-96 mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="skeleton aspect-square rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-offwhite py-16 lg:py-24">
      <div className="container-custom">
        {/* Section Header - Improved spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-male-red mb-4 block">
            Best Sellers
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-blacksoft">Produits</span>{' '}
            <span className="gradient-text">en Vedette</span>
          </h2>
          <p className="text-gray-text text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Les produits les plus commandés par notre communauté
          </p>
        </motion.div>

        {/* Products Grid - Better spacing */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.product_id}
                product={{
                  ...product,
                  sizes: product.sizes || [],
                  colors: product.colors || [],
                }}
                delay={index * 0.08}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-text text-lg mb-6 font-medium">Aucun produit disponible pour le moment</p>
            <Link to="/produits" className="btn-primary text-sm px-8 py-4 font-bold uppercase tracking-wider">
              Voir tous les produits
            </Link>
          </div>
        )}

        {/* View All Button - Larger and more prominent */}
        {featuredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Link 
              to="/produits" 
              className="btn-primary inline-flex items-center gap-3 text-sm px-8 py-4 font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all"
            >
              Voir tous les produits
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
