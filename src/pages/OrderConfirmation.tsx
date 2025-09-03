import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/common/Header.tsx';
import AnimatedText from '../components/common/AnimatedText.tsx';
import { getOrderById } from '../services/orderService.ts';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state || {};
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      console.log('OrderConfirmation - orderId reçu:', orderId);
      
      if (orderId) {
        try {
          const orderData = await getOrderById(orderId);
          console.log('OrderConfirmation - commande récupérée:', orderData);
          setOrder(orderData);
        } catch (error) {
          console.error('Erreur lors de la récupération de la commande:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('OrderConfirmation - Aucun orderId reçu');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Chargement de votre commande...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (!orderId || !order) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Commande <span className="text-red-500">Introuvable</span>
            </h1>
            <p className="text-gray-400 mb-8">
              {!orderId 
                ? 'Aucun ID de commande reçu. Veuillez passer une commande depuis le panier.'
                : 'Impossible de trouver les détails de cette commande. Veuillez vérifier l\'ID.'
              }
            </p>
            <div className="space-y-4">
              {!orderId && (
                <button
                  onClick={() => navigate('/produits')}
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors mr-4"
                >
                  Voir nos produits
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors mr-4"
              >
                Retour à l'accueil
              </button>
              <button
                onClick={() => navigate('/mes-commandes')}
                className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                Voir mes commandes
              </button>
            </div>
            {orderId && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-300 text-sm">
                  ID de commande reçu: <span className="font-mono text-yellow-400">{orderId}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <AnimatedText type="word" className="text-4xl font-bold text-white mb-4">
              Commande <span className="text-green-500">Confirmée</span>
            </AnimatedText>
            
            <p className="text-gray-400 text-lg">
              Merci pour votre commande ! Nous vous contacterons bientôt.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900 rounded-xl border border-gray-800 p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Détails de la commande</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">Numéro de commande</span>
                <span className="text-white font-mono font-semibold">{order.order_id}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">Montant total</span>
                <span className="text-white font-bold text-lg">{formatCurrency(order.total)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">Statut</span>
                <span className="text-yellow-500 font-semibold">En cours de traitement</span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">Date</span>
                <span className="text-white">{new Date(order.created_at || '').toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <h3 className="text-blue-400 font-semibold mb-2">Prochaines étapes</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Nous traiterons votre commande dans les 24h</li>
                <li>• Vous recevrez un SMS de confirmation</li>
                <li>• Livraison estimée : 2-3 jours ouvrables</li>
                <li>• Suivi de commande disponible bientôt</li>
              </ul>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h3 className="text-yellow-400 font-semibold mb-2">Contact</h3>
              <p className="text-gray-300 text-sm">
                Pour toute question concernant votre commande, contactez-nous au{' '}
                <span className="text-white font-semibold">+221 77 123 45 67</span> ou par email à{' '}
                <span className="text-white font-semibold">contact@siggil.sn</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <button
              onClick={() => navigate('/produits')}
              className="flex-1 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Continuer les achats
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              Retour à l'accueil
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
