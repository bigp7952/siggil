import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/common/Header.tsx';
import AnimatedText from '../components/common/AnimatedText.tsx';
import { getOrderById } from '../services/orderService.ts';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, total, error, cartItems, userInfo, deliveryAddress, deliveryCity, paymentMethod } = location.state || {};
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [orderFound, setOrderFound] = useState(false);

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
          
          if (orderData) {
            setOrder(orderData);
            setOrderFound(true);
          } else {
            // Si la commande n'est pas trouvée, réessayer après un délai
            if (retryCount < 3) {
              setTimeout(() => {
                setRetryCount(prev => prev + 1);
                setLoading(true);
              }, 2000);
              return;
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de la commande:', error);
          
          // Réessayer en cas d'erreur
          if (retryCount < 3) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
              setLoading(true);
            }, 2000);
            return;
          }
        } finally {
          setLoading(false);
        }
      } else {
        console.log('OrderConfirmation - Aucun orderId reçu');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, retryCount]);

  // État de chargement avec message d'attente
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-white mb-4">
              {retryCount > 0 ? 'Vérification de votre commande...' : 'Chargement de votre commande...'}
            </h1>
            <p className="text-gray-400 text-sm">
              {retryCount > 0 ? `Tentative ${retryCount}/3` : 'Veuillez patienter...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // SUCCÈS - Commande confirmée (même si les détails ne sont pas encore récupérés)
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Message de succès principal */}
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
              Commande <span className="text-green-500">Confirmée</span> !
            </AnimatedText>
            
            <p className="text-gray-400 text-lg mb-2">
              Félicitations ! Votre commande a été enregistrée avec succès.
            </p>
            
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 inline-block">
              <p className="text-green-400 text-sm font-medium">
                ✅ Votre commande a été enregistrée avec succès
              </p>
              <p className="text-green-300 text-xs mt-1">
                Nous vous contacterons bientôt pour confirmer les détails
              </p>
            </div>
          </motion.div>

          {/* Détails de la commande */}
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
                <span className="text-white font-mono font-semibold">
                  {orderId || `SIGGIL-${Date.now().toString().slice(-8)}`}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">Montant total</span>
                <span className="text-white font-bold text-lg">{formatCurrency(total || 0)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">Statut</span>
                <span className="text-green-500 font-semibold">✅ Confirmée</span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">Date</span>
                <span className="text-white">{new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            {/* Informations client (depuis le state ou la commande récupérée) */}
            {(userInfo || order?.user_info) && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <h3 className="text-blue-400 font-semibold mb-2">Informations client</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Nom:</strong> {userInfo?.firstName || order?.user_info?.firstName} {userInfo?.lastName || order?.user_info?.lastName}</p>
                  <p><strong>Téléphone:</strong> {userInfo?.phoneNumber || order?.user_info?.phoneNumber}</p>
                  <p><strong>Ville:</strong> {deliveryCity || order?.city || 'Dakar'}</p>
                  {(deliveryAddress || order?.delivery_address) && (
                    <p><strong>Adresse:</strong> {deliveryAddress || order?.delivery_address}</p>
                  )}
                </div>
              </div>
            )}

            {/* Produits commandés (depuis le state ou la commande récupérée) */}
            {(cartItems || order?.items) && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <h3 className="text-blue-400 font-semibold mb-2">Produits commandés</h3>
                <div className="space-y-2">
                  {(cartItems || order?.items)?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-gray-300 text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Méthode de paiement */}
            {paymentMethod && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <h3 className="text-blue-400 font-semibold mb-2">Mode de paiement</h3>
                <div className="text-gray-300 text-sm">
                  <p><strong>Méthode:</strong> {
                    paymentMethod === 'wave' ? 'Wave' :
                    paymentMethod === 'orange' ? 'Orange Money' :
                    paymentMethod === 'free' ? 'Paiement à la livraison' : paymentMethod
                  }</p>
                </div>
              </div>
            )}

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
                <span className="text-white font-semibold">+221 78 100 22 53</span> ou par email à{' '}
                <span className="text-white font-semibold">contact@siggil.sn</span>
              </p>
            </div>
          </motion.div>

          {/* Accès aux commandes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mt-6"
          >
            <h3 className="text-green-400 font-semibold mb-3 text-center">📱 Suivi de vos commandes</h3>
            <div className="text-center">
              <p className="text-gray-300 text-sm mb-4">
                Vous pourrez bientôt suivre l'état de vos commandes et voir l'historique complet de vos achats.
              </p>
              <div className="space-y-2 text-gray-400 text-xs">
                <p>• <strong>Statut en temps réel</strong> : En cours, expédiée, livrée</p>
                <p>• <strong>Historique complet</strong> : Toutes vos commandes passées</p>
                <p>• <strong>Suivi de livraison</strong> : Localisation et estimation</p>
                <p>• <strong>Notifications</strong> : SMS et emails de mise à jour</p>
              </div>
            </div>
          </motion.div>

          {/* Boutons d'action */}
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

          {/* Message de rechargement si la commande n'est pas encore récupérée */}
          {!order && orderId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-400 text-sm">
                Les détails complets de votre commande seront disponibles dans quelques instants.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Actualiser la page
              </button>
            </motion.div>
          )}

          {/* Message d'information sur l'accès aux commandes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-6 text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
          >
            <p className="text-blue-400 text-sm font-medium mb-2">
              🔍 Où voir vos commandes ?
            </p>
            <p className="text-gray-300 text-xs">
              Bientôt disponible : Une section "Mes Commandes" sera accessible depuis votre profil ou le menu principal.
              Vous pourrez y voir toutes vos commandes, leur statut et l'historique complet.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
