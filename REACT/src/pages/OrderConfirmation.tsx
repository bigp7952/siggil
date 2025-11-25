import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/common/Header.tsx';
import { supabase } from '../lib/supabase.ts';

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const { orderId, total, cartItems, userInfo, deliveryAddress, deliveryCity, paymentMethod } = location.state || {};
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        try {
          // Charger depuis Supabase
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .or(`id.eq.${orderId},order_id.eq.${orderId}`)
            .single();

          if (error || !data) {
            throw new Error('Commande non trouvée');
          }

          const orderData = {
            id: data.id,
            order_id: data.order_id,
            user_id: data.user_id,
            user_info: data.user_info,
            items: data.items || [],
            total: Number(data.total),
            status: data.status,
            payment_method: data.payment_method,
            created_at: data.created_at,
            updated_at: data.updated_at,
            city: data.user_info?.city || 'Dakar',
          };
          
          if (orderData) {
            setOrder(orderData);
          } else {
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
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, retryCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="section-padding">
          <div className="container-custom max-w-2xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-male-red mx-auto mb-4"></div>
            <h1 className="text-2xl font-display font-bold text-blacksoft mb-4">
              {retryCount > 0 ? 'Vérification de votre commande...' : 'Chargement de votre commande...'}
            </h1>
            <p className="text-gray-text text-sm">
              {retryCount > 0 ? `Tentative ${retryCount}/3` : 'Veuillez patienter...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="section-padding">
        <div className="container-custom max-w-2xl">
          {/* Message de succès principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <span className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2 block">
              Succès
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Commande <span className="gradient-text">Confirmée</span> !
            </h1>
            
            <p className="text-gray-text text-sm mb-4">
              Félicitations ! Votre commande a été enregistrée avec succès.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
              <p className="text-green-700 text-sm font-medium">
                Votre commande a été enregistrée avec succès
              </p>
              <p className="text-green-600 text-xs mt-1">
                Nous vous contacterons bientôt pour confirmer les détails
              </p>
            </div>
          </motion.div>

          {/* Détails de la commande */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-modern p-6 mb-6"
          >
            <h2 className="text-xl font-display font-bold text-blacksoft mb-6">Détails de la commande</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-text text-sm">Numéro de commande</span>
                <span className="text-blacksoft font-mono font-semibold text-sm">
                  {orderId || `SIGGIL-${Date.now().toString().slice(-8)}`}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-text text-sm">Montant total</span>
                <span className="text-blacksoft font-bold text-lg">{formatCurrency(total || 0)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-text text-sm">Statut</span>
                <span className="text-green-600 font-semibold text-sm">Confirmée</span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-text text-sm">Date</span>
                <span className="text-blacksoft text-sm">{new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            {/* Informations client */}
            {(userInfo || order?.user_info) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-blue-700 font-semibold mb-2 text-sm">Informations client</h3>
                <div className="text-gray-text text-sm space-y-1">
                  <p><strong>Nom:</strong> {userInfo?.firstName || order?.user_info?.firstName} {userInfo?.lastName || order?.user_info?.lastName}</p>
                  <p><strong>Téléphone:</strong> {userInfo?.phoneNumber || order?.user_info?.phoneNumber}</p>
                  <p><strong>Ville:</strong> {deliveryCity || order?.city || 'Dakar'}</p>
                  {(deliveryAddress || order?.delivery_address) && (
                    <p><strong>Adresse:</strong> {deliveryAddress || order?.delivery_address}</p>
                  )}
                </div>
              </div>
            )}

            {/* Produits commandés */}
            {(cartItems || order?.items) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-blue-700 font-semibold mb-2 text-sm">Produits commandés</h3>
                <div className="space-y-2">
                  {(cartItems || order?.items)?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-gray-text text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Méthode de paiement */}
            {paymentMethod && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-blue-700 font-semibold mb-2 text-sm">Mode de paiement</h3>
                <div className="text-gray-text text-sm">
                  <p><strong>Méthode:</strong> {
                    paymentMethod === 'wave' ? 'Wave' :
                    paymentMethod === 'orange' ? 'Orange Money' :
                    paymentMethod === 'free' ? 'Paiement à la livraison' : paymentMethod
                  }</p>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-yellow-700 font-semibold mb-2 text-sm">Prochaines étapes</h3>
              <ul className="text-gray-text text-sm space-y-1">
                <li>• Nous traiterons votre commande dans les 24h</li>
                <li>• Vous recevrez un SMS de confirmation</li>
                <li>• Livraison estimée : 2-3 jours ouvrables</li>
                <li>• Suivi de commande disponible bientôt</li>
              </ul>
            </div>
          </motion.div>

          {/* Boutons d'action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/produits"
              className="flex-1 btn-secondary text-xs py-3 text-center"
            >
              Continuer les achats
            </Link>
            
            <Link
              to="/"
              className="flex-1 btn-primary text-xs py-3 text-center"
            >
              Retour à l'accueil
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
