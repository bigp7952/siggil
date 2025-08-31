import { supabase } from '../lib/supabase.ts';
import { 
  Product, Order, User, AdminUser, PremiumRequest, CartItem,
  ProductInsert, OrderInsert, UserInsert, PremiumRequestInsert, CartItemInsert,
  ProductUpdate, UserUpdate
} from '../lib/supabase';

// ===== SERVICES PRODUITS =====
export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        throw new Error('Impossible de récupérer les produits');
      }
      
      return data || [];
    } catch (error) {
      console.error('Erreur productService.getAllProducts:', error);
      throw error;
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Produit non trouvé
        }
        console.error('Erreur lors de la récupération du produit:', error);
        throw new Error('Impossible de récupérer le produit');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur productService.getProductById:', error);
      throw error;
    }
  },

  async createProduct(product: ProductInsert): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la création du produit:', error);
        throw new Error('Impossible de créer le produit');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur productService.createProduct:', error);
      throw error;
    }
  },

  async updateProduct(id: string, updates: ProductUpdate): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
        throw new Error('Impossible de mettre à jour le produit');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur productService.updateProduct:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        throw new Error('Impossible de supprimer le produit');
      }
    } catch (error) {
      console.error('Erreur productService.deleteProduct:', error);
      throw error;
    }
  },

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors de la recherche de produits:', error);
        throw new Error('Impossible de rechercher les produits');
      }
      
      return data || [];
    } catch (error) {
      console.error('Erreur productService.searchProducts:', error);
      throw error;
    }
  }
};

// ===== SERVICES COMMANDES =====
export const orderService = {
  async getAllOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        throw new Error('Impossible de récupérer les commandes');
      }
      
      return data || [];
    } catch (error) {
      console.error('Erreur orderService.getAllOrders:', error);
      throw error;
    }
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Erreur lors de la récupération de la commande:', error);
        throw new Error('Impossible de récupérer la commande');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur orderService.getOrderById:', error);
      throw error;
    }
  },

  async createOrder(order: OrderInsert): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert(order)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la création de la commande:', error);
        throw new Error('Impossible de créer la commande');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur orderService.createOrder:', error);
      throw error;
    }
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw new Error('Impossible de mettre à jour le statut');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur orderService.updateOrderStatus:', error);
      throw error;
    }
  },

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors de la récupération des commandes utilisateur:', error);
        throw new Error('Impossible de récupérer les commandes');
      }
      
      return data || [];
    } catch (error) {
      console.error('Erreur orderService.getOrdersByUserId:', error);
      throw error;
    }
  }
};

// ===== SERVICES UTILISATEURS =====
export const userService = {
  async createUser(user: UserInsert): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw new Error('Impossible de créer l\'utilisateur');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur userService.createUser:', error);
      throw error;
    }
  },

  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        throw new Error('Impossible de récupérer l\'utilisateur');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur userService.getUserById:', error);
      throw error;
    }
  },

  async getUserByPhone(phoneNumber: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        throw new Error('Impossible de récupérer l\'utilisateur');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur userService.getUserByPhone:', error);
      throw error;
    }
  },

  async updateUser(id: string, updates: UserUpdate): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        throw new Error('Impossible de mettre à jour l\'utilisateur');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur userService.updateUser:', error);
      throw error;
    }
  }
};

// ===== SERVICES ADMIN =====
export const adminService = {
  async authenticateAdmin(username: string, password: string): Promise<AdminUser | null> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password_hash', password)
        .eq('is_active', true)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Admin non trouvé ou mot de passe incorrect
        }
        console.error('Erreur lors de l\'authentification admin:', error);
        throw new Error('Erreur d\'authentification');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur adminService.authenticateAdmin:', error);
      throw error;
    }
  },

  async getAdminById(id: string): Promise<AdminUser | null> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Erreur lors de la récupération de l\'admin:', error);
        throw new Error('Impossible de récupérer l\'admin');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur adminService.getAdminById:', error);
      throw error;
    }
  }
};

