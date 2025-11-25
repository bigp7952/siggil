import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { path: '/produits', label: 'Produits' },
    { path: '/premium', label: 'Premium' },
    { path: '/contact', label: 'Contact' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const handleCartOpen = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigate('/panier', { replace: false });
  };

  const handleAuthOpen = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigate('/auth', { state: { returnTo: location.pathname }, replace: false });
  };

  return (
    <>
      {/* Top Bar - Minimal like Mushei */}
      <div className="hidden md:block bg-offwhite border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between py-2 text-xs text-gray-text">
            <p>Livraison gratuite à Dakar • Retours sous 30 jours</p>
            <div className="flex items-center space-x-4">
              <Link to="/aide" className="hover:text-blacksoft transition-colors">Aide</Link>
              <Link to="/suivi-commande" className="hover:text-blacksoft transition-colors">Suivi</Link>
              {user && (
                <Link to="/mes-commandes" className="hover:text-blacksoft transition-colors">Mes commandes</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Clean & Minimal */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <img 
                  src="/logo.png" 
                  alt="SIGGIL" 
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-lg font-display font-bold text-blacksoft hidden sm:block">
                  SIGGIL
                </span>
              </Link>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium uppercase tracking-wider transition-colors ${
                    location.pathname === item.path 
                      ? 'text-male-red' 
                      : 'text-gray-text hover:text-blacksoft'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Search */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Rechercher"
                className="p-2 text-gray-text hover:text-blacksoft transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cart Button */}
              <button
                type="button"
                onClick={handleCartOpen}
                aria-label={`Panier (${cartState.itemCount} article${cartState.itemCount > 1 ? 's' : ''})`}
                className="relative p-2 text-gray-text hover:text-blacksoft transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-male-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartState.itemCount}
                  </span>
                )}
              </button>

              {/* Auth Button */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-1.5 rounded border border-gray-200 hover:border-gray-300 transition-all">
                    <div className="w-7 h-7 bg-gradient-karma rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-blacksoft hidden lg:block">
                      {user.firstName}
                    </span>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <div className="px-3 py-2 border-b border-gray-200">
                        <p className="text-blacksoft text-sm font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-gray-text text-xs">{user.phoneNumber}</p>
                      </div>
                      <Link
                        to="/mes-commandes"
                        className="block px-3 py-2 text-sm text-gray-text hover:text-blacksoft hover:bg-offwhite transition-colors"
                      >
                        Mes Commandes
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-gray-text hover:text-blacksoft hover:bg-offwhite transition-colors"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAuthOpen();
                  }}
                  className="btn-primary text-xs px-4 py-2"
                >
                  Se connecter
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                type="button"
                onClick={handleCartOpen}
                aria-label={`Panier (${cartState.itemCount} article${cartState.itemCount > 1 ? 's' : ''})`}
                className="relative p-2 text-blacksoft"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-male-red text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartState.itemCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={toggleMobileMenu}
                className="text-blacksoft p-2"
                aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <div className="w-5 h-5 flex flex-col justify-center items-center space-y-1">
                  <motion.span
                    className="w-5 h-0.5 bg-blacksoft block"
                    animate={isMobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="w-5 h-0.5 bg-blacksoft block"
                    animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="w-5 h-0.5 bg-blacksoft block"
                    animate={isMobileMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <nav className="container-custom py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
                      location.pathname === item.path 
                        ? 'text-male-red border-l-2 border-male-red pl-3' 
                        : 'text-gray-text hover:text-blacksoft pl-3'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {user ? (
                  <>
                    <Link
                      to="/mes-commandes"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 text-sm font-medium uppercase tracking-wider text-gray-text hover:text-blacksoft pl-3"
                    >
                      Mes Commandes
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 text-sm font-medium uppercase tracking-wider text-gray-text hover:text-blacksoft pl-3"
                    >
                      Se déconnecter
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAuthOpen();
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn-primary text-xs px-4 py-2 mt-2 ml-3"
                  >
                    Se connecter
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="hidden md:block border-t border-gray-200 bg-white"
            >
              <div className="container-custom py-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    className="w-full bg-offwhite border border-gray-200 rounded px-4 py-2 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange transition-colors"
                    autoFocus
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-blacksoft">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
