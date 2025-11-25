import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, Wifi, WifiOff, Bell } from 'lucide-react';
import Header from '../components/common/Header.tsx';
import { supabase } from '../lib/supabase.ts';
import OrderTimeline from '../components/orders/OrderTimeline.tsx';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  order_id: string;
  user_info: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    city?: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  created_at: string;
  updated_at: string;
  tracking_info?: string;
}

const OrderTracking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlOrderId = searchParams.get('orderId');
  const [orderId, setOrderId] = useState(urlOrderId || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const subscriptionRef = useRef<any>(null);
  const previousStatusRef = useRef<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          text: 'En attente',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          description: 'Votre commande est en attente de traitement',
        };
      case 'paid':
        return {
          text: 'Payée',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: CheckCircle,
          description: 'Votre paiement a été confirmé',
        };
      case 'shipped':
        return {
          text: 'Expédiée',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: Truck,
          description: 'Votre commande a été expédiée',
        };
      case 'delivered':
        return {
          text: 'Livrée',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          description: 'Votre commande a été livrée',
        };
      case 'cancelled':
        return {
          text: 'Annulée',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          description: 'Votre commande a été annulée',
        };
      default:
        return {
          text: 'Inconnu',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Package,
          description: 'Statut inconnu',
        };
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setError('Veuillez entrer un numéro de commande');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId.trim().toUpperCase())
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setError('Aucune commande trouvée avec ce numéro. Vérifiez le numéro et réessayez.');
        } else {
          throw fetchError;
        }
        return;
      }

      if (data) {
        const orderData = {
          id: data.id,
          order_id: data.order_id,
          user_info: data.user_info || {},
          items: data.items || [],
          total: data.total,
          status: data.status || 'pending',
          payment_method: data.payment_method || '',
          created_at: data.created_at,
          updated_at: data.updated_at,
          tracking_info: data.tracking_info,
        };
        setOrder(orderData);
        previousStatusRef.current = orderData.status;

        // S'abonner aux mises à jour en temps réel
        setupRealtimeSubscription(data.id);
      }
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = (orderId: string) => {
    // Nettoyer l'ancienne souscription si elle existe
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }

    // Créer une nouvelle souscription
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          console.log('Mise à jour en temps réel reçue:', payload);
          const updatedOrder = payload.new as any;
          setOrder((prevOrder) => {
            if (!prevOrder) return prevOrder;
            return {
              ...prevOrder,
              status: updatedOrder.status || prevOrder.status,
              tracking_info: updatedOrder.tracking_info || prevOrder.tracking_info,
              updated_at: updatedOrder.updated_at || prevOrder.updated_at,
            };
          });
          
          // Notification visuelle pour changement de statut
          if (updatedOrder.status !== previousStatusRef.current && previousStatusRef.current !== null) {
            const statusText = getStatusInfo(updatedOrder.status)?.text || updatedOrder.status;
            setNotification({
              message: `Statut mis à jour: ${statusText}`,
              type: 'success',
            });
          }
          previousStatusRef.current = updatedOrder.status;
        }
      )
      .subscribe((status) => {
        setIsRealtimeConnected(status === 'SUBSCRIBED');
        console.log('Statut de la souscription:', status);
      });

    subscriptionRef.current = channel;
  };

  // Nettoyer la souscription au démontage
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, []);

  // Rechercher automatiquement si orderId est dans l'URL
  useEffect(() => {
    if (!urlOrderId || order || loading) return;

    const performSearch = async () => {
      setLoading(true);
      setError(null);
      setOrder(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('order_id', urlOrderId.trim().toUpperCase())
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError('Aucune commande trouvée avec ce numéro. Vérifiez le numéro et réessayez.');
          } else {
            throw fetchError;
          }
          return;
        }

        if (data) {
          const orderData = {
            id: data.id,
            order_id: data.order_id,
            user_info: data.user_info || {},
            items: data.items || [],
            total: data.total,
            status: data.status || 'pending',
            payment_method: data.payment_method || '',
            created_at: data.created_at,
            updated_at: data.updated_at,
            tracking_info: data.tracking_info,
          };
          setOrder(orderData);
          setOrderId(urlOrderId);
          previousStatusRef.current = orderData.status;
          setupRealtimeSubscription(data.id);
        }
      } catch (err) {
        console.error('Erreur lors de la recherche:', err);
        setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlOrderId]);

  // Afficher une notification temporaire
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const statusInfo = order ? getStatusInfo(order.status) : null;
  const StatusIcon = statusInfo?.icon || Package;

  return (
    <div className="min-h-screen bg-gradient-to-br from-offwhite via-white to-gray-light">
      <Header />
      
      {/* Notification toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4"
          >
            <div className={`bg-white rounded-lg shadow-lg border-2 p-4 flex items-center gap-3 ${
              notification.type === 'success' ? 'border-green-500' : 'border-blue-500'
            }`}>
              <div className={`p-2 rounded-full ${
                notification.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                <Bell className={`w-5 h-5 ${
                  notification.type === 'success' ? 'text-green-600' : 'text-blue-600'
                }`} />
              </div>
              <p className="flex-1 text-sm font-medium text-blacksoft">{notification.message}</p>
              <button
                onClick={() => setNotification(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="section-padding py-8 md:py-12">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-12"
          >
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-male-red mb-2 block">
              Suivi
            </span>
            <h1 className="text-2xl md:text-4xl font-display font-bold mb-3">
              Suivi de <span className="gradient-text">Commande</span>
            </h1>
            <p className="text-sm md:text-base text-gray-text max-w-2xl mx-auto">
              Entrez votre numéro de commande pour suivre l'état de votre livraison
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-modern p-4 md:p-6 mb-6 md:mb-8"
          >
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-text" />
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Ex: SIGGIL-12345678"
                  className="w-full pl-10 pr-4 py-3 bg-offwhite border border-gray-200 rounded-lg text-sm md:text-base text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#ff6c00] hover:bg-[#e55a00] text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {loading ? 'Recherche...' : 'Rechercher'}
              </button>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Order Details */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 md:space-y-6"
            >
              {/* Status Card */}
              <div className="card-modern p-4 md:p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-full ${statusInfo?.color} border-2`}>
                    <StatusIcon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg md:text-xl font-display font-bold text-blacksoft">
                        Commande {order.order_id}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium border ${statusInfo?.color}`}>
                          {statusInfo?.text}
                        </span>
                        {isRealtimeConnected ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1 text-green-600"
                            title="Mises à jour en temps réel activées"
                          >
                            <Wifi className="w-4 h-4" />
                            <span className="text-xs hidden sm:inline">Temps réel</span>
                          </motion.div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-400" title="Mises à jour en temps réel désactivées">
                            <WifiOff className="w-4 h-4" />
                            <span className="text-xs hidden sm:inline">Hors ligne</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-text">{statusInfo?.description}</p>
                    {order.tracking_info && (
                      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800">
                          <strong>Info de suivi:</strong> {order.tracking_info}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="card-modern p-4 md:p-6">
                <h3 className="text-base md:text-lg font-display font-bold text-blacksoft mb-6">
                  Suivi de votre commande
                </h3>
                <OrderTimeline
                  currentStatus={order.status}
                  createdAt={order.created_at}
                  updatedAt={order.updated_at}
                />
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card-modern p-4 md:p-6">
                  <h3 className="text-sm md:text-base font-semibold text-blacksoft mb-3">Informations de livraison</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-text">Nom:</span>{' '}
                      <span className="text-blacksoft font-medium">
                        {order.user_info.firstName} {order.user_info.lastName}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-text">Téléphone:</span>{' '}
                      <span className="text-blacksoft font-medium">{order.user_info.phoneNumber}</span>
                    </p>
                    <p>
                      <span className="text-gray-text">Adresse:</span>{' '}
                      <span className="text-blacksoft font-medium">{order.user_info.address}</span>
                    </p>
                    {order.user_info.city && (
                      <p>
                        <span className="text-gray-text">Ville:</span>{' '}
                        <span className="text-blacksoft font-medium">{order.user_info.city}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="card-modern p-4 md:p-6">
                  <h3 className="text-sm md:text-base font-semibold text-blacksoft mb-3">Détails de la commande</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-text">Date de commande:</span>{' '}
                      <span className="text-blacksoft font-medium">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-text">Méthode de paiement:</span>{' '}
                      <span className="text-blacksoft font-medium capitalize">
                        {order.payment_method === 'wave' ? 'Wave' : order.payment_method === 'orange' ? 'Orange Money' : order.payment_method}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-text">Total:</span>{' '}
                      <span className="text-blacksoft font-bold text-base">{formatCurrency(order.total)}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="card-modern p-4 md:p-6">
                <h3 className="text-sm md:text-base font-semibold text-blacksoft mb-4">Articles commandés</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-offwhite rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-blacksoft text-sm md:text-base">{item.name}</p>
                        <div className="flex gap-3 mt-1 text-xs text-gray-text">
                          {item.size && <span>Taille: {item.size}</span>}
                          {item.color && <span>Couleur: {item.color}</span>}
                          <span>Quantité: {item.quantity}</span>
                        </div>
                      </div>
                      <p className="font-semibold text-blacksoft text-sm md:text-base">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-base md:text-lg font-semibold text-blacksoft">Total</span>
                  <span className="text-lg md:text-xl font-bold text-blacksoft">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

