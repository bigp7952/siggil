import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext.tsx';

const AdminHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminLogout, isAdminAuthenticated } = useAdmin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/admin/products', label: 'Produits', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { path: '/admin/orders', label: 'Commandes', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { path: '/admin/categories', label: 'Catégories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    { path: '/admin/premium-products', label: 'Produits Premium', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    { path: '/admin/premium', label: 'Demandes Premium', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  ];

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isAdminAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-offwhite border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between py-2 text-xs text-gray-text">
            <p>Panneau d'administration SIGGIL</p>
            <div className="flex items-center space-x-4">
              <Link to="/" className="hover:text-blacksoft transition-colors">Retour au site</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/admin/dashboard" className="flex items-center group">
                <img 
                  src="/logo.png" 
                  alt="SIGGIL Admin" 
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-lg font-display font-bold text-blacksoft hidden sm:block">
                  SIGGIL <span className="text-male-red">Admin</span>
                </span>
              </Link>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path 
                      ? 'bg-male-red/10 text-male-red' 
                      : 'text-gray-text hover:text-blacksoft hover:bg-offwhite'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Actions Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                type="button"
                onClick={handleLogout}
                className="btn-secondary text-xs px-4 py-2"
                aria-label="Se déconnecter"
              >
                Déconnexion
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="text-blacksoft p-2"
                aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <div className="w-5 h-5 flex flex-col justify-center items-center space-y-1">
                  <span
                    className={`w-5 h-0.5 bg-blacksoft block transition-transform duration-150 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}
                  />
                  <span
                    className={`w-5 h-0.5 bg-blacksoft block transition-opacity duration-150 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                  />
                  <span
                    className={`w-5 h-0.5 bg-blacksoft block transition-transform duration-150 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden bg-white border-t border-gray-200 transition-all duration-200 ease-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
              <nav className="container-custom py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.path 
                        ? 'bg-male-red/10 text-male-red' 
                        : 'text-gray-text hover:text-blacksoft hover:bg-offwhite'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span>{item.label}</span>
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-gray-text hover:text-blacksoft hover:bg-offwhite transition-colors"
                  aria-label="Se déconnecter"
                >
                  Déconnexion
                </button>
              </nav>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;

