import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero.tsx';
import PopularCategories from '../components/home/PopularCategories.tsx';
import FeaturedProducts from '../components/home/FeaturedProducts.tsx';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Categories Section */}
      <PopularCategories />

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Benefits Section - Clean & Minimal */}
      <motion.section 
        className="section-padding bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                ), 
                title: 'Livraison Gratuite', 
                desc: 'Livraison gratuite à Dakar' 
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ), 
                title: 'Retours Faciles', 
                desc: '30 jours pour changer d\'avis' 
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ), 
                title: 'Paiement Sécurisé', 
                desc: 'Paiement 100% sécurisé' 
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ), 
                title: 'Support 24/7', 
                desc: 'Assistance client disponible' 
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="card-modern text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-lg bg-gradient-karma text-white group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-blacksoft font-display font-semibold text-base mb-1 group-hover:text-male-red transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-text text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Newsletter Section - Clean */}
      <motion.section 
        className="section-padding bg-offwhite"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container-custom text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-male-red mb-2 block">
            Newsletter
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
            RESTEZ <span className="gradient-text">CONNECTÉ</span>
          </h2>
          <p className="text-gray-text text-sm mb-6 max-w-xl mx-auto">
            Soyez les premiers informés des nouvelles collections et offres exclusives
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 bg-white border border-gray-200 rounded px-4 py-2.5 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange transition-colors text-sm"
              />
              <motion.button
                className="btn-primary whitespace-nowrap text-xs px-6 py-2.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                S'ABONNER
              </motion.button>
            </div>
            <p className="text-gray-medium text-xs mt-3">
              En vous abonnant, vous acceptez de recevoir nos newsletters
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer - Clean & Minimal */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center mb-4">
                <img className="w-7 h-7 mr-2" src="/logo.png" alt="SIGGIL" />
                <span className="text-blacksoft font-display font-bold text-lg">SIGGIL</span>
              </div>
              <p className="text-gray-text text-sm mb-4 leading-relaxed">
                La marque de streetwear urbain qui définit le style de demain.
              </p>
              <div className="flex space-x-3">
                {[
                  { name: 'Twitter', href: 'https://twitter.com/siggil', icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' },
                  { name: 'Instagram', href: 'https://instagram.com/siggil', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-offwhite border border-gray-200 text-gray-text hover:text-male-red hover:border-male-red transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-blacksoft font-display font-semibold text-sm mb-4 uppercase tracking-wider">LIENS RAPIDES</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Tous les produits', path: '/produits' },
                  { label: 'Collection Premium', path: '/premium' },
                  { label: 'Contact', path: '/contact' },
                  { label: 'À propos', path: '/contact' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-text hover:text-male-red transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-blacksoft font-display font-semibold text-sm mb-4 uppercase tracking-wider">SERVICE CLIENT</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Aide & FAQ', path: '/aide' },
                  { label: 'Livraison', path: '/livraison' },
                  { label: 'Retours', path: '/retours' },
                  { label: 'Taille guide', path: '/taille-guide' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-text hover:text-male-red transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-blacksoft font-display font-semibold text-sm mb-4 uppercase tracking-wider">CONTACT</h3>
              <div className="space-y-3 text-sm text-gray-text">
                {[
                  { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', text: 'Dakar, Sénégal' },
                  { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: '+221 78 100 22 53' },
                  { icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: 'contact@siggil.com' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-male-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-text text-xs mb-3 md:mb-0">
                © 2024 SIGGIL. Tous droits réservés.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { label: 'Mentions légales', path: '/contact' },
                  { label: 'Politique de confidentialité', path: '/contact' },
                  { label: 'CGV', path: '/contact' },
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-gray-text hover:text-male-red transition-colors text-xs"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
