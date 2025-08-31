import React from 'react';
import { motion } from 'framer-motion';
import { useSupabaseMigration } from '../../hooks/useSupabaseMigration.ts';

const SupabaseStatus: React.FC = () => {
  const { isConnected, isMigrating, migrationProgress, error, checkConnection } = useSupabaseMigration();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 shadow-lg max-w-sm">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-white font-medium">
            {isConnected ? 'Supabase Connecté' : 'Supabase Non Connecté'}
          </span>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {isMigrating && (
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Migration en cours...</span>
              <span>{migrationProgress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                className="bg-red-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${migrationProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={checkConnection}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            Tester
          </button>
          
          {!isConnected && (
            <a
              href="/README-SUPABASE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition-colors"
            >
              Configurer
            </a>
          )}
        </div>

        <div className="mt-2 text-xs text-gray-500">
          {isConnected 
            ? 'Toutes les fonctionnalités Supabase sont disponibles'
            : 'Configurez Supabase pour activer les fonctionnalités avancées'
          }
        </div>
      </div>
    </motion.div>
  );
};

export default SupabaseStatus;
