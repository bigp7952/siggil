import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import Header from '../components/common/Header.tsx';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase.ts';
import { Wifi } from 'lucide-react';
import OrderTimeline from '../components/orders/OrderTimeline.tsx';

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  order_id: string;
  user_id: string;
  user_info: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
  };
  items: OrderItem[];
  total: number;
  status: string;
  tracking_info?: string;
  created_at: string;
  updated_at: string;
}

const UserOrders: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth', { state: { returnTo: '/mes-commandes' } });
    }
  }, [user, isLoading, navigate]);

  const fetchUserOrders = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Charger depuis Supabase
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`user_id.eq.${user.id},user_info->>phoneNumber.eq.${user.phoneNumber}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      const userOrders: Order[] = (data || []).map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        user_id: item.user_id,
        user_info: item.user_info,
        items: item.items || [],
        total: Number(item.total),
        status: item.status,
        payment_method: item.payment_method,
        created_at: item.created_at,
        updated_at: item.updated_at,
        city: item.user_info?.city || 'Dakar',
      }));
      
      setOrders(userOrders);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des commandes:', err);
      setError('Impossible de récupérer vos commandes');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  // Configuration du suivi en temps réel
  useEffect(() => {
    if (!user?.id || orders.length === 0) return;

    // Nettoyer l'ancienne souscription
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }

    // Créer une nouvelle souscription pour toutes les commandes de l'utilisateur
    const channel = supabase
      .channel(`user-orders-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Mise à jour de commande en temps réel:', payload);
          const updatedOrder = payload.new as any;
          
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === updatedOrder.id
                ? {
                    ...order,
                    status: updatedOrder.status || order.status,
                    tracking_info: updatedOrder.tracking_info || order.tracking_info,
                    updated_at: updatedOrder.updated_at || order.updated_at,
                  }
                : order
            )
          );
        }
      )
      .subscribe((status) => {
        setIsRealtimeConnected(status === 'SUBSCRIBED');
        console.log('Statut de la souscription aux commandes:', status);
      });

    subscriptionRef.current = channel;

    // Nettoyer au démontage
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [user?.id, orders.length]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente de validation';
      case 'confirmed':
        return 'Commande confirmée';
      case 'processing':
        return 'En cours de traitement';
      case 'shipped':
        return 'Commande expédiée';
      case 'delivered':
        return 'Commande livrée';
      case 'cancelled':
        return 'Commande annulée';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Afficher un message de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="section-padding">
          <div className="container-custom max-w-2xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6c00] mx-auto mb-4"></div>
            <p className="text-gray-text text-sm">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  // Ne rien afficher si l'utilisateur n'est pas connecté (redirection en cours)
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="section-padding">
          <div className="container-custom max-w-2xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-male-red mx-auto"></div>
            <p className="mt-4 text-gray-text text-sm">Chargement de vos commandes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-male-red mb-2 block">
                  Commandes
                </span>
                <h1 className="text-3xl font-display font-bold text-blacksoft mb-2">
                  Mes Commandes
                </h1>
                <p className="text-gray-text text-sm">
                  Suivez l'état de vos commandes et consultez l'historique
                </p>
              </div>
              {isRealtimeConnected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200"
                  title="Mises à jour en temps réel activées"
                >
                  <Wifi className="w-4 h-4" />
                  <span className="text-xs font-medium">Temps réel</span>
                </motion.div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-offwhite rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-blacksoft mb-2">Aucune commande</h3>
              <p className="text-gray-text text-sm mb-6">
                Vous n'avez pas encore passé de commande.
              </p>
              <button
                onClick={() => window.location.href = '/produits'}
                className="btn-primary"
              >
                Découvrir nos produits
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="card-modern overflow-hidden"
                >
                  {/* En-tête de la commande */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-display font-semibold text-blacksoft">
                          Commande #{order.order_id}
                        </h3>
                        <p className="text-sm text-gray-text">
                          Passée le {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <span className="text-lg font-bold text-blacksoft">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Informations de livraison */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-blacksoft mb-2">Informations de livraison</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-text">
                      <div>
                        <span className="font-medium">Nom:</span> {order.user_info?.firstName} {order.user_info?.lastName}
                      </div>
                      <div>
                        <span className="font-medium">Téléphone:</span> {order.user_info?.phoneNumber}
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">Adresse:</span> {order.user_info?.address}
                      </div>
                    </div>
                  </div>

                  {/* Timeline de suivi */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-blacksoft">Suivi de la commande</h4>
                      <button
                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                        className="text-xs text-[#ff6c00] hover:underline"
                      >
                        {expandedOrderId === order.id ? 'Masquer' : 'Voir le détail'}
                      </button>
                    </div>
                    {expandedOrderId === order.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <OrderTimeline
                          currentStatus={order.status as 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'}
                          createdAt={order.created_at}
                          updatedAt={order.updated_at}
                        />
                      </motion.div>
                    )}
                    {order.tracking_info && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800">
                          <strong>Info de suivi:</strong> {order.tracking_info}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Articles commandés */}
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-blacksoft">Articles commandés</h4>
                      <Link
                        to={`/suivi-commande?orderId=${order.order_id}`}
                        className="text-xs text-[#ff6c00] hover:underline"
                      >
                        Suivre cette commande
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {order.items?.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.product_name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-blacksoft truncate">
                              {item.product_name}
                            </p>
                            <p className="text-sm text-gray-text">
                              Quantité: {item.quantity}
                            </p>
                          </div>
                          <div className="text-sm font-semibold text-blacksoft">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Bouton de rafraîchissement */}
          {orders.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={fetchUserOrders}
                className="btn-secondary text-xs py-2.5"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
