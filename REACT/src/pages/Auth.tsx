import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.tsx';
import Header from '../components/common/Header.tsx';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, register, isLoading, error, clearError, setError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
  });

  const ADMIN_PHONE = '221781002253';
  const ADMIN_PASSWORD = 'siggilepsixella2025';

  useEffect(() => {
    if (user) {
      const returnTo = location.state?.returnTo || '/';
      navigate(returnTo);
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    let success = false;
    
    if (isLogin) {
      if (formData.phoneNumber.replaceAll(/\D/g, '') === ADMIN_PHONE) {
        setIsAdminMode(true);
        return;
      }
      success = await login(formData.phoneNumber);
    } else {
      success = await register(formData);
    }

    if (success) {
      const returnTo = location.state?.returnTo || '/';
      navigate(returnTo);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (adminPassword === ADMIN_PASSWORD) {
      navigate('/admin/dashboard');
    } else {
      setError('Mot de passe administrateur incorrect');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setIsAdminMode(false);
    setAdminPassword('');
    clearError();
    setFormData({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
    });
  };

  const handleBackToNormal = () => {
    setIsAdminMode(false);
    setAdminPassword('');
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-offwhite via-white to-gray-light">
      <Header />
      
      <div className="section-padding py-12 lg:py-20">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Side - Visual/Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  {/* Decorative Elements */}
                  <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-karma opacity-10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-male-red opacity-5 rounded-full blur-3xl"></div>
                  
                  <div className="relative card-modern p-10 bg-gradient-to-br from-karma-yellow/5 to-karma-orange/5 border-2 border-karma-yellow/20">
                    <div className="space-y-8">
                      <div>
                        <div className="w-20 h-20 bg-gradient-karma rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-blacksoft mb-3">
                          Bienvenue sur <span className="gradient-text">SIGGIL</span>
                        </h2>
                        <p className="text-gray-text text-base leading-relaxed">
                          Rejoignez notre communauté de passionnés de mode. Accédez à des collections exclusives, 
                          suivez vos commandes et profitez d'avantages réservés aux membres.
                        </p>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-gray-200">
                        {[
                          {
                            icon: (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ),
                            title: 'Paiement sécurisé',
                            desc: 'Transactions 100% sécurisées'
                          },
                          {
                            icon: (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            ),
                            title: 'Données protégées',
                            desc: 'Vos informations sont en sécurité'
                          },
                          {
                            icon: (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            ),
                            title: 'Accès rapide',
                            desc: 'Connexion en quelques secondes'
                          }
                        ].map((feature) => (
                          <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex items-start space-x-4"
                          >
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-karma-orange shadow-sm flex-shrink-0">
                              {feature.icon}
                            </div>
                            <div>
                              <h3 className="text-blacksoft font-semibold text-sm mb-1">{feature.title}</h3>
                              <p className="text-gray-text text-xs">{feature.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <div className="card-modern p-8 lg:p-10 bg-white shadow-xl">
                  {/* Header */}
                  <motion.div 
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-16 h-16 bg-gradient-karma rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-blacksoft mb-2">
                      {(() => {
                        if (isAdminMode) {
                          return (
                            <span className="bg-gradient-to-r from-karma-yellow to-karma-orange bg-clip-text text-transparent">
                              ADMIN
                            </span>
                          );
                        }
                        if (isLogin) return 'CONNEXION';
                        return 'INSCRIPTION';
                      })()}
                    </h1>
                    <p className="text-gray-text text-sm">
                      {(() => {
                        if (isAdminMode) return 'Accès au panneau d\'administration';
                        if (isLogin) return 'Connectez-vous à votre compte SIGGIL';
                        return 'Créez votre compte SIGGIL';
                      })()}
                    </p>
                  </motion.div>

                  {/* Form */}
                  <form onSubmit={isAdminMode ? handleAdminLogin : handleSubmit} className="space-y-5">
                    <AnimatePresence mode="wait">
                      {isAdminMode && (
                        <motion.div
                          key="admin-fields"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-5"
                        >
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4">
                            <div className="flex items-center mb-2">
                              <div className="w-10 h-10 bg-gradient-karma rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-yellow-800 font-bold text-sm block">Mode Administrateur</span>
                                <span className="text-yellow-600 text-xs">Accès sécurisé requis</span>
                              </div>
                            </div>
                            <p className="text-yellow-700 text-xs mt-2 leading-relaxed">
                              Numéro admin détecté. Veuillez entrer le mot de passe d'administration pour accéder au dashboard.
                            </p>
                          </div>
                          <div>
                            <label htmlFor="admin-password" className="block text-xs font-semibold text-blacksoft mb-2 uppercase tracking-wide">
                              Mot de passe administrateur
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                              <input
                                id="admin-password"
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="w-full bg-offwhite border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange focus:ring-2 focus:ring-karma-orange/20 transition-all text-sm font-medium"
                                placeholder="Entrez le mot de passe"
                                required
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {!isLogin && !isAdminMode && (
                        <motion.div
                          key="register-fields"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-5"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="firstName" className="block text-xs font-semibold text-blacksoft mb-2 uppercase tracking-wide">
                                Prénom
                              </label>
                              <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full bg-offwhite border-2 border-gray-200 rounded-xl px-4 py-3.5 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange focus:ring-2 focus:ring-karma-orange/20 transition-all text-sm font-medium"
                                placeholder="Votre prénom"
                                required={!isLogin}
                              />
                            </div>
                            <div>
                              <label htmlFor="lastName" className="block text-xs font-semibold text-blacksoft mb-2 uppercase tracking-wide">
                                Nom
                              </label>
                              <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full bg-offwhite border-2 border-gray-200 rounded-xl px-4 py-3.5 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange focus:ring-2 focus:ring-karma-orange/20 transition-all text-sm font-medium"
                                placeholder="Votre nom"
                                required={!isLogin}
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="address" className="block text-xs font-semibold text-blacksoft mb-2 uppercase tracking-wide">
                              Adresse complète
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                              <input
                                id="address"
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full bg-offwhite border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange focus:ring-2 focus:ring-karma-orange/20 transition-all text-sm font-medium"
                                placeholder="Votre adresse de livraison"
                                required={!isLogin}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <label htmlFor="phoneNumber" className="block text-xs font-semibold text-blacksoft mb-2 uppercase tracking-wide">
                        Numéro WhatsApp
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full bg-offwhite border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange focus:ring-2 focus:ring-karma-orange/20 transition-all text-sm font-medium"
                          placeholder="+221 77 123 45 67"
                          required
                        />
                      </div>
                      <p className="text-gray-text text-xs mt-2">
                        Nous utiliserons ce numéro pour vous contacter et vous envoyer les notifications
                      </p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div 
                          className="bg-red-50 border-2 border-red-200 rounded-xl p-4"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-600 text-sm font-medium">{error}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-bold uppercase tracking-wider shadow-lg ${
                        isAdminMode 
                          ? 'bg-gradient-to-r from-karma-yellow to-karma-orange hover:from-karma-orange hover:to-karma-yellow text-white' 
                          : 'btn-primary'
                      }`}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Traitement en cours...
                        </div>
                      ) : (() => {
                        if (isAdminMode) return 'Accéder au dashboard';
                        if (isLogin) return 'Se connecter';
                        return 'Créer mon compte';
                      })()}
                    </motion.button>
                  </form>

                  {/* Toggle Mode */}
                  <motion.div 
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {isAdminMode ? (
                      <button
                        onClick={handleBackToNormal}
                        className="text-karma-orange hover:text-karma-yellow text-sm font-semibold transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Retour à la connexion normale</span>
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <button
                          onClick={handleToggleMode}
                          className="text-male-red hover:text-male-red/80 text-sm font-semibold transition-colors"
                        >
                          {(() => {
                            if (isLogin) return 'Pas encore de compte ? S\'inscrire';
                            return 'Déjà un compte ? Se connecter';
                          })()}
                        </button>
                        <div className="pt-3 border-t border-gray-200">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/');
                            }}
                            className="text-gray-text hover:text-male-red text-xs transition-colors flex items-center justify-center space-x-2 mx-auto"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Retour à l'accueil</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
