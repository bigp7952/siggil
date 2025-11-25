import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase.ts';
import { formatImageSrc, handleImageError } from '../../utils/imageUtils.ts';

interface Category {
  id: number | string;
  name: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  product_count: number;
  description?: string;
  image_data?: string;
}

const PopularCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modern color palette for categories - Karma & MaleFashion inspired
  const categoryColors = useMemo(() => [
    'linear-gradient(135deg, #ffba00 0%, #ff6c00 100%)',
    'linear-gradient(135deg, #e53637 0%, #c41e1f 100%)',
    'linear-gradient(135deg, #ff6c00 0%, #ffba00 100%)',
    'linear-gradient(135deg, #ffba00 0%, #e53637 100%)',
    'linear-gradient(135deg, #e53637 0%, #ff6c00 100%)',
    'linear-gradient(135deg, #ff6c00 0%, #e53637 100%)',
  ], []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        console.log('Chargement des catégories depuis Supabase...');
        
        // Charger les catégories depuis Supabase
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (categoriesError) {
          console.error('Erreur Supabase categories:', categoriesError);
          throw categoriesError;
        }

        // Charger les produits pour compter le nombre de produits par catégorie
        const { data: productsData } = await supabase
          .from('products')
          .select('category')
          .eq('is_active', true);

        // Mapper les catégories avec le nombre de produits
        const mappedCategories: Category[] = (categoriesData || []).map((cat: any, index: number) => {
          const productCount = (productsData || []).filter((p: any) => p.category === cat.name).length;
          
          // L'image sera formatée par formatImageSrc, on garde les données brutes
          const imageData = cat.image_data || null;
          
          // Log pour déboguer
          if (imageData) {
            console.log(`Catégorie ${cat.name}:`, {
              hasImage: true,
              length: imageData.length,
              startsWith: imageData.substring(0, 30),
              isDataUrl: imageData.startsWith('data:'),
              isUrl: imageData.startsWith('http'),
            });
          } else {
            console.log(`Catégorie ${cat.name}: pas d'image`);
          }
          
          return {
            id: cat.id,
            name: cat.name,
            color: cat.color || categoryColors[index % categoryColors.length],
            is_active: cat.is_active !== false,
            sort_order: cat.sort_order || index + 1,
            product_count: productCount,
            description: cat.description || undefined,
            image_data: imageData || undefined,
          };
        });

        console.log('Catégories chargées:', mappedCategories.length);
        
        // Afficher uniquement les catégories de la base de données
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        // En cas d'erreur, ne rien afficher (tableau vide)
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [categoryColors]);

  if (loading) {
    return (
      <section className="section-padding bg-white py-16 lg:py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="skeleton h-8 w-64 mx-auto mb-4 rounded"></div>
            <div className="skeleton h-5 w-96 mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="skeleton aspect-square rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-white py-16 lg:py-24 relative" style={{ marginTop: '-1px' }}>
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
            Explorez
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-blacksoft">Catégories</span>{' '}
            <span className="gradient-text">Populaires</span>
          </h2>
          <p className="text-gray-text text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Découvrez nos collections les plus appréciées par la communauté SIGGIL
          </p>
        </motion.div>

        {/* Categories - Scroll horizontal sur mobile, grid sur desktop */}
        <div className="mb-12">
          {/* Mobile: Scroll horizontal automatique */}
          <div className="lg:hidden overflow-hidden">
            <div 
              className="flex gap-4 pb-4" 
              style={{
                animation: 'scroll 30s linear infinite',
                width: 'max-content'
              }}
            >
              {/* Dupliquer les catégories pour un défilement infini */}
              {[...categories, ...categories].map((category, index) => (
                <motion.div
                  key={`${category.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  className="group flex-shrink-0"
                  style={{ width: '140px' }}
                >
                  <Link to={`/produits?category=${encodeURIComponent(category.name)}`}>
                    <div className="relative aspect-square rounded-xl overflow-hidden product-card shadow-md hover:shadow-lg transition-all duration-300" style={{ height: '140px' }}>
                      {/* Image Background */}
                      {category.image_data ? (
                    <div className="absolute inset-0">
                      <img
                        src={formatImageSrc(null, category.image_data)}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error('Erreur chargement image catégorie:', category.name);
                          handleImageError(e);
                          // En cas d'erreur, utiliser le gradient
                          const img = e.currentTarget;
                          const parent = img.parentElement;
                          if (parent && img.src.includes('/back.jpg')) {
                            img.style.display = 'none';
                            const gradientDiv = document.createElement('div');
                            gradientDiv.className = 'absolute inset-0 transition-transform duration-500 group-hover:scale-110';
                            gradientDiv.style.background = category.color;
                            const overlay = document.createElement('div');
                            overlay.className = 'absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors';
                            gradientDiv.appendChild(overlay);
                            parent.appendChild(gradientDiv);
                          }
                        }}
                        onLoad={() => {
                          console.log('Image chargée avec succès pour:', category.name);
                        }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 group-hover:to-black/30 transition-colors"></div>
                    </div>
                  ) : (
                    <div
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                      style={{ background: category.color }}
                    >
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                    </div>
                  )}

                      {/* Content - Mobile: Plus compact */}
                      <div className="relative h-full flex flex-col items-center justify-center p-3 text-center z-10">
                        {!category.image_data && (
                          <div className="w-12 h-12 mb-2 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-sm">
                            <span className="text-2xl font-bold text-white">
                              {category.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        
                        <h3 className="text-white font-display font-bold text-xs mb-1 group-hover:text-white transition-colors drop-shadow-lg line-clamp-2">
                          {category.name}
                        </h3>
                        
                        {category.product_count > 0 && (
                          <p className="text-white/90 text-[10px] font-medium drop-shadow-md">
                            {category.product_count}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid normal */}
          <div className="hidden lg:grid grid-cols-6 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Link to={`/produits?category=${encodeURIComponent(category.name)}`}>
                  <div className="relative aspect-square rounded-2xl overflow-hidden product-card shadow-lg hover:shadow-2xl transition-all duration-300">
                    {/* Image Background */}
                    {category.image_data ? (
                      <div className="absolute inset-0">
                        <img
                          src={formatImageSrc(null, category.image_data)}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            console.error('Erreur chargement image catégorie:', category.name);
                            handleImageError(e);
                            const img = e.currentTarget;
                            const parent = img.parentElement;
                            if (parent && img.src.includes('/back.jpg')) {
                              img.style.display = 'none';
                              const gradientDiv = document.createElement('div');
                              gradientDiv.className = 'absolute inset-0 transition-transform duration-500 group-hover:scale-110';
                              gradientDiv.style.background = category.color;
                              const overlay = document.createElement('div');
                              overlay.className = 'absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors';
                              gradientDiv.appendChild(overlay);
                              parent.appendChild(gradientDiv);
                            }
                          }}
                          onLoad={() => {
                            console.log('Image chargée avec succès pour:', category.name);
                          }}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 group-hover:to-black/30 transition-colors"></div>
                      </div>
                    ) : (
                      <div
                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                        style={{ background: category.color }}
                      >
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                      </div>
                    )}

                    {/* Content - Desktop: Taille normale */}
                    <div className="relative h-full flex flex-col items-center justify-center p-6 text-center z-10">
                      {!category.image_data && (
                        <div className="w-20 h-20 mb-4 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-sm">
                          <span className="text-4xl font-bold text-white">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      <h3 className="text-white font-display font-bold text-base sm:text-lg mb-2 group-hover:text-white transition-colors drop-shadow-lg">
                        {category.name}
                      </h3>
                      
                      {category.product_count > 0 && (
                        <p className="text-white/90 text-sm font-medium drop-shadow-md">
                          {category.product_count} {category.product_count === 1 ? 'produit' : 'produits'}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button - Larger and more prominent */}
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
            Voir toutes les catégories
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularCategories;
