import React, { useState } from 'react';
import Header from '../components/common/Header.tsx';

const Help: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "Comment passer une commande ?",
      answer: "Pour passer une commande, parcourez notre catalogue, ajoutez les produits souhaités à votre panier, puis procédez au paiement via Wave, Orange Money ou Free Money."
    },
    {
      id: 2,
      question: "Quels sont les délais de livraison ?",
      answer: "Les délais de livraison varient entre 1-3 jours ouvrés à Dakar et 3-7 jours pour les autres villes du Sénégal. La livraison est gratuite à Dakar."
    },
    {
      id: 3,
      question: "Comment retourner un article ?",
      answer: "Vous disposez de 30 jours pour retourner un article. Contactez notre service client pour initier le processus de retour. Les articles doivent être dans leur état d'origine."
    },
    {
      id: 4,
      question: "Comment choisir la bonne taille ?",
      answer: "Consultez notre guide des tailles disponible sur la page 'Taille guide'. Nous recommandons de mesurer votre tour de poitrine, taille et hanches pour un ajustement parfait."
    },
    {
      id: 5,
      question: "Les paiements sont-ils sécurisés ?",
      answer: "Oui, tous nos paiements sont 100% sécurisés. Nous utilisons les services de paiement mobile les plus fiables du Sénégal (Wave, Orange Money, Free Money)."
    },
    {
      id: 6,
      question: "Comment contacter le service client ?",
      answer: "Vous pouvez nous contacter par téléphone au +221 78 100 22 53, par email à contact@siggil.com, ou via WhatsApp. Notre équipe est disponible du lundi au samedi de 9h à 18h."
    }
  ];

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="py-6 sm:py-12 px-4">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-12">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-male-red mb-2 block">
              Support
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-4">
              AIDE & <span className="gradient-text">FAQ</span>
            </h1>
            <p className="text-gray-text text-xs sm:text-sm max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions les plus fréquentes
            </p>
          </div>

          {/* FAQ Section */}
          <div className="space-y-2 sm:space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="card-modern overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-3 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-offwhite transition-colors"
                >
                  <span className="text-blacksoft font-semibold text-xs sm:text-base pr-2">{faq.question}</span>
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-medium transition-transform duration-200 flex-shrink-0 ${
                      openFaq === faq.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === faq.id && (
                  <div className="px-3 sm:px-6 pb-3 sm:pb-4">
                    <p className="text-gray-text text-xs sm:text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-6 sm:mt-12 text-center">
            <div className="card-modern p-4 sm:p-8">
              <h2 className="text-lg sm:text-xl font-display font-bold text-blacksoft mb-2 sm:mb-4">Besoin d'aide supplémentaire ?</h2>
              <p className="text-gray-text text-xs sm:text-sm mb-4 sm:mb-6">
                Notre équipe est là pour vous aider
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a
                  href="tel:+221781002253"
                  className="btn-primary text-xs py-2.5"
                >
                  Appeler le support
                </a>
                <a
                  href="https://wa.me/221781002253"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs py-2.5"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
