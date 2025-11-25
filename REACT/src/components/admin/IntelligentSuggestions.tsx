import React, { useMemo } from 'react';

interface Order {
  id?: string;
  order_id: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  created_at?: string;
  city: string;
}

interface Product {
  id?: string;
  product_id: string;
  name: string;
  stock: number;
  is_active: boolean;
}

interface IntelligentSuggestionsProps {
  orders: Order[];
  products: Product[];
  stats: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    totalCustomers: number;
    lowStockProducts: number;
  };
  onActionClick?: (action: string, suggestionType: string) => void;
}

interface Suggestion {
  type: 'warning' | 'info' | 'success' | 'danger';
  title: string;
  description: string;
  action?: string;
  actionId?: string;
  priority: number;
}

const IntelligentSuggestions: React.FC<IntelligentSuggestionsProps> = ({
  orders,
  products,
  stats,
  onActionClick,
}) => {
  const suggestions = useMemo(() => {
    const suggestionsList: Suggestion[] = [];

    // 1. Commandes en attente
    if (stats.pendingOrders > 0) {
      suggestionsList.push({
        type: 'warning',
        title: `${stats.pendingOrders} commande(s) en attente`,
        description: `Vous avez ${stats.pendingOrders} commande(s) qui nécessitent votre attention. Traitez-les rapidement pour améliorer la satisfaction client.`,
        action: 'Voir les commandes',
        actionId: 'view_orders',
        priority: 1,
      });
    }

    // 2. Produits en rupture de stock
    if (stats.lowStockProducts > 0) {
      const lowStock = products.filter(p => p.stock < 10 && p.is_active);
      suggestionsList.push({
        type: 'danger',
        title: `${stats.lowStockProducts} produit(s) en stock faible`,
        description: `${lowStock.length} produit(s) ont un stock inférieur à 10 unités. Pensez à réapprovisionner pour éviter les ruptures.`,
        action: 'Gérer le stock',
        actionId: 'manage_stock',
        priority: 2,
      });
    }

    // 3. Analyse des tendances de vente
    const last7Days = orders.filter(order => {
      const orderDate = order.createdAt || order.created_at;
      if (!orderDate) return false;
      const date = new Date(orderDate);
      const daysDiff = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });

    const previous7Days = orders.filter(order => {
      const orderDate = order.createdAt || order.created_at;
      if (!orderDate) return false;
      const date = new Date(orderDate);
      const daysDiff = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff > 7 && daysDiff <= 14;
    });

    const currentWeekRevenue = last7Days.reduce((sum, o) => sum + (o.total || 0), 0);
    const previousWeekRevenue = previous7Days.reduce((sum, o) => sum + (o.total || 0), 0);

    if (previousWeekRevenue > 0) {
      const revenueChange = ((currentWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100;
      
      if (revenueChange < -20) {
        suggestionsList.push({
          type: 'warning',
          title: 'Baisse des ventes détectée',
          description: `Les revenus de cette semaine ont diminué de ${Math.abs(revenueChange).toFixed(1)}% par rapport à la semaine dernière. Analysez les causes et ajustez votre stratégie.`,
          priority: 3,
        });
      } else if (revenueChange > 20) {
        suggestionsList.push({
          type: 'success',
          title: 'Croissance des ventes',
          description: `Excellent ! Vos revenus ont augmenté de ${revenueChange.toFixed(1)}% cette semaine. Continuez sur cette lancée !`,
          priority: 4,
        });
      }
    }

    // 4. Commandes non livrées depuis longtemps
    const oldPendingOrders = orders.filter(order => {
      if (order.status !== 'pending' && order.status !== 'paid') return false;
      const orderDate = order.createdAt || order.created_at;
      if (!orderDate) return false;
      const date = new Date(orderDate);
      const daysDiff = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff > 3;
    });

    if (oldPendingOrders.length > 0) {
      suggestionsList.push({
        type: 'danger',
        title: `${oldPendingOrders.length} commande(s) ancienne(s) non traitées`,
        description: `Certaines commandes sont en attente depuis plus de 3 jours. Traitez-les rapidement pour éviter l'insatisfaction client.`,
        action: 'Traiter les commandes',
        actionId: 'view_orders',
        priority: 1,
      });
    }

    // 5. Analyse de la distribution géographique
    const cityCounts: Record<string, number> = {};
    orders.forEach(order => {
      const city = order.city || 'Inconnue';
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0];
    if (topCity && topCity[1] > 0) {
      const topCityPercentage = (topCity[1] / orders.length) * 100;
      if (topCityPercentage > 50) {
        suggestionsList.push({
          type: 'info',
          title: 'Concentration géographique élevée',
          description: `${topCityPercentage.toFixed(1)}% de vos commandes proviennent de ${topCity[0]}. Pensez à développer votre présence dans d'autres villes.`,
          priority: 5,
        });
      }
    }

    // 6. Taux de livraison
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const totalProcessedOrders = orders.filter(o => 
      o.status === 'delivered' || o.status === 'shipped' || o.status === 'cancelled'
    ).length;

    if (totalProcessedOrders > 0) {
      const deliveryRate = (deliveredOrders / totalProcessedOrders) * 100;
      if (deliveryRate < 70 && deliveredOrders > 0) {
        suggestionsList.push({
          type: 'warning',
          title: 'Taux de livraison à améliorer',
          description: `Seulement ${deliveryRate.toFixed(1)}% de vos commandes sont livrées. Optimisez votre processus de livraison.`,
          priority: 3,
        });
      } else if (deliveryRate >= 90) {
        suggestionsList.push({
          type: 'success',
          title: 'Excellent taux de livraison',
          description: `${deliveryRate.toFixed(1)}% de vos commandes sont livrées. Continuez ainsi !`,
          priority: 6,
        });
      }
    }

    // 7. Revenus moyens
    if (orders.length > 0) {
      const avgRevenue = stats.totalRevenue / orders.length;
      if (avgRevenue < 10000) {
        suggestionsList.push({
          type: 'info',
          title: 'Panier moyen à optimiser',
          description: `Votre panier moyen est de ${new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
          }).format(avgRevenue)}. Proposez des produits complémentaires pour l'augmenter.`,
          priority: 4,
        });
      }
    }

    // Trier par priorité (plus bas = plus important)
    return suggestionsList.sort((a, b) => a.priority - b.priority).slice(0, 6);
  }, [orders, products, stats]);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'danger':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'warning':
        // Jaune Karma pour les avertissements
        return 'bg-[#ffba00]/10 text-[#ffba00] border-[#ffba00]/30';
      case 'danger':
        // Rouge MaleFashion pour les dangers/urgences
        return 'bg-[#e53637]/10 text-[#e53637] border-[#e53637]/30';
      case 'success':
        // Orange Karma pour les succès (harmonie avec la palette)
        return 'bg-[#ff6c00]/10 text-[#ff6c00] border-[#ff6c00]/30';
      default:
        // Orange Karma pour les informations
        return 'bg-[#ff6c00]/10 text-[#ff6c00] border-[#ff6c00]/30';
    }
  };

  if (suggestions.length === 0) {
    return (
      <div className="card-modern p-4 md:p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff6c00]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-[#ff6c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm md:text-base font-display font-bold text-blacksoft mb-1">
              Tout va bien !
            </h3>
            <p className="text-xs md:text-sm text-gray-text">
              Aucune action urgente requise.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-modern p-4 md:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
        <div className="w-8 h-8 bg-[#ff6c00]/10 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-[#ff6c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-sm md:text-base font-display font-bold text-blacksoft">
          Suggestions Intelligentes
        </h3>
        <span className="ml-auto text-xs text-gray-text bg-gray-100 px-2 py-1 rounded-full">
          {suggestions.length}
        </span>
      </div>
      
      <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-2">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${getSuggestionColor(suggestion.type)} transition-all hover:shadow-md`}
          >
            <div className="flex items-start gap-2.5">
              <div className={`flex-shrink-0 mt-0.5 ${getSuggestionColor(suggestion.type).split(' ')[1]}`}>
                {getSuggestionIcon(suggestion.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-xs md:text-sm mb-1 leading-tight">
                  {suggestion.title}
                </h4>
                <p className="text-[10px] md:text-xs opacity-90 leading-relaxed">
                  {suggestion.description}
                </p>
                {suggestion.action && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onActionClick && suggestion.actionId) {
                        onActionClick(suggestion.actionId, suggestion.type);
                      }
                    }}
                    className={`text-[10px] md:text-xs font-semibold mt-2 px-2 py-1 rounded-md transition-all ${
                      suggestion.type === 'danger' 
                        ? 'bg-[#e53637]/10 text-[#e53637] hover:bg-[#e53637]/20 border border-[#e53637]/30' 
                        : suggestion.type === 'warning'
                        ? 'bg-[#ffba00]/10 text-[#ffba00] hover:bg-[#ffba00]/20 border border-[#ffba00]/30'
                        : 'bg-[#ff6c00]/10 text-[#ff6c00] hover:bg-[#ff6c00]/20 border border-[#ff6c00]/30'
                    }`}
                  >
                    {suggestion.action} →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntelligentSuggestions;

