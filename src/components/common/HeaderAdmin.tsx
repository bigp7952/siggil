import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderAdmin: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Rediriger vers la page de connexion admin
    navigate('/admin/login');
  };

  const handleBackToDashboard = () => {
    // Retourner au dashboard admin
    navigate('/admin/dashboard');
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-red-500">SIGGIL</h1>
            <span className="text-gray-400">Administration</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToDashboard}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
