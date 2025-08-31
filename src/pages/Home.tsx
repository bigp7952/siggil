import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero.tsx';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Categories Section */}
      <motion.section 
        className="py-8 md:py-16 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
              CATÉGORIES <span className="text-red-500">POPULAIRES</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto px-4">
              Explorez nos collections les plus demandées
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[
              { name: 'T-Shirts', image: '/back.jpg', count: '24 produits', path: '/produits' },
              { name: 'Hoodies', image: '/back.jpg', count: '18 produits', path: '/produits' },
              { name: 'Pantalons', image: '/back.jpg', count: '12 produits', path: '/produits' },
              { name: 'Accessoires', image: '/back.jpg', count: '8 produits', path: '/produits' }
            ].map((category, index) => (
              <motion.div
                key={index}
                className="group cursor-pointer"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={category.path}>
                  <div className="relative overflow-hidden rounded-lg bg-gray-800">
                    <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4">
                        <h3 className="text-white font-bold text-sm md:text-lg mb-1">{category.name}</h3>
                        <p className="text-gray-300 text-xs md:text-sm">{category.count}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <motion.section 
        className="py-8 md:py-16 px-4 bg-gray-900/50"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
              PRODUITS <span className="text-red-500">EN VEDETTE</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto px-4">
              Nos articles les plus populaires du moment
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {[
              { name: 'SIGGIL Classic T-Shirt', price: '19 500', originalPrice: '25 000', image: '/back.jpg', discount: '22%' },
              { name: 'SIGGIL Premium Hoodie', price: '45 000', originalPrice: '60 000', image: '/back.jpg', discount: '25%' },
              { name: 'SIGGIL Urban Jacket', price: '75 000', originalPrice: '90 000', image: '/back.jpg', discount: '17%' },
              { name: 'SIGGIL Street Cap', price: '12 000', originalPrice: '15 000', image: '/back.jpg', discount: '20%' }
            ].map((product, index) => (
              <motion.div
                key={index}
                className="group cursor-pointer"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/produit/${index + 1}`}>
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="relative aspect-square bg-gradient-to-br from-gray-700 to-gray-800">
                      {product.discount && (
                        <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-red-500 text-white text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                          -{product.discount}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="text-white font-semibold text-xs md:text-sm mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-1 md:gap-2">
                        <span className="text-red-500 font-bold text-sm md:text-lg">{product.price} CFA</span>
                        <span className="text-gray-500 line-through text-xs md:text-sm">{product.originalPrice} CFA</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8 md:mt-12">
            <Link to="/produits">
              <motion.button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 md:py-2.5 px-4 md:px-6 rounded-lg transition-colors duration-300 text-xs md:text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                VOIR TOUS LES PRODUITS
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        className="py-8 md:py-16 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[
              { 
                icon: (
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                ), 
                title: 'Livraison Gratuite', 
                desc: 'Livraison gratuite à Dakar' 
              },
              { 
                icon: (
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ), 
                title: 'Retours Faciles', 
                desc: '30 jours pour changer d\'avis' 
              },
              { 
                icon: (
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ), 
                title: 'Paiement Sécurisé', 
                desc: 'Paiement 100% sécurisé' 
              },
              { 
                icon: (
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ), 
                title: 'Support 24/7', 
                desc: 'Assistance client disponible' 
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-3 md:mb-4">{benefit.icon}</div>
                <h3 className="text-white font-bold text-sm md:text-lg mb-1 md:mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-xs md:text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section 
        className="py-8 md:py-16 px-4 bg-gradient-to-r from-red-500/10 to-gray-900"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
            RESTEZ <span className="text-red-500">CONNECTÉ</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Soyez les premiers informés des nouvelles collections et offres exclusives
          </p>
          
          <div className="max-w-md mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 text-xs md:text-sm"
              />
              <motion.button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 md:py-2.5 px-3 md:px-4 rounded-lg transition-colors duration-300 text-xs md:text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                S'ABONNER
              </motion.button>
            </div>
            <p className="text-gray-500 text-xs mt-3">
              En vous abonnant, vous acceptez de recevoir nos newsletters
            </p>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center mb-3 md:mb-4">
                <img className="w-6 h-6 md:w-8 md:h-8 mr-2" src="/logo.png" alt="SIGGIL" />
                <span className="text-white font-bold text-lg md:text-xl">SIGGIL</span>
              </div>
              <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4">
                La marque de streetwear urbain qui définit le style de demain.
              </p>
              <div className="flex space-x-3 md:space-x-4">
                <a href="https://twitter.com/siggil" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="https://pinterest.com/siggil" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a href="https://instagram.com/siggil" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold text-sm md:text-lg mb-3 md:mb-4">LIENS RAPIDES</h3>
              <ul className="space-y-1 md:space-y-2">
                <li><Link to="/produits" className="text-gray-400 hover:text-red-500 transition-colors text-xs md:text-sm">Tous les produits</Link></li>
                <li><Link to="/premium" className="text-gray-400 hover:text-red-500 transition-colors text-xs md:text-sm">Collection Premium</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-red-500 transition-colors text-xs md:text-sm">Contact</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-red-500 transition-colors text-xs md:text-sm">À propos</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-white font-bold text-sm md:text-lg mb-3 md:mb-4">SERVICE CLIENT</h3>
              <ul className="space-y-1 md:space-y-2">
                <li><Link to="/aide" className="text-gray-400 hover:text-red-500 transition-colors text-xs md:text-sm">Aide & FAQ</Link></li>
                <li><Link to="/livraison" className="text-gray-400 hover:text-red-500 transition-colors text-xs md:text-sm">Livraison</Link></li>
                <li><Link to="/retours" className="text-gray-400 hover:text-red-500 transition-colors text-xs md:text-sm">Retours</Link></li>
                <li><Link to="/taille-guide" className="text-gray-400 hover:text-red-500 transition-colors text-xs md:text-sm">Taille guide</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-bold text-sm md:text-lg mb-3 md:mb-4">CONTACT</h3>
              <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Dakar, Sénégal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+221 77 123 45 67</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>contact@siggil.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Lun-Sam: 9h-18h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 SIGGIL. Tous droits réservés.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/contact" className="text-gray-400 hover:text-red-500 transition-colors text-sm">Mentions légales</Link>
                <Link to="/contact" className="text-gray-400 hover:text-red-500 transition-colors text-sm">Politique de confidentialité</Link>
                <Link to="/contact" className="text-gray-400 hover:text-red-500 transition-colors text-sm">CGV</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
