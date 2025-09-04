import { supabase } from '../lib/supabase.ts';

export interface Product {
  id?: string;
  product_id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  stock: number;
  image_url?: string;
  image_data?: string;
  sizes: string[];
  colors: string[];
  is_new: boolean;
  is_active: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductData {
  product_id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  stock: number;
  image_url?: string;
  image_data?: string;
  sizes: string[];
  colors: string[];
  is_new?: boolean;
  is_active?: boolean;
  description?: string;
}

export interface UpdateProductData {
  name?: string;
  category?: string;
  price?: number;
  original_price?: number;
  stock?: number;
  image_url?: string;
  image_data?: string;
  sizes?: string[];
  colors?: string[];
  is_new?: boolean;
  is_active?: boolean;
  description?: string;
}

// Créer un nouveau produit
export const createProduct = async (productData: CreateProductData): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du produit:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    return null;
  }
};

// Récupérer tous les produits actifs (pour les utilisateurs)
export const getAllActiveProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }
};

// Récupérer tous les produits (pour l'admin)
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }
};

// Récupérer un produit par ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('product_id', productId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return null;
  }
};

// Mettre à jour un produit
export const updateProduct = async (productId: string, updateData: UpdateProductData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('product_id', productId);

    if (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    return false;
  }
};

// Supprimer un produit
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('product_id', productId);

    if (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return false;
  }
};

// Récupérer les produits par catégorie
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des produits par catégorie:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des produits par catégorie:', error);
    return [];
  }
};

// Récupérer les nouveaux produits
export const getNewProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_new', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des nouveaux produits:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des nouveaux produits:', error);
    return [];
  }
};

// Rechercher des produits
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la recherche de produits:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la recherche de produits:', error);
    return [];
  }
};

// Obtenir les statistiques des produits
export const getProductStats = async () => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Erreur lors de la récupération des statistiques des produits:', error);
      return {
        totalProducts: 0,
        activeProducts: 0,
        newProducts: 0,
        lowStockProducts: 0,
        categories: {},
      };
    }

    const totalProducts = products.length;
    const activeProducts = products.filter(product => product.is_active).length;
    const newProducts = products.filter(product => product.is_new).length;
    const lowStockProducts = products.filter(product => product.stock < 10).length;
    
    const categories: Record<string, number> = {};
    products.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });

    return {
      totalProducts,
      activeProducts,
      newProducts,
      lowStockProducts,
      categories,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques des produits:', error);
    return {
      totalProducts: 0,
      activeProducts: 0,
      newProducts: 0,
      lowStockProducts: 0,
      categories: {},
    };
  }
};




