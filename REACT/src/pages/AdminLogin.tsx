import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext.tsx';

const AdminLogin: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { adminLogin, state, isAdminAuthenticated } = useAdmin();
  const navigate = useNavigate();

  // Rediriger automatiquement si l'admin est déjà connecté (session persistante)
  useEffect(() => {
    if (isAdminAuthenticated) {
      console.log('Session admin détectée, redirection vers le dashboard');
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  // Vérifier la session au chargement de la page
  useEffect(() => {
    const checkSession = () => {
      const savedAdmin = localStorage.getItem('siggil_admin');
      if (savedAdmin && !isAdminAuthenticated) {
        // La session existe mais n'est pas encore chargée dans le contexte
        // Le contexte va la charger automatiquement
        console.log('Session admin trouvée dans localStorage, restauration en cours...');
      }
    };
    checkSession();
  }, [isAdminAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminLogin(phoneNumber, adminPassword);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card-modern p-4 md:p-8">
          {/* Logo */}
          <div className="text-center mb-6 md:mb-8">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-karma rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-male-red mb-1 md:mb-2 block">
              Admin
            </span>
            <h1 className="text-xl md:text-2xl font-display font-bold text-blacksoft mb-1 md:mb-2">
              SIGGIL <span className="gradient-text">ADMIN</span>
            </h1>
            <p className="text-gray-text text-xs md:text-sm">
              Accès administrateur
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {/* Numéro de téléphone admin */}
            <div>
              <label htmlFor="phoneNumber" className="block text-xs md:text-sm font-medium text-blacksoft mb-1 md:mb-2">
                Numéro de téléphone
              </label>
              <div className="relative">
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange transition-colors"
                  placeholder="+221 78 100 22 53"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Mot de passe admin */}
            <div>
              <label htmlFor="adminPassword" className="block text-xs md:text-sm font-medium text-blacksoft mb-1 md:mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="adminPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange transition-colors pr-10 md:pr-12"
                  placeholder="Mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-medium hover:text-blacksoft transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Message d'erreur */}
            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 md:p-3">
                <p className="text-red-600 text-xs md:text-sm">{state.error}</p>
              </div>
            )}

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={state.isLoading}
              className="w-full btn-primary text-[10px] md:text-xs py-2 md:py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all"
            >
              {state.isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white mr-2"></div>
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Retour à l'accueil */}
          <div className="mt-4 md:mt-6 text-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="text-gray-text hover:text-male-red text-[10px] md:text-xs transition-colors flex items-center justify-center mx-auto"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
