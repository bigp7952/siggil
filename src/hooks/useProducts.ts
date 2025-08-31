import { useState, useEffect, useCallback } from 'react';
import { useProducts as useProductsContext } from '../contexts/ProductContext';
import { validateProduct } from '../utils/validation';

export interface ProductFilters {
  category: string;
  size: string;
  color: string;
  priceRange: { min: number; max: number };
  searchQuery: string;
  sortBy: 'name' | 'price' | 'date' | 'popularity';
  sortOrder: 'asc' | 'desc';
}

export const useProducts = () => {
  const { state, setFilters, getFilteredProducts, addProduct, updateProduct, deleteProduct } = useProductsContext();
  const [localFilters, setLocalFilters] = useState<ProductFilters>({
    category: 'all',
    size: 'all',
    color: 'all',
    priceRange: { min: 0, max: 1000000 },
    searchQuery: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Appliquer les filtres locaux au contexte
  useEffect(() => {
    setFilters({
      category: localFilters.category,
      size: localFilters.size,
      color: localFilters.color,
      priceRange: localFilters.priceRange,
      searchQuery: localFilters.searchQuery
    });
  }, [localFilters, setFilters]);

  // Obtenir les produits filtrés et triés
  const getSortedProducts = useCallback(() => {
    const filteredProducts = getFilteredProducts();
    
    return filteredProducts.sort((a, b) => {
      let comparison = 0;
      
      switch (localFilters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'date':
          comparison = new Date(a.id).getTime() - new Date(b.id).getTime();
          break;
        case 'popularity':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        default:
          comparison = 0;
      }
      
      return localFilters.sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [getFilteredProducts, localFilters.sortBy, localFilters.sortOrder]);

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setLocalFilters(prev => ({ ...prev, ...newFilters }));
    setError(null);
  }, []);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setLocalFilters({
      category: 'all',
      size: 'all',
      color: 'all',
      priceRange: { min: 0, max: 1000000 },
      searchQuery: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
    setError(null);
  }, []);

  // Ajouter un produit avec validation
  const addProductWithValidation = useCallback(async (productData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const validation = validateProduct(productData);
      
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      addProduct(productData);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'ajout du produit';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [addProduct]);

  // Mettre à jour un produit avec validation
  const updateProductWithValidation = useCallback(async (productData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const validation = validateProduct(productData);
      
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      updateProduct(productData);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du produit';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateProduct]);

  // Supprimer un produit
  const deleteProductWithConfirmation = useCallback(async (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setIsLoading(true);
      setError(null);

      try {
        deleteProduct(productId);
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du produit';
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    }
    return false;
  }, [deleteProduct]);

  // Obtenir les statistiques des produits
  const getProductStats = useCallback(() => {
    const products = getFilteredProducts();
    
    return {
      total: products.length,
      byCategory: products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averagePrice: products.length > 0 
        ? products.reduce((sum, product) => sum + product.price, 0) / products.length 
        : 0,
      totalStock: products.reduce((sum, product) => sum + product.stock, 0),
      newProducts: products.filter(product => product.isNew).length,
      activeProducts: products.filter(product => product.isActive).length
    };
  }, [getFilteredProducts]);

  // Rechercher des produits
  const searchProducts = useCallback((query: string) => {
    updateFilters({ searchQuery: query });
  }, [updateFilters]);

  // Filtrer par catégorie
  const filterByCategory = useCallback((category: string) => {
    updateFilters({ category });
  }, [updateFilters]);

  // Filtrer par taille
  const filterBySize = useCallback((size: string) => {
    updateFilters({ size });
  }, [updateFilters]);

  // Filtrer par couleur
  const filterByColor = useCallback((color: string) => {
    updateFilters({ color });
  }, [updateFilters]);

  // Filtrer par prix
  const filterByPrice = useCallback((min: number, max: number) => {
    updateFilters({ priceRange: { min, max } });
  }, [updateFilters]);

  // Trier les produits
  const sortProducts = useCallback((sortBy: ProductFilters['sortBy'], sortOrder: ProductFilters['sortOrder'] = 'asc') => {
    updateFilters({ sortBy, sortOrder });
  }, [updateFilters]);

  // Obtenir les catégories disponibles
  const getAvailableCategories = useCallback(() => {
    const products = getFilteredProducts();
    const categories = new Set(products.map(product => product.category));
    return Array.from(categories);
  }, [getFilteredProducts]);

  // Obtenir les tailles disponibles
  const getAvailableSizes = useCallback(() => {
    const products = getFilteredProducts();
    const sizes = new Set(products.flatMap(product => product.sizes));
    return Array.from(sizes).sort();
  }, [getFilteredProducts]);

  // Obtenir les couleurs disponibles
  const getAvailableColors = useCallback(() => {
    const products = getFilteredProducts();
    const colors = new Set(products.flatMap(product => product.colors));
    return Array.from(colors).sort();
  }, [getFilteredProducts]);

  // Obtenir la plage de prix
  const getPriceRange = useCallback(() => {
    const products = getFilteredProducts();
    if (products.length === 0) return { min: 0, max: 0 };
    
    const prices = products.map(product => product.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [getFilteredProducts]);

  return {
    // État
    products: getSortedProducts(),
    filters: localFilters,
    isLoading,
    error,
    stats: getProductStats(),
    
    // Actions de filtrage
    updateFilters,
    resetFilters,
    searchProducts,
    filterByCategory,
    filterBySize,
    filterByColor,
    filterByPrice,
    sortProducts,
    
    // Actions CRUD
    addProduct: addProductWithValidation,
    updateProduct: updateProductWithValidation,
    deleteProduct: deleteProductWithConfirmation,
    
    // Utilitaires
    getAvailableCategories,
    getAvailableSizes,
    getAvailableColors,
    getPriceRange,
    
    // État du contexte
    state
  };
};
