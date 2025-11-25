import { createClient } from '@supabase/supabase-js';

// Utiliser les variables d'environnement avec fallback
// Dans Create React App, process.env.REACT_APP_* est remplacé par webpack au moment du build
// Il faut utiliser directement process.env.REACT_APP_* pour que webpack puisse faire le remplacement

// Accès direct aux variables d'environnement (remplacées par webpack au build time)
// @ts-ignore - process.env est remplacé par webpack, mais TypeScript ne le sait pas
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://zkhnngdzqqxzhvxbegxz.supabase.co';
// @ts-ignore
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
// @ts-ignore
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_KEY || '';

// Vérification des variables d'environnement
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erreur: Variables d\'environnement Supabase manquantes!');
  console.error('URL:', supabaseUrl ? 'OK' : 'MANQUANT');
  console.error('Anon Key:', supabaseAnonKey ? 'OK' : 'MANQUANT');
}

// Vérification stricte avant de créer les clients
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Variables d'environnement Supabase manquantes!\n` +
    `URL: ${supabaseUrl ? 'OK' : 'MANQUANT'}\n` +
    `Anon Key: ${supabaseAnonKey ? 'OK' : 'MANQUANT'}\n` +
    `Vérifiez que le fichier .env contient REACT_APP_SUPABASE_URL et REACT_APP_SUPABASE_ANON_KEY`
  );
}

// Client public (pour les opérations utilisateur)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Client admin (pour les opérations admin uniquement côté serveur)
// Note: Service key peut être vide en développement, mais nécessaire en production
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase; // Fallback vers le client public si service key n'est pas disponible

// Fonction de test de connexion
export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('products').select('count').limit(1);
    if (error) {
      console.error('Erreur de connexion Supabase:', error);
      return false;
    }
    console.log('Connexion Supabase réussie!');
    return true;
  } catch (err) {
    console.error('Erreur lors du test de connexion:', err);
    return false;
  }
};

// Types pour les tables
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          phone_number: string;
          first_name: string | null;
          last_name: string | null;
          address: string | null;
          city: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone_number: string;
          first_name?: string | null;
          last_name?: string | null;
          address?: string | null;
          city?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone_number?: string;
          first_name?: string | null;
          last_name?: string | null;
          address?: string | null;
          city?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          category: string;
          description: string | null;
          price: number;
          original_price: number | null;
          stock: number;
          image_url: string | null;
          image_data: string | null;
          sizes: string[];
          colors: string[];
          is_new: boolean;
          is_active: boolean;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          category: string;
          description?: string | null;
          price: number;
          original_price?: number | null;
          stock?: number;
          image_url?: string | null;
          image_data?: string | null;
          sizes?: string[];
          colors?: string[];
          is_new?: boolean;
          is_active?: boolean;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          category?: string;
          description?: string | null;
          price?: number;
          original_price?: number | null;
          stock?: number;
          image_url?: string | null;
          image_data?: string | null;
          sizes?: string[];
          colors?: string[];
          is_new?: boolean;
          is_active?: boolean;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          color: string | null;
          image_data: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          color?: string | null;
          image_data?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          color?: string | null;
          image_data?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_id: string;
          user_id: string | null;
          user_info: any;
          items: any;
          total: number;
          status: string;
          payment_method: string | null;
          tracking_info: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          user_id?: string | null;
          user_info: any;
          items: any;
          total: number;
          status?: string;
          payment_method?: string | null;
          tracking_info?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          user_id?: string | null;
          user_info?: any;
          items?: any;
          total?: number;
          status?: string;
          payment_method?: string | null;
          tracking_info?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      premium_requests: {
        Row: {
          id: string;
          name: string;
          phone: string;
          status: string;
          code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          status?: string;
          code?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          status?: string;
          code?: string | null;
          created_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          phone_number: string;
          password_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone_number: string;
          password_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          phone_number?: string;
          password_hash?: string;
          created_at?: string;
        };
      };
    };
  };
}

