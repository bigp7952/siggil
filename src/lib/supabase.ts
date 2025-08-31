import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variables d\'environnement Supabase manquantes. Vérifiez votre fichier .env');
  console.warn('Utilisez des valeurs par défaut pour éviter les erreurs.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour les tables Supabase
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          category: string;
          price: number;
          original_price: number | null;
          stock: number;
          image: string;
          sizes: string[];
          colors: string[];
          is_new: boolean;
          is_active: boolean;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          price: number;
          original_price?: number | null;
          stock: number;
          image: string;
          sizes: string[];
          colors: string[];
          is_new?: boolean;
          is_active?: boolean;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          price?: number;
          original_price?: number | null;
          stock?: number;
          image?: string;
          sizes?: string[];
          colors?: string[];
          is_new?: boolean;
          is_active?: boolean;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          total: number;
          status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
          payment_method: string;
          user_info: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
            email: string;
          };
          items: Array<{
            productId: string;
            name: string;
            price: number;
            quantity: number;
            size: string;
            color: string;
          }>;
          city: string;
          address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total: number;
          status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
          payment_method: string;
          user_info: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
            email: string;
          };
          items: Array<{
            productId: string;
            name: string;
            price: number;
            quantity: number;
            size: string;
            color: string;
          }>;
          city: string;
          address: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total?: number;
          status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
          payment_method?: string;
          user_info?: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
            email: string;
          };
          items?: Array<{
            productId: string;
            name: string;
            price: number;
            quantity: number;
            size: string;
            color: string;
          }>;
          city?: string;
          address?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          phone_number: string;
          email: string;
          city: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          phone_number: string;
          email: string;
          city: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          phone_number?: string;
          email?: string;
          city?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      premium_requests: {
        Row: {
          id: string;
          user_id: string;
          status: 'pending' | 'approved' | 'rejected';
          code: string | null;
          social_networks: string[];
          user_info: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
            email: string;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: 'pending' | 'approved' | 'rejected';
          code?: string | null;
          social_networks: string[];
          user_info: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
            email: string;
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: 'pending' | 'approved' | 'rejected';
          code?: string | null;
          social_networks?: string[];
          user_info?: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
            email: string;
          };
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          size: string;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity: number;
          size: string;
          color: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
          size?: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type AdminUser = Database['public']['Tables']['admin_users']['Row'];
export type PremiumRequest = Database['public']['Tables']['premium_requests']['Row'];
export type CartItem = Database['public']['Tables']['cart_items']['Row'];

// Types pour les insertions
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type AdminUserInsert = Database['public']['Tables']['admin_users']['Insert'];
export type PremiumRequestInsert = Database['public']['Tables']['premium_requests']['Insert'];
export type CartItemInsert = Database['public']['Tables']['cart_items']['Insert'];

// Types pour les mises à jour
export type ProductUpdate = Database['public']['Tables']['products']['Update'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];
export type AdminUserUpdate = Database['public']['Tables']['admin_users']['Update'];
export type PremiumRequestUpdate = Database['public']['Tables']['premium_requests']['Update'];
export type CartItemUpdate = Database['public']['Tables']['cart_items']['Update'];
