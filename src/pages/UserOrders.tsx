import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { orderService } from '../services/supabaseService.ts';
import PageTransition from '../components/common/PageTransition.tsx';

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
    phone: string;
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
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserOrders();
    } else {
      setLoading(false);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await orderService.getOrdersByUserId(user!.id);
      setOrders(userOrders);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des commandes:', err);
      setError('Impossible de récupérer vos commandes');
    } finally {
      setLoading(false);
    }
  };

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
        return 'bg-yellow-500';
      case 'confirmed':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-purple-500';
      case 'shipped':
        return 'bg-indigo-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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

  if (!user) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Mes Commandes
              </h1>
              <p className="text-gray-600">
                Vous devez être connecté pour voir vos commandes.
              </p>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement de vos commandes...</p>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mes Commandes
            </h1>
            <p className="text-gray-600">
              Suivez l'état de vos commandes et consultez l'historique
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande</h3>
              <p className="mt-1 text-sm text-gray-500">
                Vous n'avez pas encore passé de commande.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white shadow rounded-lg border border-gray-200">
                  {/* En-tête de la commande */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Commande #{order.order_id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Passée le {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} text-white`}>
                          {getStatusText(order.status)}
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {order.total.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Informations de livraison */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Informations de livraison</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Nom:</span> {order.user_info?.firstName} {order.user_info?.lastName}
                      </div>
                      <div>
                        <span className="font-medium">Téléphone:</span> {order.user_info?.phone}
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">Adresse:</span> {order.user_info?.address}
                      </div>
                    </div>
                  </div>

                  {/* Suivi de la commande */}
                  {order.tracking_info && (
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Suivi de la commande</h4>
                      <p className="text-sm text-gray-600">{order.tracking_info}</p>
                    </div>
                  )}

                  {/* Articles commandés */}
                  <div className="px-6 py-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Articles commandés</h4>
                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.product_name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.product_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantité: {item.quantity}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bouton de rafraîchissement */}
          <div className="mt-8 text-center">
            <button
              onClick={fetchUserOrders}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserOrders;
