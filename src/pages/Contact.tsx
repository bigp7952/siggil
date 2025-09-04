import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header.tsx';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Main Content */}
      <section className="relative py-8 overflow-hidden bg-black sm:py-12 md:pb-16 lg:pb-20 xl:pb-24">
        <div className="px-4 mx-auto relative sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
            NOUS <span className="text-red-500">CONTACTER</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-4">
            Une question ? Un projet ? N'hésitez pas à nous contacter.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-900 p-4 sm:p-6 md:p-8 rounded-lg">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 md:mb-6">Envoyez-nous un message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-1 sm:mb-1.5 md:mb-2 text-xs sm:text-sm md:text-base">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors text-xs sm:text-sm md:text-base"
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-1 sm:mb-1.5 md:mb-2 text-xs sm:text-sm md:text-base">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors text-xs sm:text-sm md:text-base"
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-white font-medium mb-1 sm:mb-1.5 md:mb-2 text-xs sm:text-sm md:text-base">
                    Sujet
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-white focus:outline-none focus:border-red-500 transition-colors text-xs sm:text-sm md:text-base"
                    required
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="commande">Question sur une commande</option>
                    <option value="produit">Information produit</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-white font-medium mb-1 sm:mb-1.5 md:mb-2 text-xs sm:text-sm md:text-base">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors resize-none text-xs sm:text-sm md:text-base"
                    placeholder="Votre message..."
                    required
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 sm:py-3 md:py-4 rounded-lg transition-colors duration-300 text-xs sm:text-sm md:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ENVOYER LE MESSAGE
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Company Info */}
            <div className="bg-gray-900 p-4 sm:p-6 md:p-8 rounded-lg">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 md:mb-6">SIGGIL</h2>
              <div className="space-y-2 sm:space-y-3 md:space-y-4 text-gray-400 text-xs sm:text-sm md:text-base">
                <p>Marque de streetwear urbain</p>
                <p>Créée pour ceux qui osent être différents</p>
                <p>Qualité premium, style unique</p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-gray-900 p-4 sm:p-6 md:p-8 rounded-lg">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 md:mb-6">Informations de contact</h3>
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                  <div className="w-6 h-6 sm:w-8 md:w-10 sm:h-8 md:h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm md:text-base">📧</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-xs sm:text-sm md:text-base">Email</p>
                    <p className="text-gray-400 text-xs sm:text-sm md:text-base">contact@siggil.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                  <div className="w-6 h-6 sm:w-8 md:w-10 sm:h-8 md:h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm md:text-base">📱</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-xs sm:text-sm md:text-base">Téléphone</p>
                    <p className="text-gray-400 text-xs sm:text-sm md:text-base">+221 78 100 22 53</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                  <div className="w-6 h-6 sm:w-8 md:w-10 sm:h-8 md:h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm md:text-base">📍</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-xs sm:text-sm md:text-base">Adresse</p>
                    <p className="text-gray-400 text-xs sm:text-sm md:text-base">123 Avenue Léopold Sédar Senghor<br />Dakar, Sénégal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gray-900 p-4 sm:p-6 md:p-8 rounded-lg">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 md:mb-6">Suivez-nous</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-md mx-auto">
                {/* Instagram */}
                <motion.a
                  href="https://instagram.com/siggil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 sm:p-4 md:p-5 rounded-full backdrop-blur-lg border border-white/10 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-white/20 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-white/30 hover:bg-gradient-to-tr hover:from-white/10 hover:to-black/40 group relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  <div className="relative z-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 sm:w-6 md:w-7 sm:h-6 md:h-7 fill-current text-white group-hover:text-white/90 transition-colors duration-300"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </motion.a>

                {/* TikTok */}
                <motion.a
                  href="https://tiktok.com/@siggil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-full backdrop-blur-lg border border-red-500/20 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-red-500/30 hover:scale-110 hover:rotate-2 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-red-500/50 hover:bg-gradient-to-tr hover:from-red-500/10 hover:to-black/40 group relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  <div className="relative z-10">
                    <svg
                      className="w-7 h-7 fill-current text-red-500 group-hover:text-red-400 transition-colors duration-300"
                      viewBox="0 0 576 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
                    </svg>
                  </div>
                </motion.a>

                {/* Email */}
                <motion.a
                  href="mailto:contact@siggil.com"
                  className="p-5 rounded-full backdrop-blur-lg border border-green-500/20 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-green-500/30 hover:scale-110 hover:rotate-2 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-green-500/50 hover:bg-gradient-to-tr hover:from-green-500/10 hover:to-black/40 group relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  <div className="relative z-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-7 h-7 text-green-500 fill-current group-hover:text-green-400 transition-colors duration-300"
                    >
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                </motion.a>

                {/* WhatsApp */}
                <motion.a
                  href="https://wa.me/221771234567"
                  className="p-5 rounded-full backdrop-blur-lg border border-indigo-500/20 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-110 hover:-rotate-2 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-indigo-500/50 hover:bg-gradient-to-tr hover:from-indigo-500/10 hover:to-black/40 group relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  <div className="relative z-10">
                    <svg
                      className="w-7 h-7 fill-current text-indigo-500 group-hover:text-indigo-400 transition-colors duration-300"
                      viewBox="0 0 640 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                  </div>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.section
          className="mt-8 sm:mt-12 md:mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
              QUESTIONS <span className="text-red-500">FRÉQUENTES</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {[
              {
                question: "Comment suivre ma commande ?",
                answer: "Vous recevrez un email de confirmation avec un numéro de suivi dès l'expédition de votre commande."
              },
              {
                question: "Quels sont les délais de livraison ?",
                answer: "Les délais de livraison varient entre 1-3 jours ouvrés à Dakar et 3-7 jours pour les autres villes du Sénégal."
              },
              {
                question: "Puis-je retourner un article ?",
                answer: "Oui, vous disposez de 30 jours pour retourner un article dans son état d'origine."
              },
              {
                question: "Comment fonctionne le programme VIP ?",
                answer: "Le programme VIP offre des avantages exclusifs : accès prioritaire, réductions spéciales et livraison gratuite."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gray-900 p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-white font-bold text-lg mb-3">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
