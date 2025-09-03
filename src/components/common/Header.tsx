import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleCartOpen = () => {
    navigate('/panier');
  };

  const handleAuthOpen = () => {
    navigate('/auth', { state: { returnTo: location.pathname } });
  };

  return (
    <>
      <header className="py-3 sm:py-4 bg-black sticky top-0 z-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="shrink-0">
              <Link to="/" title="SIGGIL" className="flex">
                <img className="w-auto h-7 sm:h-9" src="/logo.png" alt="SIGGIL" />
              </Link>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex ml-10 mr-auto space-x-8 lg:ml-20 lg:space-x-12 items-center justify-start">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm lg:text-base font-normal transition-all duration-200 hover:text-white ${
                    location.pathname === item.path ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions Desktop */}
            <div className="hidden md:flex items-center space-x-4">

              {/* Cart Button */}
              <div className="relative inline-flex group">
                <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-red-500 to-red-600 group-hover:shadow-lg group-hover:shadow-red-500/50"></div>
                <button
                  onClick={handleCartOpen}
                  className="relative inline-flex items-center justify-center px-4 sm:px-6 py-2 text-sm sm:text-base font-normal text-white bg-black border border-transparent rounded-full hover:scale-105 active:scale-95 transition-transform"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartState.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                      {cartState.itemCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Auth Button */}
              {user ? (
                <div className="relative group">
                  <button
                    className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors hover:scale-105 active:scale-95"
                  >
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                    <span className="hidden lg:block text-sm">
                      {user.firstName}
                    </span>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-800">
                        <p className="text-white text-sm font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-gray-400 text-xs">{user.phoneNumber}</p>
                      </div>
                      <Link
                        to="/mes-commandes"
                        className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                      >
                        Mes Commandes
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAuthOpen}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  Se connecter
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-3">
              {/* Cart Button Mobile */}
              <button
                onClick={handleCartOpen}
                className="relative p-2 text-white active:scale-95 transition-transform"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartState.itemCount}
                  </span>
                )}
              </button>

              {/* Auth Button Mobile */}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="p-2 text-white active:scale-95 transition-transform"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleAuthOpen}
                  className="p-2 text-white active:scale-95 transition-transform"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              )}

              {/* Hamburger Menu */}
              <button
                onClick={toggleMobileMenu}
                className="text-white p-1 active:scale-95 transition-transform"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`w-5 h-0.5 bg-white block mb-1 transition-all duration-200 ${
                      isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                    }`}
                  />
                  <span
                    className={`w-5 h-0.5 bg-white block mb-1 transition-all duration-200 ${
                      isMobileMenuOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`w-5 h-0.5 bg-white block transition-all duration-200 ${
                      isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md-hidden bg-gray-900 border-t border-gray-800"
          >
              <nav className="px-4 py-4 space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 text-base font-medium transition-colors ${
                      location.pathname === item.path 
                        ? 'text-red-500' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Lien vers Mes Commandes pour utilisateurs connectés */}
                {user && (
                  <Link
                    to="/mes-commandes"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 text-base font-medium transition-colors ${
                      location.pathname === '/mes-commandes' 
                        ? 'text-red-500' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Mes Commandes
                  </Link>
                )}
              </nav>
            </div>
          )}
      </header>
      

    </>
  );
};

export default Header;
