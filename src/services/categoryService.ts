import { supabase } from '../lib/supabase.ts';

export interface Category {
  id?: number;
  name: string;
  description?: string;
  image_url?: string;
  image_data?: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  product_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image_data?: string;
  color: string;
  sort_order?: number;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  image_data?: string;
  color?: string;
  is_active?: boolean;
  sort_order?: number;
}

// Récupérer toutes les catégories actives
export const getActiveCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return [];
  }
};

// Récupérer toutes les catégories (admin)
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return [];
  }
};

// Récupérer une catégorie par ID
export const getCategoryById = async (id: number): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    return null;
  }
};

// Récupérer une catégorie par nom
export const getCategoryByName = async (name: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('name', name)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    return null;
  }
};

// Créer une nouvelle catégorie
export const createCategory = async (categoryData: CreateCategoryData): Promise<Category | null> => {
  try {
    console.log('🔄 Tentative de création de catégorie:', categoryData);
    
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        ...categoryData,
        is_active: true,
        sort_order: categoryData.sort_order || 0,
        product_count: 0
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la création de la catégorie:', error);
      return null;
    }

    console.log('✅ Catégorie créée avec succès:', data);
    return data;
  } catch (error) {
    console.error('❌ Erreur lors de la création de la catégorie:', error);
    return null;
  }
};

// Mettre à jour une catégorie
export const updateCategory = async (id: number, categoryData: UpdateCategoryData): Promise<boolean> => {
  try {
    console.log('🔄 Tentative de mise à jour de la catégorie:', id, categoryData);
    
    const { error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id);

    if (error) {
      console.error('❌ Erreur lors de la mise à jour de la catégorie:', error);
      return false;
    }

    console.log('✅ Catégorie mise à jour avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de la catégorie:', error);
    return false;
  }
};

// Supprimer une catégorie
export const deleteCategory = async (id: number): Promise<boolean> => {
  try {
    console.log('🔄 Tentative de suppression de la catégorie:', id);
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Erreur lors de la suppression de la catégorie:', error);
      return false;
    }

    console.log('✅ Catégorie supprimée avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la catégorie:', error);
    return false;
  }
};

// Activer/Désactiver une catégorie
export const toggleCategoryStatus = async (id: number, isActive: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('categories')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) {
      console.error('Erreur lors du changement de statut de la catégorie:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors du changement de statut de la catégorie:', error);
    return false;
  }
};

// Changer l'ordre des catégories
export const updateCategoryOrder = async (id: number, newOrder: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('categories')
      .update({ sort_order: newOrder })
      .eq('id', id);

    if (error) {
      console.error('Erreur lors du changement d\'ordre de la catégorie:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors du changement d\'ordre de la catégorie:', error);
    return false;
  }
};

// Obtenir les statistiques des catégories
export const getCategoryStats = async () => {
  try {
    const { data, error } = await supabase
      .from('categories_stats')
      .select('*')
      .single();

    if (error) {
      console.error('Erreur lors de la récupération des statistiques des catégories:', error);
      return {
        total_categories: 0,
        active_categories: 0,
        inactive_categories: 0,
        total_products: 0,
        average_products_per_category: 0,
      };
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques des catégories:', error);
    return {
      total_categories: 0,
      active_categories: 0,
      inactive_categories: 0,
      total_products: 0,
      average_products_per_category: 0,
    };
  }
};

// Rechercher des catégories
export const searchCategories = async (searchTerm: string): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Erreur lors de la recherche des catégories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la recherche des catégories:', error);
    return [];
  }
};

// Mettre à jour le nombre de produits d'une catégorie
export const updateCategoryProductCount = async (categoryName: string, increment: boolean = true): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('categories')
      .update({ 
        product_count: increment 
          ? supabase.sql`product_count + 1`
          : supabase.sql`GREATEST(0, product_count - 1)`
      })
      .eq('name', categoryName);

    if (error) {
      console.error('Erreur lors de la mise à jour du nombre de produits:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du nombre de produits:', error);
    return false;
  }
};
