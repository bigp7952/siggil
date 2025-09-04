import { supabase } from '../lib/supabase.ts';

export interface PopularProduct {
  id: string;  // Changé de number à string pour correspondre au UUID converti en TEXT
  product_id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  image_url?: string;
  image_data?: string;
  is_new: boolean;
  is_active: boolean;
  stock: number;
  description?: string;
  sizes?: any;  // Changé de string[] à any pour JSONB
  colors?: any; // Changé de string[] à any pour JSONB
  created_at: string;
  order_count: number;
  total_quantity_ordered: number;
  total_revenue: number;
}

// Récupérer les produits les plus populaires
export const getPopularProducts = async (limit: number = 8): Promise<PopularProduct[]> => {
  try {
    console.log('🔄 Récupération des produits populaires...');
    
    // Utiliser la fonction SQL que nous avons créée
    const { data, error } = await supabase
      .rpc('get_popular_products', { limit_count: limit });

    if (error) {
      console.error('❌ Erreur lors de la récupération des produits populaires:', error);
      
      // Fallback : récupérer les produits actifs les plus récents
      console.log('🔄 Fallback : récupération des produits actifs récents...');
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fallbackError) {
        console.error('❌ Erreur lors du fallback:', fallbackError);
        return [];
      }

      // Transformer les données pour correspondre à l'interface
      return (fallbackData || []).map(product => ({
        ...product,
        order_count: 0,
        total_quantity_ordered: 0,
        total_revenue: 0
      }));
    }

    console.log('✅ Produits populaires récupérés:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des produits populaires:', error);
    return [];
  }
};

// Récupérer les produits populaires par catégorie
export const getPopularProductsByCategory = async (category: string, limit: number = 4): Promise<PopularProduct[]> => {
  try {
    console.log(`🔄 Récupération des produits populaires pour la catégorie: ${category}`);
    
    const { data, error } = await supabase
      .from('popular_products')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('order_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Erreur lors de la récupération par catégorie:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Erreur lors de la récupération par catégorie:', error);
    return [];
  }
};

// Mettre à jour les statistiques de popularité d'un produit
export const updateProductPopularity = async (productId: string): Promise<boolean> => {
  try {
    // Cette fonction pourrait être appelée après chaque commande
    // pour mettre à jour les statistiques en temps réel
    console.log(`🔄 Mise à jour de la popularité du produit: ${productId}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de la popularité:', error);
    return false;
  }
};
