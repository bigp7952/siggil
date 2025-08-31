import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header.tsx';

const Premium: React.FC = () => {
  const [step, setStep] = useState<'locked' | 'form' | 'submitted'>('locked');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    instagram: '',
    tiktok: '',
    proof1: null as File | null,
    proof2: null as File | null,
    proof3: null as File | null,
    proof4: null as File | null,
    proof5: null as File | null,
    proof6: null as File | null,
  });

  const handleFileChange = (field: keyof typeof formData, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('submitted');
  };

  const accessConditions = [
    {
      platform: 'Instagram',
      requirements: [
        'S\'abonner à 3 comptes SIGGIL',
        'Liker 10 posts sur chaque compte',
        'Commenter "leppsixela" sur 3 posts différents',
        'Capturer les preuves d\'abonnement'
      ],
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.059-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      platform: 'TikTok',
      requirements: [
        'S\'abonner à 3 comptes SIGGIL',
        'Liker 10 vidéos sur chaque compte',
        'Commenter "leppsixela" sur 3 vidéos différentes',
        'Capturer les preuves d\'abonnement'
      ],
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      )
    }
  ];



  if (step === 'locked') {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        
        <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12"
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-12 sm:h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                ZONE <span className="text-red-500">PREMIUM</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                Accès exclusif aux articles gratuits pour nos plus fidèles supporters
              </p>
            </motion.div>

            {/* Conditions d'accès */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12 sm:mb-16"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center">Conditions d'accès</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {accessConditions.map((platform, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                        {platform.icon}
                      </div>
                      <h3 className="text-white font-bold text-lg sm:text-xl">{platform.platform}</h3>
                    </div>
                    <ul className="space-y-2 sm:space-y-3">
                      {platform.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start space-x-2 sm:space-x-3">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                          <span className="text-gray-400 text-sm sm:text-base">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Avantages Premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-red-500/10 to-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-800 mb-12 sm:mb-16"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Avantages Premium</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-base sm:text-lg mb-1.5 sm:mb-2">Articles Gratuits</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Tous les articles sont gratuits, vous payez seulement la livraison</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-base sm:text-lg mb-1.5 sm:mb-2">Accès Exclusif</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Collection réservée aux vrais supporters de la marque</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-base sm:text-lg mb-1.5 sm:mb-2">Accès Unique</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Une commande = déconnexion, nouveau code requis</p>
                </div>
              </div>
            </motion.div>

            {/* Bouton de demande */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <button
                onClick={() => setStep('form')}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-200 shadow-lg shadow-red-500/25 text-sm sm:text-base"
              >
                Demander l'accès Premium
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        
        <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                DEMANDE <span className="text-red-500">D'ACCÈS</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                Remplissez le formulaire et fournissez les preuves d'abonnement
              </p>
            </motion.div>

            {/* Formulaire */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-800"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                  <label className="block text-white font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors text-sm sm:text-base"
                    placeholder="Votre nom complet"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Numéro WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors text-sm sm:text-base"
                    placeholder="Ex: 77 123 45 67"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Compte Instagram</label>
                  <input
                    type="text"
                    required
                    value={formData.instagram}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors text-sm sm:text-base"
                    placeholder="@votre_compte"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Compte TikTok</label>
                  <input
                    type="text"
                    required
                    value={formData.tiktok}
                    onChange={(e) => setFormData(prev => ({ ...prev, tiktok: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors text-sm sm:text-base"
                    placeholder="@votre_compte"
                  />
                </div>
              </div>

              {/* Upload des preuves */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Preuves d'abonnement (captures d'écran)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { field: 'proof1', label: 'Preuve Instagram 1' },
                    { field: 'proof2', label: 'Preuve Instagram 2' },
                    { field: 'proof3', label: 'Preuve Instagram 3' },
                    { field: 'proof4', label: 'Preuve TikTok 1' },
                    { field: 'proof5', label: 'Preuve TikTok 2' },
                    { field: 'proof6', label: 'Preuve TikTok 3' }
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <label className="block text-white font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">{label}</label>
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => handleFileChange(field as keyof typeof formData, e.target.files?.[0] || null)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-red-500 file:text-white hover:file:bg-red-600 transition-colors text-sm sm:text-base"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditions */}
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
                <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Conditions importantes :</h4>
                <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
                  <li>• Vous devez être abonné à 3 comptes SIGGIL sur chaque plateforme</li>
                  <li>• Vous devez avoir liké 10 posts/vidéos sur chaque compte</li>
                  <li>• Vous devez avoir commenté "leppsixela" sur 3 posts/vidéos différents</li>
                  <li>• Les captures d'écran doivent être claires et complètes</li>
                  <li>• L'analyse peut prendre 24-48h</li>
                  <li>• Le code d'accès sera envoyé par WhatsApp</li>
                </ul>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-200 shadow-lg shadow-red-500/25 text-sm sm:text-base"
                >
                  Soumettre la demande
                </button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'submitted') {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        
        <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-12 sm:h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                DEMANDE <span className="text-green-500">ENVOYÉE</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-6 sm:mb-8">
                Votre demande d'accès Premium a été soumise avec succès. Notre équipe va analyser vos preuves d'abonnement et vous contactera par WhatsApp dans les 24-48h avec votre code d'accès.
              </p>
              <button
                onClick={() => setStep('locked')}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
              >
                Retour à la page Premium
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Premium;
