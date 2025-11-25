import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header.tsx';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', formData);
    setSubmitSuccess(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      content: 'contact@siggil.com',
      link: 'mailto:contact@siggil.com',
      description: 'Envoyez-nous un email'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Téléphone',
      content: '+221 78 100 22 53',
      link: 'tel:+221781002253',
      description: 'Lun - Sam: 9h - 18h'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Adresse',
      content: 'Dakar, Sénégal',
      link: '#',
      description: 'Zone industrielle'
    }
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/siggil',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/221781002253',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      )
    },
    {
      name: 'TikTok',
      href: 'https://tiktok.com/@siggil',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-offwhite to-gray-light">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-male-red mb-2 sm:mb-3 block">
              Contactez-nous
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-display font-bold mb-3 sm:mb-4">
              NOUS <span className="gradient-text">CONTACTER</span>
            </h1>
            <p className="text-gray-text text-xs sm:text-sm lg:text-base max-w-2xl mx-auto">
              Une question ? Un projet ? Notre équipe est là pour vous accompagner. N'hésitez pas à nous écrire.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-0">
        <div className="w-full h-48 sm:h-64 lg:h-80 xl:h-96 bg-gray-200 relative overflow-hidden">
          <iframe
            title="Localisation SIGGIL à Dakar, Sénégal"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.5!2d-17.4677!3d14.7167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDQzJzAwLjEiTiAxN8KwMjgnMDMuNyJX!5e0!3m2!1sfr!2ssn!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          />
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding py-6 sm:py-8 lg:py-12">
        <div className="container-custom px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* About Section */}
              <div className="card-modern p-4 sm:p-5 lg:p-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-blacksoft mb-3 sm:mb-4">À propos de SIGGIL</h2>
                <p className="text-gray-text text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  SIGGIL est une marque de streetwear urbain créée pour ceux qui osent être différents. 
                  Nous proposons des vêtements de qualité premium avec un style unique qui reflète l'identité 
                  de la jeunesse sénégalaise.
                </p>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center text-gray-text">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-male-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Qualité premium garantie
                  </div>
                  <div className="flex items-center text-gray-text">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-male-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Style unique et authentique
                  </div>
                  <div className="flex items-center text-gray-text">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-male-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Fabriqué à Dakar
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="card-modern p-4 sm:p-5 lg:p-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-display font-bold text-blacksoft mb-4 sm:mb-6">Informations de contact</h3>
                <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-3 sm:space-x-4 group"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-karma rounded-lg flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                        {info.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-blacksoft font-semibold text-sm sm:text-base mb-1">{info.title}</h4>
                        <a
                          href={info.link}
                          className="text-male-red hover:text-male-red/80 text-xs sm:text-sm font-medium block mb-0.5 sm:mb-1 transition-colors break-all"
                        >
                          {info.content}
                        </a>
                        <p className="text-gray-text text-[10px] sm:text-xs">{info.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="card-modern p-4 sm:p-5 lg:p-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-display font-bold text-blacksoft mb-3 sm:mb-4">Suivez-nous</h3>
                <p className="text-gray-text text-xs sm:text-sm mb-3 sm:mb-4">
                  Restez connecté avec nous sur les réseaux sociaux
                </p>
                <div className="flex space-x-2 sm:space-x-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg bg-offwhite border border-gray-200 text-gray-text hover:text-male-red hover:border-male-red transition-all hover:scale-110"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Business Hours */}
              <div className="card-modern p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-karma-yellow/10 to-karma-orange/10">
                <h3 className="text-base sm:text-lg lg:text-xl font-display font-bold text-blacksoft mb-3 sm:mb-4">Horaires d'ouverture</h3>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-text">Lundi - Vendredi</span>
                    <span className="text-blacksoft font-medium">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-text">Samedi</span>
                    <span className="text-blacksoft font-medium">9h00 - 16h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-text">Dimanche</span>
                    <span className="text-blacksoft font-medium">Fermé</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="card-modern p-4 sm:p-5 lg:p-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-blacksoft mb-2">Envoyez-nous un message</h2>
                <p className="text-gray-text text-xs sm:text-sm mb-4 sm:mb-6">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </p>
                
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-green-700 text-xs sm:text-sm font-medium">Message envoyé avec succès !</p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="name" className="block text-blacksoft font-medium mb-1.5 sm:mb-2 text-xs sm:text-sm">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange focus:ring-2 focus:ring-karma-orange/20 transition-all text-xs sm:text-sm"
                        placeholder="Votre nom"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-blacksoft font-medium mb-1.5 sm:mb-2 text-xs sm:text-sm">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange focus:ring-2 focus:ring-karma-orange/20 transition-all text-xs sm:text-sm"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-blacksoft font-medium mb-1.5 sm:mb-2 text-xs sm:text-sm">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange focus:ring-2 focus:ring-karma-orange/20 transition-all text-xs sm:text-sm"
                      placeholder="+221 77 123 45 67"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-blacksoft font-medium mb-1.5 sm:mb-2 text-xs sm:text-sm">
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-blacksoft focus:outline-none focus:border-karma-orange focus:ring-2 focus:ring-karma-orange/20 transition-all text-xs sm:text-sm"
                      required
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="commande">Question sur une commande</option>
                      <option value="produit">Information produit</option>
                      <option value="collaboration">Collaboration / Partenariat</option>
                      <option value="retour">Retour / Échange</option>
                      <option value="livraison">Question livraison</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-blacksoft font-medium mb-1.5 sm:mb-2 text-xs sm:text-sm">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange focus:ring-2 focus:ring-karma-orange/20 transition-all resize-none text-xs sm:text-sm"
                      placeholder="Votre message..."
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary text-xs sm:text-sm py-2.5 sm:py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                        <span className="text-xs sm:text-sm">Envoi en cours...</span>
                      </div>
                    ) : (
                      'ENVOYER LE MESSAGE'
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.section
            className="mt-8 sm:mt-12 lg:mt-16 xl:mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-male-red mb-2 block">
                FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-3 sm:mb-4">
                QUESTIONS <span className="gradient-text">FRÉQUENTES</span>
              </h2>
              <p className="text-gray-text text-xs sm:text-sm max-w-2xl mx-auto">
                Trouvez rapidement les réponses aux questions les plus courantes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  question: "Comment suivre ma commande ?",
                  answer: "Vous recevrez un email de confirmation avec un numéro de suivi dès l'expédition de votre commande. Vous pouvez également consulter vos commandes dans la section 'Mes Commandes' de votre compte."
                },
                {
                  question: "Quels sont les délais de livraison ?",
                  answer: "Les délais de livraison varient entre 1-3 jours ouvrés à Dakar et 3-7 jours pour les autres villes du Sénégal. La livraison est gratuite à Dakar."
                },
                {
                  question: "Puis-je retourner un article ?",
                  answer: "Oui, vous disposez de 30 jours pour retourner un article dans son état d'origine. Contactez notre service client pour initier le processus de retour."
                },
                {
                  question: "Comment fonctionne le programme Premium ?",
                  answer: "Le programme Premium offre des avantages exclusifs : accès prioritaire aux nouvelles collections, réductions spéciales et livraison gratuite. Consultez la page Premium pour plus d'informations."
                },
                {
                  question: "Quels modes de paiement acceptez-vous ?",
                  answer: "Nous acceptons Wave, Orange Money, Free Money et le paiement à la livraison. Tous les paiements sont 100% sécurisés."
                },
                {
                  question: "Comment contacter le service client ?",
                  answer: "Vous pouvez nous contacter par téléphone au +221 78 100 22 53, par email à contact@siggil.com, via WhatsApp ou en remplissant le formulaire de contact ci-dessus."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="card-modern p-4 sm:p-5 hover:border-male-red transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-blacksoft font-semibold text-sm sm:text-base mb-1.5 sm:mb-2 flex items-start">
                    <span className="text-male-red mr-2 text-base sm:text-lg flex-shrink-0">•</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-gray-text text-xs sm:text-sm leading-relaxed pl-4 sm:pl-5">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </section>
    </div>
  );
};

export default Contact;
