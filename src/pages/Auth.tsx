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

  // Numéro admin prédéfini
  const ADMIN_PHONE = '221781002253';
  const ADMIN_PASSWORD = 'siggilepsixella2025';

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
      // Vérifier si c'est le numéro admin
      if (formData.phoneNumber.replace(/\D/g, '') === ADMIN_PHONE) {
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
      // Rediriger vers le dashboard admin
      navigate('/admin/dashboard');
    } else {
      // Afficher une erreur
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
              {isAdminMode ? 'ADMIN' : (isLogin ? 'CONNEXION' : 'INSCRIPTION')}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {isAdminMode 
                ? 'Accès au panneau d\'administration' 
                : (isLogin 
                  ? 'Connectez-vous à votre compte SIGGIL' 
                  : 'Créez votre compte SIGGIL'
                )
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
            <form onSubmit={isAdminMode ? handleAdminLogin : handleSubmit} className="space-y-4 sm:space-y-6">
              <AnimatePresence mode="wait">
                {isAdminMode && (
                  <motion.div
                    key="admin-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-yellow-400 font-medium">Mode Administrateur</span>
                      </div>
                      <p className="text-yellow-300 text-sm">
                        Numéro admin détecté. Veuillez entrer le mot de passe d'administration.
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Mot de passe administrateur
                      </label>
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all duration-200 text-sm sm:text-base"
                        placeholder="Mot de passe admin"
                        required
                      />
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
                className={`w-full py-3 sm:py-4 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 ${
                  isAdminMode 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 hover:shadow-yellow-500/25' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-red-500/25'
                } text-white`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                    Chargement...
                  </div>
                ) : (
                  isAdminMode ? 'Accéder au dashboard' : (isLogin ? 'Se connecter' : 'S\'inscrire')
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
              {isAdminMode ? (
                <button
                  onClick={handleBackToNormal}
                  className="text-yellow-500 hover:text-yellow-400 text-xs sm:text-sm font-medium transition-colors duration-200"
                >
                  Retour à la connexion normale
                </button>
              ) : (
                <button
                  onClick={handleToggleMode}
                  className="text-red-500 hover:text-red-400 text-xs sm:text-sm font-medium transition-colors duration-200"
                >
                  {isLogin ? 'Pas de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
                </button>
              )}
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
