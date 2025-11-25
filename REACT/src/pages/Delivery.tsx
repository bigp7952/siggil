import React from 'react';
import Header from '../components/common/Header.tsx';

const Delivery: React.FC = () => {
  const deliveryZones = [
    {
      zone: 'Dakar',
      time: '1-3 jours ouvrés',
      cost: 'Gratuite',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      description: 'Livraison express dans toute la région de Dakar',
      features: ['Livraison gratuite', 'Suivi en temps réel', 'Livraison à domicile']
    },
    {
      zone: 'Autres villes du Sénégal',
      time: '3-7 jours ouvrés',
      cost: '2 000 CFA',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      description: 'Livraison sécurisée dans toutes les régions du Sénégal',
      features: ['Frais de 2 000 CFA', 'Suivi disponible', 'Point relais disponible']
    }
  ];

  const deliverySteps = [
    {
      step: 1,
      title: 'Commande confirmée',
      description: 'Votre commande est validée et enregistrée dans notre système',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      time: 'Immédiat'
    },
    {
      step: 2,
      title: 'En préparation',
      description: 'Votre commande est soigneusement emballée et préparée pour l\'expédition',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      time: '24-48h'
    },
    {
      step: 3,
      title: 'En livraison',
      description: 'Votre commande est en route vers vous. Vous recevrez un SMS de suivi',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      time: '1-3 jours'
    },
    {
      step: 4,
      title: 'Livré',
      description: 'Votre commande est arrivée à destination. Profitez de vos nouveaux articles !',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      time: 'Final'
    }
  ];

  const deliveryFeatures = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Horaires de livraison',
      description: 'Lundi à Samedi de 8h à 18h',
      color: 'text-blue-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Livraison sécurisée',
      description: 'Signature requise pour les commandes > 50 000 CFA',
      color: 'text-green-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Notifications',
      description: 'SMS et email de suivi en temps réel',
      color: 'text-purple-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Retards possibles',
      description: 'En cas de force majeure ou événements spéciaux',
      color: 'text-orange-600'
    }
  ];

  const packagingInfo = [
    {
      title: 'Emballage écologique',
      description: 'Nous utilisons des emballages recyclables et respectueux de l\'environnement'
    },
    {
      title: 'Protection optimale',
      description: 'Vos articles sont soigneusement protégés pour arriver en parfait état'
    },
    {
      title: 'Colis scellé',
      description: 'Tous nos colis sont scellés pour garantir l\'intégrité de votre commande'
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
              Livraison
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold mb-2 sm:mb-4">
              LIVRAISON & <span className="gradient-text">EXPÉDITION</span>
            </h1>
            <p className="text-gray-text text-xs sm:text-base max-w-2xl mx-auto">
              Découvrez nos options de livraison rapide, sécurisée et écologique. 
              Nous livrons partout au Sénégal avec soin et professionnalisme.
            </p>
          </div>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="py-6 sm:py-12 bg-white px-4">
        <div className="container-custom">
          <div className="mb-6 sm:mb-12">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-blacksoft mb-2 sm:mb-3">
                Zones de livraison
              </h2>
              <p className="text-gray-text text-xs sm:text-sm max-w-2xl mx-auto">
                Choisissez votre zone pour connaître les délais et frais de livraison
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {deliveryZones.map((zone) => (
                <div
                  key={zone.zone}
                  className="card-modern p-4 sm:p-6 hover:border-male-red transition-all"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-karma rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      {zone.icon}
                    </div>
                    <div>
                      <h3 className="text-blacksoft font-display font-bold text-base sm:text-xl">{zone.zone}</h3>
                      <p className="text-gray-text text-[10px] sm:text-xs mt-1">{zone.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                    <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-gray-200">
                      <span className="text-gray-text text-xs sm:text-sm">Délai de livraison</span>
                      <span className="text-blacksoft font-semibold text-xs sm:text-sm">{zone.time}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-gray-200">
                      <span className="text-gray-text text-xs sm:text-sm">Frais de livraison</span>
                      <span className={`font-bold text-sm sm:text-base ${zone.cost === 'Gratuite' ? 'text-[#ffba00]' : 'text-male-red'}`}>
                        {zone.cost}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-blacksoft font-medium text-[10px] sm:text-xs mb-1.5 sm:mb-2">Avantages inclus :</p>
                    {zone.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#ffba00] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-text text-[10px] sm:text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Process Timeline */}
          <div className="mb-6 sm:mb-12">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-blacksoft mb-2 sm:mb-3">
                Suivi de votre commande
              </h2>
              <p className="text-gray-text text-xs sm:text-sm max-w-2xl mx-auto">
                Suivez chaque étape de votre commande en temps réel
              </p>
            </div>

            <div className="relative">
              <div className="space-y-4 sm:space-y-8">
                {deliverySteps.map((step) => (
                  <div
                    key={step.step}
                    className="relative flex items-start space-x-3 sm:space-x-6"
                  >
                    <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-karma rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-md">
                      {step.icon}
                    </div>
                    <div className="flex-1 card-modern p-3 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
                        <div className="flex-1">
                          <h3 className="text-blacksoft font-display font-bold text-sm sm:text-lg mb-1">{step.title}</h3>
                          <p className="text-gray-text text-xs sm:text-sm leading-relaxed">{step.description}</p>
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium text-male-red bg-red-50 px-2 py-1 rounded whitespace-nowrap self-start">
                          {step.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Features */}
          <div className="mb-6 sm:mb-12">
            <div className="card-modern p-4 sm:p-8 bg-gradient-to-r from-karma-yellow/10 to-karma-orange/10">
              <h2 className="text-lg sm:text-2xl font-display font-bold text-blacksoft mb-4 sm:mb-8 text-center">
                Informations importantes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {deliveryFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-start space-x-3 sm:space-x-4"
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center ${feature.color} flex-shrink-0`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-blacksoft font-semibold text-sm sm:text-base mb-1">{feature.title}</h3>
                      <p className="text-gray-text text-xs sm:text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Packaging Info */}
          <div className="mb-6 sm:mb-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-blacksoft mb-2 sm:mb-3">
                Emballage & Protection
              </h2>
              <p className="text-gray-text text-xs sm:text-sm max-w-2xl mx-auto">
                Nous prenons soin de vos commandes avec un emballage de qualité
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {packagingInfo.map((info) => (
                <div
                  key={info.title}
                  className="card-modern p-4 sm:p-5 text-center"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-karma rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-blacksoft font-semibold text-xs sm:text-sm mb-1 sm:mb-2">{info.title}</h3>
                  <p className="text-gray-text text-[10px] sm:text-xs">{info.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-6 sm:mb-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-blacksoft mb-2 sm:mb-3">
                Questions fréquentes
              </h2>
              <p className="text-gray-text text-xs sm:text-sm max-w-2xl mx-auto">
                Trouvez rapidement les réponses à vos questions sur la livraison
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  question: "Comment suivre ma commande ?",
                  answer: "Vous recevrez un SMS et un email avec un numéro de suivi dès l'expédition. Vous pouvez également consulter vos commandes dans la section 'Mes Commandes' de votre compte."
                },
                {
                  question: "Puis-je modifier mon adresse de livraison ?",
                  answer: "Oui, contactez-nous dans les 24h suivant votre commande pour modifier l'adresse de livraison. Après ce délai, la commande sera déjà en préparation."
                },
                {
                  question: "Que faire si je ne suis pas disponible ?",
                  answer: "Notre livreur vous contactera par téléphone. Vous pouvez reprogrammer la livraison ou choisir un point relais pour récupérer votre colis."
                },
                {
                  question: "Les frais de livraison sont-ils remboursables ?",
                  answer: "Les frais de livraison ne sont pas remboursables sauf en cas d'erreur de notre part ou de défaut sur le produit."
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
                Questions sur la livraison ?
              </h2>
              <p className="text-gray-text text-xs sm:text-sm mb-4 sm:mb-6 max-w-xl mx-auto">
                Notre équipe est disponible pour répondre à toutes vos questions concernant la livraison et l'expédition de vos commandes.
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

export default Delivery;
