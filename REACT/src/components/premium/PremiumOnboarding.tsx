import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface PremiumOnboardingProps {
  onComplete: () => void;
}

const PremiumOnboarding: React.FC<PremiumOnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Produits Quasi Gratuits',
      description: 'Tous les produits premium sont à prix réduit, vous ne payez que la livraison !',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Une Seule Commande',
      description: 'Votre code d\'accès est valable pour une seule commande premium. Profitez-en bien !',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: 'Livraison Rapide',
      description: 'Livraison rapide et sécurisée partout au Sénégal.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff6c00]/5 via-white to-[#ff6c00]/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="card-modern p-6 md:p-8 text-center">
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 md:w-24 md:h-24 bg-gradient-karma rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </motion.div>

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-display font-bold mb-3"
          >
            Bienvenue dans <span className="gradient-text">Premium</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-text text-sm md:text-base mb-8"
          >
            Découvrez notre collection exclusive avec des avantages exceptionnels
          </motion.p>

          {/* Features */}
          <div className="space-y-4 md:space-y-6 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-offwhite rounded-lg"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-karma/10 rounded-lg flex items-center justify-center text-[#ff6c00]">
                  {feature.icon}
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-blacksoft mb-1 text-sm md:text-base">
                    {feature.title}
                  </h3>
                  <p className="text-gray-text text-xs md:text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-[#ff6c00]/10 border border-[#ff6c00]/20 rounded-lg p-4 mb-6"
          >
            <p className="text-xs md:text-sm text-blacksoft font-medium">
              <span className="font-bold text-[#ff6c00]">Important :</span> Votre code d'accès est valable pour une seule commande. 
              Une fois votre commande passée, vous devrez faire une nouvelle demande pour accéder à nouveau au Premium.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={onComplete}
              className="btn-primary text-sm md:text-base py-3 px-8"
            >
              Découvrir les produits Premium
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary text-sm md:text-base py-3 px-8"
            >
              Retour à l'accueil
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumOnboarding;


