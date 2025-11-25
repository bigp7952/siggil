import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Order {
  id?: string;
  order_id: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  created_at?: string;
  city: string;
}

interface LogisticsChartsProps {
  orders: Order[];
}

const LogisticsCharts: React.FC<LogisticsChartsProps> = ({ orders }) => {
  // Données pour l'évolution des commandes (7 derniers jours)
  const ordersByDate = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    return last7Days.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const dayOrders = orders.filter(order => {
        const orderDate = order.createdAt || order.created_at;
        if (!orderDate) return false;
        return orderDate.split('T')[0] === dateStr;
      });

      return {
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        commandes: dayOrders.length,
        revenus: dayOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      };
    });
  }, [orders]);

  // Répartition des statuts
  const statusDistribution = useMemo(() => {
    const statusCounts = {
      pending: 0,
      paid: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach(order => {
      const status = order.status || 'pending';
      if (status in statusCounts) {
        statusCounts[status as keyof typeof statusCounts]++;
      }
    });

    return [
      { name: 'En attente', value: statusCounts.pending, color: '#ffba00' },
      { name: 'Payé', value: statusCounts.paid, color: '#ff6c00' },
      { name: 'Expédié', value: statusCounts.shipped, color: '#e53637' },
      { name: 'Livré', value: statusCounts.delivered, color: '#10b981' },
      { name: 'Annulé', value: statusCounts.cancelled, color: '#ef4444' },
    ].filter(item => item.value > 0);
  }, [orders]);

  // Revenus par période (mois)
  const revenueByMonth = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return date;
    });

    return months.map(month => {
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      const monthOrders = orders.filter(order => {
        const orderDate = order.createdAt || order.created_at;
        if (!orderDate) return false;
        const date = new Date(orderDate);
        return date >= monthStart && date <= monthEnd;
      });

      return {
        mois: month.toLocaleDateString('fr-FR', { month: 'short' }),
        revenus: monthOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      };
    });
  }, [orders]);

  // Distribution géographique
  const cityDistribution = useMemo(() => {
    const cityCounts: Record<string, number> = {};
    orders.forEach(order => {
      const city = order.city || 'Inconnue';
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    return Object.entries(cityCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [orders]);

  // COLORS array removed - not used

  if (orders.length === 0) {
    return (
      <div className="card-modern p-4 md:p-6 text-center">
        <p className="text-sm text-gray-text">Aucune donnée disponible pour les graphiques</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Évolution des commandes et revenus - Full Width */}
      <div className="card-modern p-4 md:p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-display font-bold text-blacksoft">
            Évolution (7 derniers jours)
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff6c00]"></div>
              <span className="text-gray-text">Commandes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ffba00]"></div>
              <span className="text-gray-text">Revenus</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={ordersByDate}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#777777"
              style={{ fontSize: '11px' }}
            />
            <YAxis 
              stroke="#777777"
              style={{ fontSize: '11px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line 
              type="monotone" 
              dataKey="commandes" 
              stroke="#ff6c00" 
              strokeWidth={2.5}
              name="Commandes"
              dot={{ fill: '#ff6c00', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
              type="monotone" 
              dataKey="revenus" 
              stroke="#ffba00" 
              strokeWidth={2.5}
              name="Revenus (XOF)"
              dot={{ fill: '#ffba00', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grid: Status Distribution & Top Cities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Répartition des statuts */}
        <div className="card-modern p-4 md:p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-sm md:text-base font-display font-bold text-blacksoft mb-4">
            Répartition des Statuts
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                outerRadius={75}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution géographique */}
        <div className="card-modern p-4 md:p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-sm md:text-base font-display font-bold text-blacksoft mb-4">
            Top 5 Villes
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={cityDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                type="number"
                stroke="#777777"
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                type="category"
                dataKey="name" 
                stroke="#777777"
                style={{ fontSize: '11px' }}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="value" fill="#ff6c00" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenus par mois - Full Width */}
      <div className="card-modern p-4 md:p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-base md:text-lg font-display font-bold text-blacksoft mb-4">
          Revenus par Mois (6 derniers mois)
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={revenueByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="mois" 
              stroke="#777777"
              style={{ fontSize: '11px' }}
            />
            <YAxis 
              stroke="#777777"
              style={{ fontSize: '11px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              formatter={(value: number) => [
                new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XOF',
                  minimumFractionDigits: 0,
                }).format(value),
                'Revenus'
              ]}
            />
            <Bar dataKey="revenus" fill="#ffba00" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LogisticsCharts;

