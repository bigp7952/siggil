import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.tsx';
import Header from '../components/common/Header.tsx';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, register, isLoading, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
  });

  // Rediriger si déjà connecté
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
      success = await login(formData.phoneNumber);
    } else {
      success = await register(formData);
    }

    if (success) {
      const returnTo = location.state?.returnTo || '/';
      navigate(returnTo);
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
    clearError();
    setFormData({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-black to-black pointer-events-none"></div>
      
      <div className="relative pt-16 pb-12 px-4 sm:pt-20 md:pt-24">
        <div className="container mx-auto max-w-sm sm:max-w-md">
          {/* Header */}
          <motion.div 
            className="text-center mb-6 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              {isLogin ? 'CONNEXION' : 'INSCRIPTION'}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {isLogin 
                ? 'Connectez-vous à votre compte SIGGIL' 
                : 'Créez votre compte SIGGIL'
              }
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div 
            className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-800/50 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="register-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                          Prénom
                        </label>
                        <input
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all duration-200 text-sm sm:text-base"
                          placeholder="Prénom"
                          required={!isLogin}
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                          Nom
                        </label>
                        <input
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all duration-200 text-sm sm:text-base"
                          placeholder="Nom"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Adresse
                      </label>
                      <input
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all duration-200 text-sm sm:text-base"
                        placeholder="Votre adresse"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                  Numéro WhatsApp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all duration-200 text-sm sm:text-base"
                    placeholder="+221 77 123 45 67"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 sm:p-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-400 text-xs sm:text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 sm:py-4 px-4 rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm sm:text-base shadow-lg hover:shadow-xl hover:shadow-red-500/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                    Chargement...
                  </div>
                ) : (
                  isLogin ? 'Se connecter' : 'S\'inscrire'
                )}
              </motion.button>
            </form>

            {/* Toggle Mode */}
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button
                onClick={handleToggleMode}
                className="text-red-500 hover:text-red-400 text-xs sm:text-sm font-medium transition-colors duration-200"
              >
                {isLogin ? 'Pas de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
              </button>
            </motion.div>

            {/* Back to Home */}
            <motion.div 
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-200 flex items-center justify-center mx-auto"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour à l'accueil
              </button>
            </motion.div>
          </motion.div>

          {/* Additional Info */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-gray-500 text-xs sm:text-sm">
              En continuant, vous acceptez nos{' '}
              <button className="text-red-500 hover:text-red-400 underline">conditions d'utilisation</button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
