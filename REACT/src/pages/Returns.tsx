import React from 'react';
import Header from '../components/common/Header.tsx';

const Returns: React.FC = () => {
  const returnSteps = [
    {
      step: 1,
      title: 'Contactez-nous',
      description: 'Appelez-nous au +221 78 100 22 53 ou écrivez-nous par email dans les 30 jours suivant la réception de votre commande. Notre équipe vous guidera dans le processus de retour.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      time: 'Immédiat'
    },
    {
      step: 2,
      title: 'Préparez le retour',
      description: 'Remettez l\'article dans son état d\'origine avec tous les accessoires, étiquettes et emballages. Assurez-vous que l\'article n\'a pas été porté, lavé ou endommagé.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      time: '24h'
    },
    {
      step: 3,
      title: 'Expédition',
      description: 'Nous organisons la récupération de votre colis à domicile gratuitement. Vous recevrez un SMS avec la date et l\'heure de passage du livreur.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      time: '1-3 jours'
    },
    {
      step: 4,
      title: 'Remboursement',
      description: 'Une fois votre retour reçu et validé par notre équipe, nous procédons au remboursement sous 5-7 jours ouvrés sur votre moyen de paiement initial.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      time: '5-7 jours'
    }
  ];

  const returnConditions = [
    {
      title: 'Délai de retour',
      description: '30 jours à compter de la réception de votre commande. Passé ce délai, les retours ne sont plus acceptés.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-blue-600'
    },
    {
      title: 'État du produit',
      description: 'L\'article doit être non utilisé, non lavé, dans son emballage d\'origine avec toutes les étiquettes et accessoires.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-green-600'
    },
    {
      title: 'Étiquettes',
      description: 'Toutes les étiquettes doivent être présentes et intactes. Les articles sans étiquettes ne peuvent pas être retournés.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: 'text-purple-600'
    },
    {
      title: 'Frais de retour',
      description: 'Les retours sont gratuits pour les articles défectueux ou en cas d\'erreur de notre part. Sinon, les frais de retour sont à votre charge.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-orange-600'
    }
  ];

  const nonReturnableItems = [
    {
      item: 'Articles personnalisés ou sur mesure',
      reason: 'Les articles personnalisés ne peuvent pas être retournés car ils ont été fabriqués spécialement pour vous.'
    },
    {
      item: 'Articles en promotion finale',
      reason: 'Les articles soldés avec mention "promotion finale" sont exclus des retours.'
    },
    {
      item: 'Articles endommagés par l\'utilisateur',
      reason: 'Les articles endommagés, tachés ou modifiés par le client ne peuvent pas être retournés.'
    },
    {
      item: 'Articles sans emballage d\'origine',
      reason: 'Les articles retournés sans leur emballage d\'origine ne peuvent pas être acceptés.'
    }
  ];

  const refundInfo = [
    {
      title: 'Méthode de paiement',
      description: 'Le remboursement se fait via le même moyen de paiement utilisé lors de la commande (carte bancaire, mobile money, etc.)',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      title: 'Délai de traitement',
      description: 'Le remboursement est effectué sous 5-7 jours ouvrés après réception et validation de votre retour par notre équipe.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Frais de livraison',
      description: 'Les frais de livraison ne sont pas remboursés sauf en cas de défaut du produit ou d\'erreur de notre part.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
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
              Retours
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold mb-2 sm:mb-4">
              RETOURS & <span className="gradient-text">ÉCHANGES</span>
            </h1>
            <p className="text-gray-text text-xs sm:text-base max-w-2xl mx-auto">
              Politique de retour simple et transparente. Vous disposez de 30 jours 
              pour changer d'avis sur votre achat.
            </p>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-12 bg-white px-4">
        <div className="container-custom">
          {/* Politique générale */}
          <div className="mb-6 sm:mb-12">
            <div className="card-modern p-4 sm:p-8 lg:p-12 bg-gradient-to-r from-karma-yellow/10 to-karma-orange/10 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-karma rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-blacksoft mb-2 sm:mb-4">30 jours pour changer d'avis</h2>
              <p className="text-gray-text text-xs sm:text-base max-w-2xl mx-auto">
                Vous disposez de 30 jours à compter de la réception de votre commande pour nous retourner 
                un article qui ne vous convient pas. Le processus est simple, rapide et gratuit pour les articles défectueux.
              </p>
            </div>
          </div>

          {/* Étapes de retour */}
          <div className="mb-6 sm:mb-12">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-blacksoft mb-2 sm:mb-3">
                Comment retourner un article ?
              </h2>
              <p className="text-gray-text text-xs sm:text-sm max-w-2xl mx-auto">
                Suivez ces 4 étapes simples pour retourner votre article
              </p>
            </div>

            <div className="relative">
              <div className="space-y-4 sm:space-y-8">
                {returnSteps.map((step) => (
                  <div
                    key={step.step}
                    className="relative flex items-start space-x-3 sm:space-x-6"
                  >
                    <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-karma rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-md">
                      {step.icon}
                    </div>
                    <div className="flex-1 card-modern p-3 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
                        <div className="flex-1">
                          <h3 className="text-blacksoft font-display font-bold text-sm sm:text-lg mb-1 sm:mb-2">{step.title}</h3>
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

          {/* Conditions de retour */}
          <div className="mb-6 sm:mb-12">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-blacksoft mb-2 sm:mb-3">
                Conditions de retour
              </h2>
              <p className="text-gray-text text-xs sm:text-sm max-w-2xl mx-auto">
                Assurez-vous de respecter ces conditions pour un retour sans problème
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {returnConditions.map((condition) => (
                <div
                  key={condition.title}
                  className="card-modern p-4 sm:p-6"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4 mb-2 sm:mb-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center ${condition.color} flex-shrink-0`}>
                      {condition.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-blacksoft font-semibold text-sm sm:text-base mb-1 sm:mb-2">{condition.title}</h3>
                      <p className="text-gray-text text-xs sm:text-sm leading-relaxed">{condition.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Articles non retournables */}
          <div className="mb-6 sm:mb-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-blacksoft mb-2 sm:mb-3">
                Articles non retournables
              </h2>
              <p className="text-gray-text text-xs sm:text-sm max-w-2xl mx-auto">
                Certains articles ne peuvent pas être retournés pour des raisons de sécurité et de qualité
              </p>
            </div>

            <div className="card-modern p-4 sm:p-6 lg:p-8 bg-red-50/50 border-red-200">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-blacksoft font-bold text-base sm:text-lg">Attention</h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {nonReturnableItems.map((item) => (
                  <div key={item.item} className="flex items-start space-x-3 p-2.5 sm:p-3 bg-white rounded-lg">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-blacksoft font-semibold text-xs sm:text-sm mb-1">{item.item}</p>
                      <p className="text-gray-text text-[10px] sm:text-xs">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Remboursement */}
          <div className="mb-6 sm:mb-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-blacksoft mb-2 sm:mb-3">
                Remboursement rapide
              </h2>
              <p className="text-gray-text text-xs sm:text-sm max-w-2xl mx-auto">
                Une fois votre retour reçu et validé, nous procédons au remboursement rapidement
              </p>
            </div>

            <div className="card-modern p-4 sm:p-8 bg-gradient-to-r from-[#ffba00]/10 to-[#ff6c00]/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {refundInfo.map((info) => (
                  <div
                    key={info.title}
                    className="bg-white rounded-lg p-4 sm:p-5 text-center"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-karma rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <div className="text-white">
                        {info.icon}
                      </div>
                    </div>
                    <h3 className="text-blacksoft font-semibold text-xs sm:text-sm mb-1 sm:mb-2">{info.title}</h3>
                    <p className="text-gray-text text-[10px] sm:text-xs leading-relaxed">{info.description}</p>
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
                Trouvez rapidement les réponses à vos questions sur les retours
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  question: "Puis-je échanger un article au lieu de le retourner ?",
                  answer: "Oui, vous pouvez demander un échange. Contactez-nous et nous vous guiderons dans le processus. Les frais de livraison du nouvel article seront à votre charge."
                },
                {
                  question: "Combien de temps prend le remboursement ?",
                  answer: "Le remboursement est effectué sous 5-7 jours ouvrés après réception et validation de votre retour. Vous recevrez une confirmation par email."
                },
                {
                  question: "Que faire si mon article est défectueux ?",
                  answer: "Les articles défectueux peuvent être retournés gratuitement. Contactez-nous immédiatement et nous organiserons le retour et le remboursement complets."
                },
                {
                  question: "Puis-je retourner un article après 30 jours ?",
                  answer: "Malheureusement, nous ne pouvons pas accepter les retours après 30 jours. Cependant, en cas de défaut, contactez-nous et nous trouverons une solution."
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
                Besoin d'aide pour un retour ?
              </h2>
              <p className="text-gray-text text-xs sm:text-sm mb-4 sm:mb-6 max-w-xl mx-auto">
                Notre équipe est disponible pour vous accompagner dans le processus de retour et répondre à toutes vos questions.
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

export default Returns;
