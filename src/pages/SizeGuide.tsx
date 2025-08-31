import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header.tsx';

const SizeGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('tshirts');

  const categories = [
    { id: 'tshirts', name: 'T-Shirts', icon: '👕' },
    { id: 'hoodies', name: 'Hoodies', icon: '🧥' },
    { id: 'pants', name: 'Pantalons', icon: '👖' },
    { id: 'shoes', name: 'Chaussures', icon: '👟' }
  ];

  const sizeTables = {
    tshirts: {
      headers: ['Taille', 'Poitrine (cm)', 'Longueur (cm)', 'Épaules (cm)'],
      data: [
        ['XS', '88-92', '64', '42'],
        ['S', '92-96', '66', '44'],
        ['M', '96-100', '68', '46'],
        ['L', '100-104', '70', '48'],
        ['XL', '104-108', '72', '50'],
        ['XXL', '108-112', '74', '52']
      ]
    },
    hoodies: {
      headers: ['Taille', 'Poitrine (cm)', 'Longueur (cm)', 'Manches (cm)'],
      data: [
        ['S', '96-100', '68', '58'],
        ['M', '100-104', '70', '60'],
        ['L', '104-108', '72', '62'],
        ['XL', '108-112', '74', '64'],
        ['XXL', '112-116', '76', '66']
      ]
    },
    pants: {
      headers: ['Taille', 'Tour de taille (cm)', 'Tour de hanches (cm)', 'Longueur (cm)'],
      data: [
        ['28', '71-76', '91-96', '102'],
        ['30', '76-81', '96-101', '102'],
        ['32', '81-86', '101-106', '104'],
        ['34', '86-91', '106-111', '104'],
        ['36', '91-96', '111-116', '106'],
        ['38', '96-101', '116-121', '106']
      ]
    },
    shoes: {
      headers: ['Taille EU', 'Taille US', 'Taille UK', 'Longueur (cm)'],
      data: [
        ['39', '6', '5.5', '25'],
        ['40', '7', '6.5', '25.5'],
        ['41', '8', '7.5', '26'],
        ['42', '9', '8.5', '26.5'],
        ['43', '10', '9.5', '27'],
        ['44', '11', '10.5', '27.5'],
        ['45', '12', '11.5', '28']
      ]
    }
  };

  const measuringTips = [
    {
      title: 'Tour de poitrine',
      description: 'Mesurez autour de la partie la plus large de votre poitrine',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Tour de taille',
      description: 'Mesurez autour de votre taille naturelle',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Tour de hanches',
      description: 'Mesurez autour de la partie la plus large de vos hanches',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Longueur des jambes',
      description: 'Mesurez de la taille jusqu\'à la cheville',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const fitGuide = [
    {
      fit: 'Regular Fit',
      description: 'Coupe classique, confortable et adaptée à tous les styles',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      fit: 'Oversized Fit',
      description: 'Coupe ample et décontractée pour un look streetwear',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      fit: 'Slim Fit',
      description: 'Coupe ajustée pour un look moderne et élégant',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              GUIDE DES <span className="text-red-500">TAILLES</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Trouvez la taille parfaite pour un ajustement optimal
            </p>
          </motion.div>

          {/* Catégories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-2xl mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tableau des tailles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      {sizeTables[selectedCategory as keyof typeof sizeTables].headers.map((header, index) => (
                        <th key={index} className="px-6 py-4 text-left text-white font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeTables[selectedCategory as keyof typeof sizeTables].data.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4 text-gray-300">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Conseils de mesure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Comment mesurer ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {measuringTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-800"
                >
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                      {tip.icon}
                    </div>
                    <h3 className="text-white font-semibold text-lg">{tip.title}</h3>
                  </div>
                  <p className="text-gray-400">{tip.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Guide des coupes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Guide des coupes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fitGuide.map((fit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center"
                >
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-red-500">
                      {fit.icon}
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{fit.fit}</h3>
                  <p className="text-gray-400 text-sm">{fit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Conseils généraux */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-gradient-to-r from-red-500/10 to-gray-900 rounded-2xl p-8 border border-gray-800 mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Conseils pour bien choisir sa taille</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <p className="text-gray-400">Prenez vos mesures le matin, à jeun, pour des résultats plus précis</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <p className="text-gray-400">Utilisez un mètre ruban souple et ne serrez pas trop</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <p className="text-gray-400">En cas de doute entre deux tailles, privilégiez la plus grande</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <p className="text-gray-400">Tenez compte de la coupe du vêtement (regular, slim, oversized)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">5</span>
                  </div>
                  <p className="text-gray-400">Les tailles peuvent varier selon les collections</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">6</span>
                  </div>
                  <p className="text-gray-400">N\'hésitez pas à nous contacter pour des conseils personnalisés</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Besoin d'aide pour choisir votre taille ?</h2>
            <p className="text-gray-400 mb-6">
              Notre équipe est là pour vous conseiller
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+221771234567"
                className="inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Appeler</span>
              </a>
              <a
                href="mailto:contact@siggil.com"
                className="inline-flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
