import React, { useState } from 'react';
import Header from '../components/common/Header.tsx';

const SizeGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('tshirts');

  const categories = [
    { 
      id: 'tshirts', 
      name: 'T-Shirts', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'hoodies', 
      name: 'Hoodies', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    { 
      id: 'pants', 
      name: 'Pantalons', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'shoes', 
      name: 'Chaussures', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
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
      description: 'Mesurez autour de la partie la plus large de votre poitrine, généralement au niveau des aisselles. Gardez le mètre ruban horizontal et bien ajusté sans serrer.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: 'text-blue-600'
    },
    {
      title: 'Tour de taille',
      description: 'Mesurez autour de votre taille naturelle, généralement au niveau du nombril. Assurez-vous que le mètre ruban est bien horizontal et parallèle au sol.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: 'text-green-600'
    },
    {
      title: 'Tour de hanches',
      description: 'Mesurez autour de la partie la plus large de vos hanches, généralement à environ 20 cm sous la taille. Gardez le mètre ruban bien ajusté.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'text-purple-600'
    },
    {
      title: 'Longueur des jambes',
      description: 'Mesurez de la taille jusqu\'à la cheville ou jusqu\'à la longueur désirée. Pour les pantalons, mesurez jusqu\'à l\'endroit où vous souhaitez que le pantalon se termine.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      color: 'text-orange-600'
    }
  ];

  const fitGuide = [
    {
      fit: 'Regular Fit',
      description: 'Coupe classique, confortable et adaptée à tous les styles. Parfaite pour un look décontracté au quotidien.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'bg-blue-100 text-blue-600'
    },
    {
      fit: 'Oversized Fit',
      description: 'Coupe ample et décontractée pour un look streetwear moderne. Idéale pour un style confortable et tendance.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: 'bg-purple-100 text-purple-600'
    },
    {
      fit: 'Slim Fit',
      description: 'Coupe ajustée pour un look moderne et élégant. Parfaite pour un style plus structuré et sophistiqué.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-100 text-green-600'
    }
  ];

  const generalTips = [
    {
      tip: 'Prenez vos mesures le matin, à jeun, pour des résultats plus précis',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      tip: 'Utilisez un mètre ruban souple et ne serrez pas trop',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      tip: 'En cas de doute entre deux tailles, privilégiez la plus grande',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      tip: 'Tenez compte de la coupe du vêtement (regular, slim, oversized)',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    },
    {
      tip: 'Les tailles peuvent varier selon les collections',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      )
    },
    {
      tip: 'N\'hésitez pas à nous contacter pour des conseils personnalisés',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-8 sm:py-16 bg-gradient-to-br from-offwhite to-gray-light px-4">
        <div className="container-custom">
          <div className="text-center">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-male-red mb-2 sm:mb-3 block">
              Guide
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold mb-2 sm:mb-4">
              GUIDE DES <span className="gradient-text">TAILLES</span>
            </h1>
            <p className="text-gray-text text-xs sm:text-base max-w-2xl mx-auto">
              Trouvez la taille parfaite pour un ajustement optimal. 
              Consultez nos tableaux de tailles et nos conseils de mesure.
            </p>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-12 bg-white px-4">
        <div className="container-custom">
          {/* Catégories */}
          <div className="mb-6 sm:mb-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-blacksoft mb-2 sm:mb-3">
                Sélectionnez une catégorie
              </h2>
              <p className="text-gray-text text-xs sm:text-sm max-w-2xl mx-auto">
                Choisissez le type de vêtement pour voir le tableau de tailles correspondant
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all text-xs sm:text-sm flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-karma text-white shadow-md'
                      : 'bg-offwhite text-gray-text hover:bg-gray-light border border-gray-200'
                  }`}
                >
                  <span className={selectedCategory === category.id ? 'text-white' : 'text-gray-text'}>
                    {category.icon}
                  </span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tableau des tailles */}
          <div className="mb-6 sm:mb-12">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-display font-bold text-blacksoft mb-1 sm:mb-2">
                Tableau des tailles - {categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-gray-text text-[10px] sm:text-xs">
                Toutes les mesures sont en centimètres
              </p>
            </div>
            <div className="card-modern overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px]">
                  <thead className="bg-offwhite">
                    <tr>
                      {sizeTables[selectedCategory as keyof typeof sizeTables].headers.map((header, index) => (
                        <th key={index} className="px-3 sm:px-6 py-2 sm:py-4 text-left text-blacksoft font-semibold text-xs sm:text-sm">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeTables[selectedCategory as keyof typeof sizeTables].data.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-gray-200 hover:bg-offwhite transition-colors">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className={`px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm ${cellIndex === 0 ? 'font-semibold text-blacksoft' : 'text-gray-text'}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Conseils de mesure */}
          <div className="mb-6 sm:mb-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-blacksoft mb-2 sm:mb-3">
                Comment mesurer ?
              </h2>
              <p className="text-gray-text text-xs sm:text-sm max-w-2xl mx-auto">
                Suivez ces conseils pour obtenir des mesures précises et choisir la bonne taille
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {measuringTips.map((tip) => (
                <div
                  key={tip.title}
                  className="card-modern p-4 sm:p-6"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-lg flex items-center justify-center ${tip.color} flex-shrink-0`}>
                      {tip.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-blacksoft font-semibold text-sm sm:text-base mb-1 sm:mb-2">{tip.title}</h3>
                      <p className="text-gray-text text-xs sm:text-sm leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guide des coupes */}
          <div className="mb-6 sm:mb-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-blacksoft mb-2 sm:mb-3">
                Guide des coupes
              </h2>
              <p className="text-gray-text text-xs sm:text-sm max-w-2xl mx-auto">
                Découvrez les différentes coupes disponibles et choisissez celle qui vous convient
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {fitGuide.map((fit) => (
                <div
                  key={fit.fit}
                  className="card-modern p-4 sm:p-6 text-center"
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${fit.color} rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                    {fit.icon}
                  </div>
                  <h3 className="text-blacksoft font-bold text-sm sm:text-base mb-1 sm:mb-2">{fit.fit}</h3>
                  <p className="text-gray-text text-xs sm:text-sm leading-relaxed">{fit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conseils généraux */}
          <div className="mb-6 sm:mb-12">
            <div className="card-modern p-4 sm:p-8 bg-gradient-to-r from-karma-yellow/10 to-karma-orange/10">
              <h2 className="text-lg sm:text-2xl font-display font-bold text-blacksoft mb-4 sm:mb-6 text-center">
                Conseils pour bien choisir sa taille
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {generalTips.map((item) => (
                  <div
                    key={item.tip}
                    className="flex items-start space-x-3 p-2.5 sm:p-3 bg-white rounded-lg"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-karma rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-white">
                        {item.icon}
                      </div>
                    </div>
                    <p className="text-gray-text text-xs sm:text-sm leading-relaxed pt-1 sm:pt-2">{item.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-6 sm:mb-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-blacksoft mb-2 sm:mb-3">
                Questions fréquentes
              </h2>
              <p className="text-gray-text text-xs sm:text-sm max-w-2xl mx-auto">
                Trouvez rapidement les réponses à vos questions sur les tailles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  question: "Que faire si je suis entre deux tailles ?",
                  answer: "Nous recommandons de choisir la taille supérieure pour plus de confort. Vous pouvez également nous contacter pour des conseils personnalisés selon le type de vêtement."
                },
                {
                  question: "Les tailles sont-elles les mêmes pour tous les produits ?",
                  answer: "Les tailles peuvent légèrement varier selon les collections et les types de vêtements. Consultez toujours le tableau de tailles spécifique à chaque catégorie."
                },
                {
                  question: "Puis-je échanger un article si la taille ne convient pas ?",
                  answer: "Oui, vous disposez de 30 jours pour retourner ou échanger un article qui ne vous convient pas. Les retours sont gratuits pour les articles défectueux."
                },
                {
                  question: "Comment savoir quelle coupe me convient ?",
                  answer: "Consultez notre guide des coupes ci-dessus. En cas de doute, n'hésitez pas à nous contacter pour des conseils personnalisés selon votre morphologie et votre style."
                }
              ].map((faq) => (
                <div
                  key={faq.question}
                  className="card-modern p-3 sm:p-5"
                >
                  <h3 className="text-blacksoft font-semibold text-xs sm:text-base mb-1.5 sm:mb-2 flex items-start">
                    <span className="text-male-red mr-2 text-sm sm:text-lg">•</span>
                    {faq.question}
                  </h3>
                  <p className="text-gray-text text-xs sm:text-sm leading-relaxed pl-4 sm:pl-5">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="card-modern p-4 sm:p-8 bg-gradient-to-r from-karma-yellow/10 to-karma-orange/10">
              <h2 className="text-lg sm:text-2xl font-display font-bold text-blacksoft mb-2 sm:mb-4">
                Besoin d'aide pour choisir votre taille ?
              </h2>
              <p className="text-gray-text text-xs sm:text-sm mb-4 sm:mb-6 max-w-xl mx-auto">
                Notre équipe est disponible pour vous conseiller et vous aider à trouver la taille parfaite selon vos mesures et vos préférences.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a
                  href="tel:+221781002253"
                  className="btn-primary inline-flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Appeler</span>
                </a>
                <a
                  href="/contact"
                  className="btn-secondary inline-flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Nous écrire</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SizeGuide;