// ===== SERVICES DEMANDES PREMIUM =====
export const premiumRequestService = {
  async getAllPremiumRequests(): Promise<PremiumRequest[]> {
    try {
      const { data, error } = await supabase
        .from('premium_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors de la récupération des demandes premium:', error);
        throw new Error('Impossible de récupérer les demandes premium');
      }
      
      return data || [];
    } catch (error) {
      console.error('Erreur premiumRequestService.getAllPremiumRequests:', error);
      throw error;
    }
  },

  async createPremiumRequest(request: PremiumRequestInsert): Promise<PremiumRequest> {
    try {
      const { data, error } = await supabase
        .from('premium_requests')
        .insert(request)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la création de la demande premium:', error);
        throw new Error('Impossible de créer la demande premium');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur premiumRequestService.createPremiumRequest:', error);
      throw error;
    }
  },

  async approvePremiumRequest(id: string, code: string): Promise<PremiumRequest> {
    try {
      const { data, error } = await supabase
        .from('premium_requests')
        .update({ status: 'approved', code })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de l\'approbation de la demande premium:', error);
        throw new Error('Impossible d\'approuver la demande premium');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur premiumRequestService.approvePremiumRequest:', error);
      throw error;
    }
  },

  async rejectPremiumRequest(id: string): Promise<PremiumRequest> {
    try {
      const { data, error } = await supabase
        .from('premium_requests')
        .update({ status: 'rejected' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors du rejet de la demande premium:', error);
        throw new Error('Impossible de rejeter la demande premium');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur premiumRequestService.rejectPremiumRequest:', error);
      throw error;
    }
  },

  async getPremiumRequestsByUserId(userId: string): Promise<PremiumRequest[]> {
    try {
      const { data, error } = await supabase
        .from('premium_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors de la récupération des demandes premium utilisateur:', error);
        throw new Error('Impossible de récupérer les demandes premium');
      }
      
      return data || [];
    } catch (error) {
      console.error('Erreur premiumRequestService.getPremiumRequestsByUserId:', error);
      throw error;
    }
  }
};

// ===== SERVICES PANIER =====
export const cartService = {
  async getCartItemsByUserId(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors de la récupération des articles du panier:', error);
        throw new Error('Impossible de récupérer le panier');
      }
      
      return data || [];
    } catch (error) {
      console.error('Erreur cartService.getCartItemsByUserId:', error);
      throw error;
    }
  },

  async addCartItem(item: CartItemInsert): Promise<CartItem> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .insert(item)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        throw new Error('Impossible d\'ajouter au panier');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur cartService.addCartItem:', error);
      throw error;
    }
  },

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la mise à jour de la quantité:', error);
        throw new Error('Impossible de mettre à jour la quantité');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur cartService.updateCartItemQuantity:', error);
      throw error;
    }
  },

  async removeCartItem(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erreur lors de la suppression de l\'article:', error);
        throw new Error('Impossible de supprimer l\'article');
      }
    } catch (error) {
      console.error('Erreur cartService.removeCartItem:', error);
      throw error;
    }
  },

  async clearUserCart(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        console.error('Erreur lors du vidage du panier:', error);
        throw new Error('Impossible de vider le panier');
      }
    } catch (error) {
      console.error('Erreur cartService.clearUserCart:', error);
      throw error;
    }
  }
};

// ===== FONCTIONS UTILITAIRES =====
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ===== FONCTIONS DE MIGRATION =====
export const migrationService = {
  // Convertir les données locales vers le format Supabase
  convertLocalProductToSupabase(localProduct: any): ProductInsert {
    return {
      name: localProduct.name,
      category: localProduct.category,
      price: localProduct.price,
      original_price: localProduct.originalPrice || null,
      stock: localProduct.stock,
      image: localProduct.image,
      sizes: localProduct.sizes || [],
      colors: localProduct.colors || [],
      is_new: localProduct.isNew || false,
      is_active: localProduct.isActive !== false,
      description: localProduct.description || null
    };
  },

  convertLocalOrderToSupabase(localOrder: any): OrderInsert {
    return {
      user_id: localOrder.userId || generateUniqueId(),
      total: localOrder.total,
      status: localOrder.status || 'pending',
      payment_method: localOrder.paymentMethod,
      user_info: localOrder.userInfo,
      items: localOrder.items,
      city: localOrder.city,
      address: localOrder.address
    };
  },

  convertLocalPremiumRequestToSupabase(localRequest: any): PremiumRequestInsert {
    return {
      user_id: localRequest.userId || generateUniqueId(),
      status: localRequest.status || 'pending',
      code: localRequest.code || null,
      social_networks: localRequest.socialNetworks || [],
      user_info: localRequest.userInfo
    };
  }
};
