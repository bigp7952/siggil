import { supabase } from '../lib/supabase.ts';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}

export interface Order {
  id?: string;
  order_id: string;
  user_id?: string;
  user_info: UserInfo;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'wave' | 'orange' | 'free';
  city: string;
  delivery_address?: string;
  delivery_city?: string;
  tracking_info?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateOrderData {
  order_id: string;
  user_id?: string;
  user_info: UserInfo;
  items: OrderItem[];
  total: number;
  payment_method: 'wave' | 'orange' | 'free';
  city: string;
  delivery_address?: string;
  delivery_city?: string;
}

// Créer une nouvelle commande
export const createOrder = async (orderData: CreateOrderData): Promise<Order | null> => {
  try {
    console.log('🔄 Tentative de création de commande avec les données:', orderData);
    
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la création de la commande:', error);
      return null;
    }

    console.log('✅ Commande créée avec succès:', data);
    return data;
  } catch (error) {
    console.error('❌ Erreur lors de la création de la commande:', error);
    return null;
  }
};

// Récupérer toutes les commandes
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return [];
  }
};

// Récupérer une commande par ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    console.log('🔍 Tentative de récupération de la commande:', orderId);
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) {
      console.error('❌ Erreur Supabase lors de la récupération de la commande:', error);
      
      // Si c'est une erreur de commande non trouvée, on peut réessayer
      if (error.code === 'PGRST116') {
        console.log('📝 Commande non trouvée, peut-être pas encore synchronisée');
        return null;
      }
      
      throw error;
    }

    if (data) {
      console.log('✅ Commande récupérée avec succès:', data);
      return data;
    } else {
      console.log('📝 Aucune donnée retournée pour la commande:', orderId);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la commande:', error);
    return null;
  }
};

// Mettre à jour le statut d'une commande
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('order_id', orderId);

    if (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return false;
  }
};

// Récupérer les commandes par statut
export const getOrdersByStatus = async (status: Order['status']): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des commandes par statut:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes par statut:', error);
    return [];
  }
};

// Récupérer les commandes d'un utilisateur
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des commandes utilisateur:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes utilisateur:', error);
    return [];
  }
};

// Supprimer une commande
export const deleteOrder = async (orderId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('order_id', orderId);

    if (error) {
      console.error('Erreur lors de la suppression de la commande:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error);
    return false;
  }
};

// Obtenir les statistiques des commandes
export const getOrderStats = async () => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*');

    if (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        paidOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
      };
    }

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(order => ['paid', 'shipped', 'delivered'].includes(order.status))
      .reduce((sum, order) => sum + Number(order.total), 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const paidOrders = orders.filter(order => order.status === 'paid').length;
    const shippedOrders = orders.filter(order => order.status === 'shipped').length;
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      paidOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      paidOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
    };
  }
};
