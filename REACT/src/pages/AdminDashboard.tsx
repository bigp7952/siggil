import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdmin } from '../contexts/AdminContext.tsx';
import { useToast } from '../contexts/ToastContext.tsx';
import { useConfirm } from '../contexts/ConfirmContext.tsx';
import AdminHeader from '../components/common/AdminHeader.tsx';
import ProductForm from '../components/admin/ProductForm.tsx';
import PremiumRequestModal from '../components/admin/PremiumRequestModal.tsx';
import LogisticsCharts from '../components/admin/LogisticsCharts.tsx';
import IntelligentSuggestions from '../components/admin/IntelligentSuggestions.tsx';
import { formatImageSrc, handleImageError } from '../utils/imageUtils.ts';

const AdminDashboard: React.FC = () => {
  const { state, loadOrders, loadPremiumRequests, loadProducts, loadCategories, updateStats, isAdminAuthenticated, approvePremiumRequest, rejectPremiumRequest, updateOrderStatus, deleteOrder, addProduct, deleteProduct, updateProduct } = useAdmin();
  const { showSuccess, showError, showWarning } = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>('');
  const [selectedPremiumRequest, setSelectedPremiumRequest] = useState<any>(null);
  const [isProcessingPremium, setIsProcessingPremium] = useState(false);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'in'>('all');
  // États pour les commandes
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSortBy, setOrderSortBy] = useState<'date' | 'amount' | 'name'>('date');
  const [orderSortOrder, setOrderSortOrder] = useState<'asc' | 'desc'>('desc');
  // États pour les produits premium
  const [premiumSearchQuery, setPremiumSearchQuery] = useState('');
  const [premiumCategoryFilter, setPremiumCategoryFilter] = useState<string>('all');
  const [premiumSortBy, setPremiumSortBy] = useState<'name' | 'price' | 'stock' | 'date'>('date');
  const [premiumSortOrder, setPremiumSortOrder] = useState<'asc' | 'desc'>('desc');
  const [premiumViewMode, setPremiumViewMode] = useState<'grid' | 'list'>('grid');
  // États pour les demandes premium
  const [premiumRequestSearchQuery, setPremiumRequestSearchQuery] = useState('');
  const [premiumRequestStatusFilter, setPremiumRequestStatusFilter] = useState<string>('all');
  const [premiumRequestSortBy, setPremiumRequestSortBy] = useState<'date' | 'name'>('date');
  const [premiumRequestSortOrder, setPremiumRequestSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // Vérifier la session admin (persistante)
    if (!isAdminAuthenticated) {
      // Vérifier si une session existe dans localStorage
      const savedAdmin = localStorage.getItem('siggil_admin');
      if (!savedAdmin) {
        // Aucune session, rediriger vers login
        console.log('Aucune session admin, redirection vers login');
        navigate('/admin/login', { replace: true });
        return;
      } else {
        // Session existe mais pas encore chargée, attendre le chargement
        console.log('Session admin en cours de restauration...');
        return;
      }
    }
    
    // Session admin active, continuer
    console.log('Session admin active');

    // Charger les données une seule fois au montage du composant
    const initializeData = async () => {
      try {
        setIsInitializing(true);
        
        // Timeout de sécurité pour éviter le blocage infini
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout: Initialisation trop lente')), 10000); // 10 secondes
        });

        await Promise.race([
          Promise.all([
            loadOrders(),
            loadPremiumRequests(),
            loadProducts(),
            loadCategories(),
            updateStats()
          ]),
          timeoutPromise
        ]);
        
        console.log('Dashboard initialisé avec succès');
        setInitializationError(null);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des données:', error);
        setInitializationError(error instanceof Error ? error.message : 'Erreur inconnue');
        // En cas d'erreur, afficher quand même le dashboard avec des données vides
      } finally {
        setIsInitializing(false);
      }
    };

    initializeData();
  }, [isAdminAuthenticated, navigate, loadOrders, loadPremiumRequests, loadProducts, loadCategories, updateStats]); // Ajouter toutes les dépendances nécessaires

  const handleAddProduct = async (productData: any) => {
    try {
      await addProduct({
        name: productData.name,
        category: productData.category,
        price: productData.price,
        original_price: productData.original_price,
        stock: productData.stock,
        // Utiliser image_url et image_data directement depuis productData
        // (ProductForm les a déjà préparés correctement)
        image_url: productData.image_url || null,
        image_data: productData.image_data || null,
        sizes: productData.sizes,
        colors: productData.colors,
        is_new: productData.is_new,
        is_active: productData.is_active,
        is_premium: productData.is_premium || false,
        description: productData.description,
        // Passer aussi images pour compatibilité
        images: productData.images || [],
      });
      
      // Recharger les produits pour afficher le nouveau
      loadProducts();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      showError('Erreur lors de l\'ajout du produit');
    }
  };


  const handleDeleteProduct = async (productId: string) => {
    const confirmed = await confirm({
      title: 'Supprimer le produit',
      message: 'Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
    });

    if (!confirmed) return;

    try {
      await deleteProduct(productId);
      // Recharger les produits pour mettre à jour la liste
      loadProducts();
      showSuccess('Produit supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      showError('Erreur lors de la suppression du produit');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const confirmed = await confirm({
      title: 'Supprimer la commande',
      message: 'Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible et supprimera définitivement toutes les données associées.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
    });

    if (!confirmed) return;

    try {
      await deleteOrder(orderId);
      // Recharger les commandes pour mettre à jour la liste
      loadOrders();
      showSuccess('Commande supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande:', error);
      showError('Erreur lors de la suppression de la commande');
    }
  };

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string, trackingInfo?: string) => {
    try {
      const status = newStatus as 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
      await updateOrderStatus(orderId, status);
      if (trackingInfo) {
        // Ici on pourrait ajouter une fonction pour mettre à jour le suivi
        console.log('Suivi mis à jour:', trackingInfo);
      }
      showSuccess(`Statut mis à jour: ${getStatusText(status)}`);
      // Recharger les commandes
      await loadOrders();
      setShowOrderDetailsModal(false);
      setSelectedOrder(null);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      showError(error?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setEditImagePreview(product.image_url || product.image_data || '');
    setShowEditProductModal(true);
  };

  const handleUpdateProduct = async () => {
    if (editingProduct) {
      try {
        if (!editingProduct.name || !editingProduct.category || editingProduct.price <= 0) {
          showWarning('Veuillez remplir tous les champs obligatoires');
          return;
        }

        const updatedProduct = {
          ...editingProduct,
          image_url: editImagePreview || editingProduct.image_url,
          image_data: editImagePreview || editingProduct.image_data,
        };
        
        await updateProduct(updatedProduct);
        setShowEditProductModal(false);
        setEditingProduct(null);
        setEditImagePreview('');
        
        // Recharger les produits pour afficher les modifications
        loadProducts();
      } catch (error) {
        console.error('Erreur lors de la modification du produit:', error);
        showError('Erreur lors de la modification du produit');
      }
    }
  };

  const handleEditImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showWarning('Veuillez sélectionner un fichier image valide.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showWarning('L\'image ne doit pas dépasser 5MB.');
        return;
      }
      
      // Aperçu immédiat (base64)
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditImagePreview(result);
      };
      reader.readAsDataURL(file);
      
      // Note: L'upload vers Supabase Storage se fera lors de la sauvegarde
      // On stocke le fichier dans editingProduct pour l'upload plus tard
    }
  };

  const removeEditImage = () => {
    setEditImagePreview('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-[#ffba00] bg-[#ffba00]/10 border border-[#ffba00]/20';
      case 'paid': return 'text-[#ffba00] bg-[#ffba00]/10 border border-[#ffba00]/20';
      case 'shipped': return 'text-[#ff6c00] bg-[#ff6c00]/10 border border-[#ff6c00]/20';
      case 'delivered': return 'text-[#ffba00] bg-[#ffba00]/10 border border-[#ffba00]/20';
      case 'cancelled': return 'text-[#e53637] bg-[#e53637]/10 border border-[#e53637]/20';
      default: return 'text-gray-text bg-offwhite border border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'paid': return 'Payé';
      case 'shipped': return 'Expédié';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      default: return 'Inconnu';
    }
  };

  const getUserInfo = (order: any) => {
    const userInfo = order.user_info || order.userInfo;
    if (!userInfo) return { firstName: 'N/A', lastName: 'N/A', phoneNumber: 'N/A' };
    
    return {
      firstName: userInfo.firstName || userInfo.first_name || 'N/A',
      lastName: userInfo.lastName || userInfo.last_name || 'N/A',
      phoneNumber: userInfo.phoneNumber || userInfo.phone_number || 'N/A'
    };
  };

  const location = useLocation();

  // Rediriger vers les pages dédiées selon l'URL
  useEffect(() => {
    if (location.pathname === '/admin/products') {
      setActiveTab('products');
    } else if (location.pathname === '/admin/orders') {
      setActiveTab('orders');
      setShowLowStockOnly(false); // Réinitialiser le filtre quand on change de page
    } else if (location.pathname === '/admin/premium-products') {
      setActiveTab('premium-products');
      setShowLowStockOnly(false);
    } else if (location.pathname === '/admin/premium') {
      setActiveTab('premium');
      setShowLowStockOnly(false);
    } else if (location.pathname === '/admin/dashboard') {
      setActiveTab('overview');
      setShowLowStockOnly(false);
    }
  }, [location.pathname]);

  // Gérer les actions des suggestions intelligentes
  const handleSuggestionAction = (actionId: string, suggestionType: string) => {
    switch (actionId) {
      case 'manage_stock':
        // Rediriger vers la page produits avec filtre stock faible
        setShowLowStockOnly(true);
        setActiveTab('products');
        navigate('/admin/products');
        break;
      case 'view_orders':
        // Rediriger vers la page commandes
        setActiveTab('orders');
        navigate('/admin/orders');
        break;
      default:
        break;
    }
  };

  if (!isAdminAuthenticated) {
    return null;
  }

  // Afficher un indicateur de chargement pendant l'initialisation
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-white relative">
        <AdminHeader />
        <div className="absolute inset-0 flex items-center justify-center bg-white z-40" style={{ top: '64px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-male-red border-t-transparent mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold mb-2 text-blacksoft">Chargement du Dashboard</h2>
            <p className="text-gray-text text-sm">Initialisation des données...</p>
          </div>
        </div>
      </div>
    );
  }

  // Afficher une erreur d'initialisation avec possibilité de retry
  if (initializationError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <AdminHeader />
        <div className="text-center max-w-md mx-4">
          <div className="text-male-red text-6xl mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-4 text-blacksoft">Erreur d'Initialisation</h2>
          <p className="text-gray-text mb-6">{initializationError}</p>
          <button
            onClick={() => {
              setInitializationError(null);
              setIsInitializing(true);
              const initializeData = async () => {
                try {
                  await Promise.all([
                    loadOrders(),
                    loadPremiumRequests(),
                    loadProducts(),
                    updateStats()
                  ]);
                  setInitializationError(null);
                } catch (error) {
                  setInitializationError(error instanceof Error ? error.message : 'Erreur inconnue');
                } finally {
                  setIsInitializing(false);
                }
              };
              initializeData();
            }}
            className="btn-primary"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      {/* Main Content */}
      <main className="py-4 md:py-8 px-4 md:px-0">
        <div className="container-custom">
        {/* Overview Tab */}
        {(activeTab === 'overview' || location.pathname === '/admin/dashboard') && (
          <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div className="text-center mb-6 md:mb-8">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-male-red mb-1 md:mb-2 block">
                Dashboard
              </span>
              <h1 className="text-xl md:text-3xl lg:text-4xl font-display font-bold mb-2 md:mb-4">
                VUE <span className="gradient-text">D'ENSEMBLE</span>
              </h1>
            </div>
            
            {/* Statistics Cards - Enhanced */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card-modern p-4 md:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-[#ff6c00]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-gray-text text-[10px] md:text-xs mb-1 font-medium">Commandes Total</p>
                    <p className="text-xl md:text-3xl font-bold text-blacksoft mb-1">{state.stats.totalOrders}</p>
                    <p className="text-[10px] text-gray-text">En attente: {state.stats.pendingOrders}</p>
                  </div>
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-[#ff6c00]/20 to-[#ff6c00]/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-7 md:h-7 text-[#ff6c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-modern p-4 md:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-[#ffba00]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-gray-text text-[10px] md:text-xs mb-1 font-medium">Revenus Total</p>
                    <p className="text-lg md:text-2xl font-bold text-blacksoft truncate mb-1">{formatCurrency(state.stats.totalRevenue)}</p>
                    <p className="text-[10px] text-gray-text">Toutes commandes</p>
                  </div>
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-[#ffba00]/20 to-[#ffba00]/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-7 md:h-7 text-[#ffba00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-modern p-4 md:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-[#e53637]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-gray-text text-[10px] md:text-xs mb-1 font-medium">Clients</p>
                    <p className="text-xl md:text-3xl font-bold text-blacksoft mb-1">{state.stats.totalCustomers}</p>
                    <p className="text-[10px] text-gray-text">Clients uniques</p>
                  </div>
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-[#e53637]/20 to-[#e53637]/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-7 md:h-7 text-[#e53637]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card-modern p-4 md:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-[#10b981]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-gray-text text-[10px] md:text-xs mb-1 font-medium">Produits</p>
                    <p className="text-xl md:text-3xl font-bold text-blacksoft mb-1">{state.stats.totalProducts}</p>
                    <p className="text-[10px] text-gray-text">Stock faible: {state.stats.lowStockProducts}</p>
                  </div>
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-7 md:h-7 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Main Content Grid - Two Columns Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Left Column - Suggestions & Recent Orders */}
              <div className="lg:col-span-1 space-y-6 md:space-y-8">
                {/* Suggestions Intelligentes */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <IntelligentSuggestions
                    orders={state.orders}
                    products={state.products}
                    stats={state.stats}
                    onActionClick={handleSuggestionAction}
                  />
                </motion.div>

                {/* Recent Orders - Compact */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="card-modern p-4 md:p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base md:text-lg font-display font-bold text-blacksoft">Commandes Récentes</h3>
                    <Link 
                      to="/admin/orders"
                      className="text-xs text-[#ff6c00] hover:underline font-medium"
                    >
                      Voir tout →
                    </Link>
                  </div>
                  
                  {state.orders.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-text">Aucune commande pour le moment</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {state.orders.slice(0, 5).map((order) => {
                        const userInfo = getUserInfo(order);
                        return (
                          <div 
                            key={order.id || order.order_id} 
                            className="p-3 bg-offwhite rounded-lg border border-gray-200 hover:border-[#ff6c00]/30 hover:shadow-md transition-all cursor-pointer"
                            onClick={() => handleViewOrderDetails(order)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-gray-text mb-1 font-mono">#{order.order_id || 'N/A'}</p>
                                <p className="text-sm font-semibold text-blacksoft truncate">{userInfo.firstName} {userInfo.lastName}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-[10px] font-medium ml-2 flex-shrink-0 ${getStatusColor(order.status || 'pending')}`}>
                                {getStatusText(order.status || 'pending')}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-text">
                                {order.createdAt || order.created_at ? new Date(order.createdAt || order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'N/A'}
                              </p>
                              <p className="text-sm font-bold text-blacksoft">{formatCurrency(order.total || 0)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right Column - Charts */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-male-red mb-1 md:mb-2 block">
                          Analytics
                        </span>
                        <h2 className="text-lg md:text-2xl lg:text-3xl font-display font-bold">
                          ANALYSE <span className="gradient-text">LOGIQUE</span>
                        </h2>
                      </div>
                    </div>
                    <LogisticsCharts orders={state.orders} />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {(activeTab === 'orders' || location.pathname === '/admin/orders') && (
          <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
              <div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-male-red mb-1 md:mb-2 block">
                  Gestion
                </span>
                <h1 className="text-xl md:text-3xl lg:text-4xl font-display font-bold">
                  COMMANDES
                </h1>
              </div>
              <button
                onClick={async () => {
                  try {
                    await loadOrders();
                    await updateStats();
                    showSuccess('Commandes actualisées avec succès');
                  } catch (error) {
                    console.error('Erreur lors de l\'actualisation:', error);
                    showError('Erreur lors de l\'actualisation');
                  }
                }}
                className="bg-[#ff6c00] hover:bg-[#e55a00] text-white text-[11px] md:text-xs font-semibold px-4 md:px-6 py-2 md:py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser
              </button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              <div className="card-modern p-3 md:p-4">
                <p className="text-[10px] md:text-xs text-gray-text mb-1">Total</p>
                <p className="text-lg md:text-2xl font-bold text-blacksoft">{state.orders.length}</p>
              </div>
              <div className="card-modern p-3 md:p-4 border-l-4 border-l-[#ffba00]">
                <p className="text-[10px] md:text-xs text-gray-text mb-1">En attente</p>
                <p className="text-lg md:text-2xl font-bold text-blacksoft">{state.orders.filter(o => o.status === 'pending').length}</p>
              </div>
              <div className="card-modern p-3 md:p-4 border-l-4 border-l-[#ff6c00]">
                <p className="text-[10px] md:text-xs text-gray-text mb-1">Payées</p>
                <p className="text-lg md:text-2xl font-bold text-blacksoft">{state.orders.filter(o => o.status === 'paid').length}</p>
              </div>
              <div className="card-modern p-3 md:p-4 border-l-4 border-l-[#e53637]">
                <p className="text-[10px] md:text-xs text-gray-text mb-1">Expédiées</p>
                <p className="text-lg md:text-2xl font-bold text-blacksoft">{state.orders.filter(o => o.status === 'shipped').length}</p>
              </div>
              <div className="card-modern p-3 md:p-4 border-l-4 border-l-[#10b981]">
                <p className="text-[10px] md:text-xs text-gray-text mb-1">Livrées</p>
                <p className="text-lg md:text-2xl font-bold text-blacksoft">{state.orders.filter(o => o.status === 'delivered').length}</p>
              </div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="card-modern p-4 md:p-6">
              <div className="space-y-4">
                {/* Recherche */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une commande (ID, client, téléphone...)"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full bg-offwhite border border-gray-200 rounded-lg px-4 py-2.5 pl-10 text-sm text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {orderSearchQuery && (
                    <button
                      onClick={() => setOrderSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-text hover:text-blacksoft"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Filtres et tri */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Filtre statut */}
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-sm text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="paid">Payé</option>
                    <option value="shipped">Expédié</option>
                    <option value="delivered">Livré</option>
                    <option value="cancelled">Annulé</option>
                  </select>

                  {/* Tri */}
                  <select
                    value={`${orderSortBy}-${orderSortOrder}`}
                    onChange={(e) => {
                      const [by, order] = e.target.value.split('-');
                      setOrderSortBy(by as 'date' | 'amount' | 'name');
                      setOrderSortOrder(order as 'asc' | 'desc');
                    }}
                    className="bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-sm text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                  >
                    <option value="date-desc">Plus récent</option>
                    <option value="date-asc">Plus ancien</option>
                    <option value="amount-desc">Montant décroissant</option>
                    <option value="amount-asc">Montant croissant</option>
                    <option value="name-asc">Client A-Z</option>
                    <option value="name-desc">Client Z-A</option>
                  </select>

                  {/* Export */}
                  <button
                    onClick={() => {
                      const csv = [
                        ['ID', 'Client', 'Téléphone', 'Montant', 'Statut', 'Date'].join(','),
                        ...state.orders.map(o => {
                          const userInfo = getUserInfo(o);
                          return [
                            `"${o.order_id || 'N/A'}"`,
                            `"${userInfo.firstName} ${userInfo.lastName}"`,
                            userInfo.phoneNumber,
                            o.total || 0,
                            getStatusText(o.status || 'pending'),
                            o.createdAt || o.created_at ? new Date(o.createdAt || o.created_at).toLocaleDateString('fr-FR') : 'N/A'
                          ].join(',');
                        })
                      ].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `commandes_${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showSuccess('Export réussi');
                    }}
                    className="text-xs text-gray-text hover:text-[#ff6c00] flex items-center justify-center gap-1 transition-colors bg-offwhite border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Exporter CSV
                  </button>
                </div>
              </div>
            </div>

            {(() => {
              // Filtrage et tri des commandes
              let filteredOrders = state.orders.filter(order => {
                // Filtre par recherche
                if (orderSearchQuery) {
                  const query = orderSearchQuery.toLowerCase();
                  const userInfo = getUserInfo(order);
                  const searchText = `${order.order_id || ''} ${userInfo.firstName} ${userInfo.lastName} ${userInfo.phoneNumber}`.toLowerCase();
                  if (!searchText.includes(query)) return false;
                }
                // Filtre par statut
                if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) return false;
                return true;
              });

              // Tri des commandes
              filteredOrders = [...filteredOrders].sort((a, b) => {
                let comparison = 0;
                switch (orderSortBy) {
                  case 'date':
                    const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
                    const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
                    comparison = dateA - dateB;
                    break;
                  case 'amount':
                    comparison = (a.total || 0) - (b.total || 0);
                    break;
                  case 'name':
                    const nameA = `${getUserInfo(a).firstName} ${getUserInfo(a).lastName}`;
                    const nameB = `${getUserInfo(b).firstName} ${getUserInfo(b).lastName}`;
                    comparison = nameA.localeCompare(nameB);
                    break;
                }
                return orderSortOrder === 'asc' ? comparison : -comparison;
              });

              const totalFiltered = filteredOrders.length;

              return (
                <>
                  {/* Compteur */}
                  <div className="flex items-center justify-between text-sm text-gray-text mb-2">
                    <span>
                      {totalFiltered} commande{totalFiltered > 1 ? 's' : ''} trouvée{totalFiltered > 1 ? 's' : ''}
                      {(orderSearchQuery || orderStatusFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setOrderSearchQuery('');
                            setOrderStatusFilter('all');
                          }}
                          className="ml-2 text-[#ff6c00] hover:underline font-medium"
                        >
                          Réinitialiser
                        </button>
                      )}
                    </span>
                  </div>

                  {totalFiltered === 0 ? (
                    <div className="card-modern p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-text mb-4">
                        {orderSearchQuery || orderStatusFilter !== 'all'
                          ? 'Aucune commande ne correspond à vos critères'
                          : 'Aucune commande pour le moment'}
                      </p>
                      {(orderSearchQuery || orderStatusFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setOrderSearchQuery('');
                            setOrderStatusFilter('all');
                          }}
                          className="btn-primary text-xs px-4 py-2"
                        >
                          Réinitialiser les filtres
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="card-modern p-3 md:p-6">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-offwhite">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-blacksoft uppercase tracking-wider">ID</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-blacksoft uppercase tracking-wider">Client</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-blacksoft uppercase tracking-wider">Téléphone</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-blacksoft uppercase tracking-wider">Montant</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-blacksoft uppercase tracking-wider">Statut</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-blacksoft uppercase tracking-wider">Date</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-blacksoft uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => {
                        const userInfo = getUserInfo(order);
                        return (
                          <tr key={order.id || order.order_id} className="border-b border-gray-100 hover:bg-offwhite transition-colors">
                            <td className="py-3 px-4 text-sm text-gray-text font-mono">{order.order_id || 'N/A'}</td>
                            <td className="py-3 px-4 text-sm text-blacksoft font-medium">{userInfo.firstName} {userInfo.lastName}</td>
                            <td className="py-3 px-4 text-sm text-gray-text">{userInfo.phoneNumber}</td>
                            <td className="py-3 px-4 text-sm text-blacksoft font-semibold">{formatCurrency(order.total || 0)}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || 'pending')}`}>
                                {getStatusText(order.status || 'pending')}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-text">
                              {order.createdAt || order.created_at ? new Date(order.createdAt || order.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col gap-2">
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <select
                                    value={order.status || 'pending'}
                                    onChange={async (e) => {
                                      const newStatus = e.target.value as 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
                                      try {
                                        // Utiliser order_id ou id selon ce qui est disponible
                                        const orderId = order.order_id || order.id;
                                        if (!orderId) {
                                          showError('ID de commande introuvable');
                                          return;
                                        }
                                        await updateOrderStatus(orderId, newStatus);
                                        showSuccess(`Statut mis à jour: ${getStatusText(newStatus)}`);
                                        // Recharger les commandes après un court délai
                                        setTimeout(() => {
                                          loadOrders();
                                        }, 500);
                                      } catch (error: any) {
                                        console.error('Erreur lors de la mise à jour du statut:', error);
                                        showError(error?.message || 'Erreur lors de la mise à jour du statut');
                                      }
                                    }}
                                    className="bg-offwhite border border-gray-200 rounded-lg px-2 py-1 text-xs text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                                  >
                                    <option value="pending">En attente</option>
                                    <option value="paid">Payé</option>
                                    <option value="shipped">Expédié</option>
                                    <option value="delivered">Livré</option>
                                    <option value="cancelled">Annulé</option>
                                  </select>
                                  
                                  <button
                                    onClick={() => handleViewOrderDetails(order)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border border-gray-200"
                                  >
                                    Détails
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleDeleteOrder(order.order_id)}
                                  className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border border-red-200"
                                >
                                  Supprimer
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {filteredOrders.map((order) => {
                    const userInfo = getUserInfo(order);
                    return (
                      <div key={order.id || order.order_id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2.5">
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-text mb-1 font-mono">ID: {order.order_id || 'N/A'}</p>
                            <p className="text-sm font-semibold text-blacksoft truncate">{userInfo.firstName} {userInfo.lastName}</p>
                            <p className="text-xs text-gray-text">{userInfo.phoneNumber}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-[10px] font-medium ml-2 flex-shrink-0 ${getStatusColor(order.status || 'pending')}`}>
                            {getStatusText(order.status || 'pending')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-3 pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-text">
                            {order.createdAt || order.created_at ? new Date(order.createdAt || order.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                          </p>
                          <p className="text-sm font-bold text-blacksoft">{formatCurrency(order.total || 0)}</p>
                        </div>
                        <div className="space-y-2">
                          <select
                            value={order.status || 'pending'}
                            onChange={async (e) => {
                              const newStatus = e.target.value as 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
                              try {
                                // Utiliser order_id ou id selon ce qui est disponible
                                const orderId = order.order_id || order.id;
                                if (!orderId) {
                                  showError('ID de commande introuvable');
                                  return;
                                }
                                await updateOrderStatus(orderId, newStatus);
                                showSuccess(`Statut mis à jour: ${getStatusText(newStatus)}`);
                                // Recharger les commandes après un court délai
                                setTimeout(() => {
                                  loadOrders();
                                }, 500);
                              } catch (error: any) {
                                console.error('Erreur lors de la mise à jour du statut:', error);
                                showError(error?.message || 'Erreur lors de la mise à jour du statut');
                              }
                            }}
                            className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-xs text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                          >
                            <option value="pending">En attente</option>
                            <option value="paid">Payé</option>
                            <option value="shipped">Expédié</option>
                            <option value="delivered">Livré</option>
                            <option value="cancelled">Annulé</option>
                          </select>
                          
                          <button
                            onClick={() => handleViewOrderDetails(order)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors border border-gray-200"
                          >
                            Voir les détails
                          </button>
                          
                          <button
                            onClick={() => handleDeleteOrder(order.order_id)}
                            className="w-full bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors border border-red-200"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                    </div>
                  )
                }
                </>
              );
            })()}
          </div>
        )}

        {/* Products Tab */}
        {(activeTab === 'products' || location.pathname === '/admin/products') && (
          <div className="space-y-4 md:space-y-6">
            {/* Header avec statistiques */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
              <div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-male-red mb-1 md:mb-2 block">
                  Gestion
                </span>
                <h1 className="text-xl md:text-3xl lg:text-4xl font-display font-bold">
                  PRODUITS
                </h1>
              </div>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="btn-primary text-[10px] md:text-xs px-3 md:px-4 py-1.5 md:py-2 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter
              </button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="card-modern p-3 md:p-4">
                <p className="text-[10px] md:text-xs text-gray-text mb-1">Total</p>
                <p className="text-lg md:text-2xl font-bold text-blacksoft">{state.products.filter(p => !p.is_premium).length}</p>
              </div>
              <div className="card-modern p-3 md:p-4 border-l-4 border-l-[#ffba00]">
                <p className="text-[10px] md:text-xs text-gray-text mb-1">Actifs</p>
                <p className="text-lg md:text-2xl font-bold text-blacksoft">{state.products.filter(p => !p.is_premium && p.is_active).length}</p>
              </div>
              <div className="card-modern p-3 md:p-4 border-l-4 border-l-[#e53637]">
                <p className="text-[10px] md:text-xs text-gray-text mb-1">Stock faible</p>
                <p className="text-lg md:text-2xl font-bold text-blacksoft">{state.products.filter(p => !p.is_premium && p.stock < 10 && p.is_active).length}</p>
              </div>
              <div className="card-modern p-3 md:p-4 border-l-4 border-l-[#10b981]">
                <p className="text-[10px] md:text-xs text-gray-text mb-1">En stock</p>
                <p className="text-lg md:text-2xl font-bold text-blacksoft">{state.products.filter(p => !p.is_premium && p.stock > 0 && p.is_active).length}</p>
              </div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="card-modern p-4 md:p-6">
              <div className="space-y-4">
                {/* Recherche */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-offwhite border border-gray-200 rounded-lg px-4 py-2.5 pl-10 text-sm text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-text hover:text-blacksoft"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Filtres et tri */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Filtre catégorie */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-sm text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                  >
                    <option value="all">Toutes les catégories</option>
                    {Array.from(new Set(state.products.filter(p => !p.is_premium).map(p => p.category))).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  {/* Filtre stock */}
                  <select
                    value={stockFilter}
                    onChange={(e) => {
                      setStockFilter(e.target.value as 'all' | 'low' | 'out' | 'in');
                      if (e.target.value === 'low') {
                        setShowLowStockOnly(true);
                      } else {
                        setShowLowStockOnly(false);
                      }
                    }}
                    className="bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-sm text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                  >
                    <option value="all">Tous les stocks</option>
                    <option value="low">Stock faible (&lt;10)</option>
                    <option value="out">Rupture de stock</option>
                    <option value="in">En stock</option>
                  </select>

                  {/* Tri */}
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [by, order] = e.target.value.split('-');
                      setSortBy(by as 'name' | 'price' | 'stock' | 'date');
                      setSortOrder(order as 'asc' | 'desc');
                    }}
                    className="bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-sm text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                  >
                    <option value="date-desc">Plus récent</option>
                    <option value="date-asc">Plus ancien</option>
                    <option value="name-asc">Nom A-Z</option>
                    <option value="name-desc">Nom Z-A</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="stock-asc">Stock croissant</option>
                    <option value="stock-desc">Stock décroissant</option>
                  </select>

                  {/* Vue grille/liste */}
                  <div className="flex items-center gap-2 bg-offwhite border border-gray-200 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-[#ff6c00] text-white' 
                          : 'text-gray-text hover:bg-gray-100'
                      }`}
                    >
                      <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-[#ff6c00] text-white' 
                          : 'text-gray-text hover:bg-gray-100'
                      }`}
                    >
                      <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Actions en masse */}
                {selectedProducts.size > 0 && (
                  <div className="flex items-center justify-between p-3 bg-[#ff6c00]/10 border border-[#ff6c00]/30 rounded-lg">
                    <span className="text-sm font-medium text-[#ff6c00]">
                      {selectedProducts.size} produit(s) sélectionné(s)
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // Action en masse : activer/désactiver
                          showWarning('Fonctionnalité à venir');
                        }}
                        className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Activer/Désactiver
                      </button>
                      <button
                        onClick={() => setSelectedProducts(new Set())}
                        className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {(() => {
              // Filtrage des produits
              let filteredProducts = state.products
                .filter(p => !p.is_premium)
                .filter(p => {
                  // Filtre par recherche
                  if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    if (!p.name.toLowerCase().includes(query) && 
                        !p.category.toLowerCase().includes(query) &&
                        !(p.description?.toLowerCase().includes(query))) {
                      return false;
                    }
                  }
                  // Filtre par catégorie
                  if (selectedCategory !== 'all' && p.category !== selectedCategory) {
                    return false;
                  }
                  // Filtre par stock
                  if (stockFilter === 'low' && (p.stock >= 10 || !p.is_active)) return false;
                  if (stockFilter === 'out' && p.stock > 0) return false;
                  if (stockFilter === 'in' && (p.stock === 0 || !p.is_active)) return false;
                  // Filtre stock faible (legacy)
                  if (showLowStockOnly && (p.stock >= 10 || !p.is_active)) return false;
                  return true;
                });

              // Tri des produits
              filteredProducts = [...filteredProducts].sort((a, b) => {
                let comparison = 0;
                switch (sortBy) {
                  case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                  case 'price':
                    comparison = a.price - b.price;
                    break;
                  case 'stock':
                    comparison = a.stock - b.stock;
                    break;
                  case 'date':
                    const dateA = new Date(a.created_at || a.updated_at || 0).getTime();
                    const dateB = new Date(b.created_at || b.updated_at || 0).getTime();
                    comparison = dateA - dateB;
                    break;
                }
                return sortOrder === 'asc' ? comparison : -comparison;
              });

              const totalFiltered = filteredProducts.length;
              
              return (
                <>
                  {/* Compteur de résultats */}
                  <div className="flex items-center justify-between text-sm text-gray-text mb-4">
                    <span>
                      {totalFiltered} produit{totalFiltered > 1 ? 's' : ''} trouvé{totalFiltered > 1 ? 's' : ''}
                      {(searchQuery || selectedCategory !== 'all' || stockFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                            setStockFilter('all');
                            setShowLowStockOnly(false);
                          }}
                          className="ml-2 text-[#ff6c00] hover:underline font-medium"
                        >
                          Réinitialiser
                        </button>
                      )}
                    </span>
                    <button
                      onClick={() => {
                        const csv = [
                          ['Nom', 'Catégorie', 'Prix', 'Stock', 'Statut'].join(','),
                          ...filteredProducts.map(p => [
                            `"${p.name}"`,
                            p.category,
                            p.price,
                            p.stock,
                            p.is_active ? 'Actif' : 'Inactif'
                          ].join(','))
                        ].join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `produits_${new Date().toISOString().split('T')[0]}.csv`;
                        a.click();
                        URL.revokeObjectURL(url);
                        showSuccess('Export réussi');
                      }}
                      className="text-xs text-gray-text hover:text-[#ff6c00] flex items-center gap-1 transition-colors"
                      title="Exporter en CSV"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Exporter CSV
                    </button>
                  </div>

                  {totalFiltered === 0 ? (
                    <div className="card-modern p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-text mb-4">
                        {searchQuery || selectedCategory !== 'all' || stockFilter !== 'all' 
                          ? 'Aucun produit ne correspond à vos critères'
                          : 'Aucun produit pour le moment'}
                      </p>
                      {(searchQuery || selectedCategory !== 'all' || stockFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                            setStockFilter('all');
                            setShowLowStockOnly(false);
                          }}
                          className="btn-primary text-xs px-4 py-2"
                        >
                          Réinitialiser les filtres
                        </button>
                      )}
                    </div>
                  ) : (
                    viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                    {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="card-modern overflow-hidden hover:shadow-lg transition-all duration-300 group relative"
                >
                  {/* Checkbox pour sélection multiple */}
                  <div className="absolute top-2 right-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.product_id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        const newSelected = new Set(selectedProducts);
                        if (e.target.checked) {
                          newSelected.add(product.product_id);
                        } else {
                          newSelected.delete(product.product_id);
                        }
                        setSelectedProducts(newSelected);
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-[#ff6c00] focus:ring-[#ff6c00] cursor-pointer"
                    />
                  </div>

                  <div className="aspect-square bg-offwhite relative overflow-hidden">
                    <img
                      src={formatImageSrc(product.image_url, product.image_data)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={handleImageError}
                      loading="lazy"
                    />
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.is_new && (
                        <div className="bg-male-red text-white px-2 py-1 rounded-full text-[10px] font-bold">
                          NOUVEAU
                        </div>
                      )}
                      {product.stock < 10 && product.is_active && (
                        <div className="bg-[#e53637] text-white px-2 py-1 rounded-full text-[10px] font-bold">
                          STOCK FAIBLE
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="bg-gray-600 text-white px-2 py-1 rounded-full text-[10px] font-bold">
                          RUPTURE
                        </div>
                      )}
                    </div>
                    {/* Barre de progression du stock */}
                    {product.is_active && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                        <div 
                          className={`h-full transition-all ${
                            product.stock === 0 ? 'bg-gray-600' :
                            product.stock < 10 ? 'bg-[#e53637]' :
                            product.stock < 50 ? 'bg-[#ffba00]' :
                            'bg-[#10b981]'
                          }`}
                          style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="text-blacksoft font-semibold text-sm md:text-lg mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-text text-xs md:text-sm mb-2 md:mb-3">{product.category}</p>
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      <span className="text-male-red font-bold text-sm md:text-lg">{formatCurrency(product.price)}</span>
                      {product.original_price && (
                        <span className="text-gray-medium line-through text-xs md:text-sm">
                          {formatCurrency(product.original_price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs md:text-sm font-medium ${
                          product.stock === 0 ? 'text-gray-600' :
                          product.stock < 10 ? 'text-[#e53637]' :
                          product.stock < 50 ? 'text-[#ffba00]' :
                          'text-[#10b981]'
                        }`}>
                          Stock: {product.stock}
                        </span>
                      </div>
                      <span className={`text-[10px] md:text-xs px-2 py-1 rounded-full ${
                        product.is_active ? 'bg-[#ffba00]/10 text-[#ffba00]' : 'bg-[#e53637]/10 text-[#e53637]'
                      }`}>
                        {product.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 btn-secondary text-[10px] md:text-xs py-1.5 md:py-2"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.product_id)}
                        className="flex-1 btn-primary text-[10px] md:text-xs py-1.5 md:py-2"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
                  ))}
                    </div>
                    ) : (
                      // Vue liste
                      <div className="space-y-3">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="card-modern p-4 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-4">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product.product_id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedProducts);
                              if (e.target.checked) {
                                newSelected.add(product.product_id);
                              } else {
                                newSelected.delete(product.product_id);
                              }
                              setSelectedProducts(newSelected);
                            }}
                            className="w-5 h-5 rounded border-gray-300 text-[#ff6c00] focus:ring-[#ff6c00] cursor-pointer"
                          />
                          
                          {/* Image */}
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-offwhite rounded-lg overflow-hidden flex-shrink-0 relative">
                            <img
                              src={formatImageSrc(product.image_url, product.image_data)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={handleImageError}
                              loading="lazy"
                            />
                            {product.stock < 10 && product.is_active && (
                              <div className="absolute top-1 right-1 bg-[#e53637] text-white px-1.5 py-0.5 rounded text-[8px] font-bold">
                                {product.stock}
                              </div>
                            )}
                          </div>

                          {/* Infos */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-blacksoft font-semibold text-sm md:text-base mb-1 line-clamp-1">
                                  {product.name}
                                  {product.is_new && (
                                    <span className="ml-2 bg-male-red text-white px-2 py-0.5 rounded text-[10px] font-bold">
                                      NOUVEAU
                                    </span>
                                  )}
                                </h3>
                                <p className="text-gray-text text-xs md:text-sm">{product.category}</p>
                              </div>
                              <span className={`text-[10px] md:text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                                product.is_active ? 'bg-[#ffba00]/10 text-[#ffba00]' : 'bg-[#e53637]/10 text-[#e53637]'
                              }`}>
                                {product.is_active ? 'Actif' : 'Inactif'}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div>
                                  <span className="text-male-red font-bold text-sm md:text-base">{formatCurrency(product.price)}</span>
                                  {product.original_price && (
                                    <span className="text-gray-medium line-through text-xs ml-2">
                                      {formatCurrency(product.original_price)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-medium ${
                                    product.stock === 0 ? 'text-gray-600' :
                                    product.stock < 10 ? 'text-[#e53637]' :
                                    product.stock < 50 ? 'text-[#ffba00]' :
                                    'text-[#10b981]'
                                  }`}>
                                    Stock: {product.stock}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="btn-secondary text-[10px] md:text-xs px-3 py-1.5"
                                >
                                  Modifier
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.product_id)}
                                  className="btn-primary text-[10px] md:text-xs px-3 py-1.5"
                                >
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                      </div>
                    )
                  )
                }
                </>
              );
            })()}
          </div>
        )}

        {/* Categories Tab - Redirect to dedicated page */}
        {(activeTab === 'categories' || location.pathname === '/admin/categories') && (
          <div className="text-center">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-male-red mb-2 block">
                Gestion
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                CATÉGORIES
              </h1>
              <p className="text-gray-text mb-8">
                Gérez les catégories populaires de votre site
              </p>
              <Link
                to="/admin/categories"
                className="btn-primary inline-block"
              >
                Gérer les Catégories
              </Link>
            </div>
          </div>
        )}

        {/* Premium Products Tab */}
        {(activeTab === 'premium-products' || location.pathname === '/admin/premium-products') && (
          <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
              <div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#ff6c00] mb-1 md:mb-2 block">
                  Premium
                </span>
                <h1 className="text-xl md:text-3xl lg:text-4xl font-display font-bold">
                  PRODUITS <span className="gradient-text">PREMIUM</span>
                </h1>
              </div>
              <button
                onClick={() => {
                  setShowAddProductModal(true);
                  setEditingProduct({ is_premium: true } as any);
                }}
                className="btn-primary text-[10px] md:text-xs px-3 md:px-4 py-1.5 md:py-2 bg-gradient-karma"
              >
                + Ajouter Premium
              </button>
            </div>

            {/* Statistiques */}
            {(() => {
              const premiumProducts = state.products.filter(p => p.is_premium);
              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <div className="card-modern p-3 md:p-4">
                    <p className="text-[10px] md:text-xs text-gray-text mb-1">Total</p>
                    <p className="text-lg md:text-2xl font-bold text-blacksoft">{premiumProducts.length}</p>
                  </div>
                  <div className="card-modern p-3 md:p-4 border-l-4 border-l-[#ffba00]">
                    <p className="text-[10px] md:text-xs text-gray-text mb-1">Actifs</p>
                    <p className="text-lg md:text-2xl font-bold text-blacksoft">{premiumProducts.filter(p => p.is_active).length}</p>
                  </div>
                  <div className="card-modern p-3 md:p-4 border-l-4 border-l-[#e53637]">
                    <p className="text-[10px] md:text-xs text-gray-text mb-1">Stock faible</p>
                    <p className="text-lg md:text-2xl font-bold text-blacksoft">{premiumProducts.filter(p => p.stock < 10 && p.is_active).length}</p>
                  </div>
                  <div className="card-modern p-3 md:p-4 border-l-4 border-l-[#10b981]">
                    <p className="text-[10px] md:text-xs text-gray-text mb-1">En stock</p>
                    <p className="text-lg md:text-2xl font-bold text-blacksoft">{premiumProducts.filter(p => p.stock > 0 && p.is_active).length}</p>
                  </div>
                </div>
              );
            })()}

            {/* Barre de recherche et filtres */}
            <div className="card-modern p-4 md:p-6">
              <div className="space-y-4">
                {/* Recherche */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un produit premium..."
                    value={premiumSearchQuery}
                    onChange={(e) => setPremiumSearchQuery(e.target.value)}
                    className="w-full bg-offwhite border border-gray-200 rounded-lg px-4 py-2.5 pl-10 text-sm text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {premiumSearchQuery && (
                    <button
                      onClick={() => setPremiumSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-text hover:text-blacksoft"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Filtres et tri */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Filtre catégorie */}
                  <select
                    value={premiumCategoryFilter}
                    onChange={(e) => setPremiumCategoryFilter(e.target.value)}
                    className="bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-sm text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                  >
                    <option value="all">Toutes les catégories</option>
                    {Array.from(new Set(state.products.filter(p => p.is_premium).map(p => p.category))).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  {/* Tri */}
                  <select
                    value={`${premiumSortBy}-${premiumSortOrder}`}
                    onChange={(e) => {
                      const [by, order] = e.target.value.split('-');
                      setPremiumSortBy(by as 'name' | 'price' | 'stock' | 'date');
                      setPremiumSortOrder(order as 'asc' | 'desc');
                    }}
                    className="bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-sm text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                  >
                    <option value="date-desc">Plus récent</option>
                    <option value="date-asc">Plus ancien</option>
                    <option value="name-asc">Nom A-Z</option>
                    <option value="name-desc">Nom Z-A</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="stock-desc">Stock décroissant</option>
                    <option value="stock-asc">Stock croissant</option>
                  </select>

                  {/* Vue */}
                  <div className="flex gap-2 bg-offwhite border border-gray-200 rounded-lg p-1">
                    <button
                      onClick={() => setPremiumViewMode('grid')}
                      className={`flex-1 px-3 py-1.5 rounded text-xs transition-colors ${
                        premiumViewMode === 'grid' ? 'bg-[#ff6c00] text-white' : 'text-gray-text hover:text-blacksoft'
                      }`}
                    >
                      <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setPremiumViewMode('list')}
                      className={`flex-1 px-3 py-1.5 rounded text-xs transition-colors ${
                        premiumViewMode === 'list' ? 'bg-[#ff6c00] text-white' : 'text-gray-text hover:text-blacksoft'
                      }`}
                    >
                      <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Export */}
                  <button
                    onClick={() => {
                      const premiumProducts = state.products.filter(p => p.is_premium);
                      const csv = [
                        ['Nom', 'Catégorie', 'Prix', 'Stock', 'Statut'].join(','),
                        ...premiumProducts.map(p => [
                          `"${p.name}"`,
                          p.category,
                          p.price,
                          p.stock,
                          p.is_active ? 'Actif' : 'Inactif'
                        ].join(','))
                      ].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `produits_premium_${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showSuccess('Export réussi');
                    }}
                    className="text-xs text-gray-text hover:text-[#ff6c00] flex items-center justify-center gap-1 transition-colors bg-offwhite border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Exporter CSV
                  </button>
                </div>
              </div>
            </div>

            {(() => {
              // Filtrage et tri des produits premium
              let filteredPremium = state.products.filter(p => p.is_premium);
              
              // Filtre par recherche
              if (premiumSearchQuery) {
                const query = premiumSearchQuery.toLowerCase();
                filteredPremium = filteredPremium.filter(p => 
                  p.name.toLowerCase().includes(query) ||
                  p.category.toLowerCase().includes(query)
                );
              }
              
              // Filtre par catégorie
              if (premiumCategoryFilter !== 'all') {
                filteredPremium = filteredPremium.filter(p => p.category === premiumCategoryFilter);
              }

              // Tri
              filteredPremium = [...filteredPremium].sort((a, b) => {
                let comparison = 0;
                switch (premiumSortBy) {
                  case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                  case 'price':
                    comparison = (a.price || 0) - (b.price || 0);
                    break;
                  case 'stock':
                    comparison = (a.stock || 0) - (b.stock || 0);
                    break;
                  case 'date':
                    comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
                    break;
                }
                return premiumSortOrder === 'asc' ? comparison : -comparison;
              });

              const totalFiltered = filteredPremium.length;

              return (
                <>
                  {/* Compteur */}
                  <div className="flex items-center justify-between text-sm text-gray-text mb-2">
                    <span>
                      {totalFiltered} produit{totalFiltered > 1 ? 's' : ''} premium trouvé{totalFiltered > 1 ? 's' : ''}
                      {(premiumSearchQuery || premiumCategoryFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setPremiumSearchQuery('');
                            setPremiumCategoryFilter('all');
                          }}
                          className="ml-2 text-[#ff6c00] hover:underline font-medium"
                        >
                          Réinitialiser
                        </button>
                      )}
                    </span>
                  </div>

                  {totalFiltered === 0 ? (
                    <div className="card-modern p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-text mb-4">
                        {premiumSearchQuery || premiumCategoryFilter !== 'all'
                          ? 'Aucun produit premium ne correspond à vos critères'
                          : 'Aucun produit premium pour le moment'}
                      </p>
                      {(premiumSearchQuery || premiumCategoryFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setPremiumSearchQuery('');
                            setPremiumCategoryFilter('all');
                          }}
                          className="btn-primary text-xs px-4 py-2"
                        >
                          Réinitialiser les filtres
                        </button>
                      )}
                      {!premiumSearchQuery && premiumCategoryFilter === 'all' && (
                        <button
                          onClick={() => {
                            setShowAddProductModal(true);
                            setEditingProduct({ is_premium: true } as any);
                          }}
                          className="btn-primary mt-4 text-sm"
                        >
                          Ajouter un produit premium
                        </button>
                      )}
                    </div>
                  ) : premiumViewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                      {filteredPremium.map((product) => (
                <div
                  key={product.id}
                  className="card-modern overflow-hidden border-2 border-[#ff6c00]/20"
                >
                  <div className="aspect-square bg-offwhite relative">
                    <img
                      src={formatImageSrc(product.image_url, product.image_data)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-gradient-karma text-white px-2 py-1 rounded-full text-[10px] font-bold">
                      PREMIUM
                    </div>
                    {product.is_new && (
                      <div className="absolute top-2 right-2 bg-male-red text-white px-2 py-1 rounded-full text-xs font-bold">
                        NOUVEAU
                      </div>
                    )}
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="text-blacksoft font-semibold text-sm md:text-lg mb-1">{product.name}</h3>
                    <p className="text-gray-text text-xs md:text-sm mb-2 md:mb-3">{product.category}</p>
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      <span className="text-[#ff6c00] font-bold text-sm md:text-lg">{formatCurrency(product.price)}</span>
                      {product.original_price && (
                        <span className="text-gray-medium line-through text-xs md:text-sm">
                          {formatCurrency(product.original_price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <span className="text-gray-text text-xs md:text-sm">Stock: {product.stock}</span>
                      <span className={`text-[10px] md:text-xs px-2 py-1 rounded-full ${
                        product.is_active ? 'bg-[#ffba00]/10 text-[#ffba00]' : 'bg-[#e53637]/10 text-[#e53637]'
                      }`}>
                        {product.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 btn-secondary text-[10px] md:text-xs py-1.5 md:py-2"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.product_id)}
                        className="flex-1 btn-primary text-[10px] md:text-xs py-1.5 md:py-2"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredPremium.map((product) => (
                        <div key={product.id} className="card-modern p-4 hover:shadow-lg transition-all duration-300 group">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-offwhite rounded-lg overflow-hidden flex-shrink-0 relative">
                              <img
                                src={formatImageSrc(product.image_url, product.image_data)}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={handleImageError}
                                loading="lazy"
                              />
                              <div className="absolute top-1 left-1 bg-gradient-karma text-white px-1.5 py-0.5 rounded text-[8px] font-bold">
                                PREMIUM
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-blacksoft font-semibold text-sm md:text-base mb-1 line-clamp-1">
                                    {product.name}
                                    {product.is_new && (
                                      <span className="ml-2 bg-male-red text-white px-2 py-0.5 rounded text-[10px] font-bold">
                                        NOUVEAU
                                      </span>
                                    )}
                                  </h3>
                                  <p className="text-gray-text text-xs md:text-sm">{product.category}</p>
                                </div>
                                <span className={`text-[10px] md:text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                                  product.is_active ? 'bg-[#ffba00]/10 text-[#ffba00]' : 'bg-[#e53637]/10 text-[#e53637]'
                                }`}>
                                  {product.is_active ? 'Actif' : 'Inactif'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div>
                                    <span className="text-[#ff6c00] font-bold text-sm md:text-base">{formatCurrency(product.price)}</span>
                                    {product.original_price && (
                                      <span className="text-gray-medium line-through text-xs ml-2">
                                        {formatCurrency(product.original_price)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs font-medium ${
                                      product.stock === 0 ? 'text-gray-600' :
                                      product.stock < 10 ? 'text-[#e53637]' :
                                      'text-[#10b981]'
                                    }`}>
                                      Stock: {product.stock}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditProduct(product)}
                                    className="btn-secondary text-[10px] md:text-xs px-3 py-1.5"
                                  >
                                    Modifier
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product.product_id)}
                                    className="btn-primary text-[10px] md:text-xs px-3 py-1.5"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                }
                </>
              );
            })()}
          </div>
        )}

        {/* Premium Requests Tab */}
        {(activeTab === 'premium' || location.pathname === '/admin/premium') && (
          <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
              <div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-male-red mb-1 md:mb-2 block">
                  Gestion
                </span>
                <h1 className="text-lg md:text-2xl lg:text-3xl font-display font-bold">
                  DEMANDES <span className="gradient-text">PREMIUM</span>
                </h1>
              </div>
              <button
                onClick={loadPremiumRequests}
                className="bg-[#ff6c00] hover:bg-[#e55a00] text-white text-[11px] md:text-xs font-semibold px-4 md:px-6 py-2 md:py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser
              </button>
            </div>

            {/* Statistiques */}
            {(() => {
              const requests = state.premiumRequests;
              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <div className="card-modern p-3 md:p-4">
                    <p className="text-[10px] md:text-xs text-gray-text mb-1">Total</p>
                    <p className="text-lg md:text-2xl font-bold text-blacksoft">{requests.length}</p>
                  </div>
                  <div className="card-modern p-3 md:p-4 border-l-4 border-l-[#ffba00]">
                    <p className="text-[10px] md:text-xs text-gray-text mb-1">En attente</p>
                    <p className="text-lg md:text-2xl font-bold text-blacksoft">{requests.filter((r: any) => (r.status || 'pending') === 'pending').length}</p>
                  </div>
                  <div className="card-modern p-3 md:p-4 border-l-4 border-l-[#10b981]">
                    <p className="text-[10px] md:text-xs text-gray-text mb-1">Approuvées</p>
                    <p className="text-lg md:text-2xl font-bold text-blacksoft">{requests.filter((r: any) => (r.status || 'pending') === 'approved').length}</p>
                  </div>
                  <div className="card-modern p-3 md:p-4 border-l-4 border-l-[#e53637]">
                    <p className="text-[10px] md:text-xs text-gray-text mb-1">Rejetées</p>
                    <p className="text-lg md:text-2xl font-bold text-blacksoft">{requests.filter((r: any) => (r.status || 'pending') === 'rejected').length}</p>
                  </div>
                </div>
              );
            })()}

            {/* Barre de recherche et filtres */}
            <div className="card-modern p-4 md:p-6">
              <div className="space-y-4">
                {/* Recherche */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une demande (nom, téléphone, code...)"
                    value={premiumRequestSearchQuery}
                    onChange={(e) => setPremiumRequestSearchQuery(e.target.value)}
                    className="w-full bg-offwhite border border-gray-200 rounded-lg px-4 py-2.5 pl-10 text-sm text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {premiumRequestSearchQuery && (
                    <button
                      onClick={() => setPremiumRequestSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-text hover:text-blacksoft"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Filtres et tri */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Filtre statut */}
                  <select
                    value={premiumRequestStatusFilter}
                    onChange={(e) => setPremiumRequestStatusFilter(e.target.value)}
                    className="bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-sm text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvées</option>
                    <option value="rejected">Rejetées</option>
                  </select>

                  {/* Tri */}
                  <select
                    value={`${premiumRequestSortBy}-${premiumRequestSortOrder}`}
                    onChange={(e) => {
                      const [by, order] = e.target.value.split('-');
                      setPremiumRequestSortBy(by as 'date' | 'name');
                      setPremiumRequestSortOrder(order as 'asc' | 'desc');
                    }}
                    className="bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-sm text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                  >
                    <option value="date-desc">Plus récent</option>
                    <option value="date-asc">Plus ancien</option>
                    <option value="name-asc">Nom A-Z</option>
                    <option value="name-desc">Nom Z-A</option>
                  </select>

                  {/* Export */}
                  <button
                    onClick={() => {
                      const csv = [
                        ['Nom', 'Téléphone', 'Code', 'Statut', 'Date'].join(','),
                        ...state.premiumRequests.map((r: any) => [
                          `"${r.name || 'N/A'}"`,
                          r.phone || 'N/A',
                          r.code || 'N/A',
                          r.status === 'approved' ? 'Approuvée' : r.status === 'rejected' ? 'Rejetée' : 'En attente',
                          r.created_at || r.date ? new Date(r.created_at || r.date).toLocaleDateString('fr-FR') : 'N/A'
                        ].join(','))
                      ].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `demandes_premium_${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showSuccess('Export réussi');
                    }}
                    className="text-xs text-gray-text hover:text-[#ff6c00] flex items-center justify-center gap-1 transition-colors bg-offwhite border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Exporter CSV
                  </button>
                </div>
              </div>
            </div>

            {(() => {
              // Filtrage et tri des demandes premium
              let filteredRequests = [...state.premiumRequests];
              
              // Filtre par recherche
              if (premiumRequestSearchQuery) {
                const query = premiumRequestSearchQuery.toLowerCase();
                filteredRequests = filteredRequests.filter((r: any) => {
                  const name = (r.name || '').toLowerCase();
                  const phone = (r.phone || '').toLowerCase();
                  const code = (r.code || '').toLowerCase();
                  return name.includes(query) || phone.includes(query) || code.includes(query);
                });
              }
              
              // Filtre par statut
              if (premiumRequestStatusFilter !== 'all') {
                filteredRequests = filteredRequests.filter((r: any) => (r.status || 'pending') === premiumRequestStatusFilter);
              }

              // Tri
              filteredRequests = filteredRequests.sort((a: any, b: any) => {
                let comparison = 0;
                switch (premiumRequestSortBy) {
                  case 'name':
                    comparison = (a.name || '').localeCompare(b.name || '');
                    break;
                  case 'date':
                    const dateA = new Date(a.created_at || a.date || 0).getTime();
                    const dateB = new Date(b.created_at || b.date || 0).getTime();
                    comparison = dateA - dateB;
                    break;
                }
                return premiumRequestSortOrder === 'asc' ? comparison : -comparison;
              });

              const totalFiltered = filteredRequests.length;

              return (
                <>
                  {/* Compteur */}
                  <div className="flex items-center justify-between text-sm text-gray-text mb-2">
                    <span>
                      {totalFiltered} demande{totalFiltered > 1 ? 's' : ''} trouvée{totalFiltered > 1 ? 's' : ''}
                      {(premiumRequestSearchQuery || premiumRequestStatusFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setPremiumRequestSearchQuery('');
                            setPremiumRequestStatusFilter('all');
                          }}
                          className="ml-2 text-[#ff6c00] hover:underline font-medium"
                        >
                          Réinitialiser
                        </button>
                      )}
                    </span>
                  </div>

                  {totalFiltered === 0 ? (
                    <div className="card-modern p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-text mb-4">
                        {premiumRequestSearchQuery || premiumRequestStatusFilter !== 'all'
                          ? 'Aucune demande ne correspond à vos critères'
                          : 'Aucune demande premium pour le moment'}
                      </p>
                      {(premiumRequestSearchQuery || premiumRequestStatusFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setPremiumRequestSearchQuery('');
                            setPremiumRequestStatusFilter('all');
                          }}
                          className="btn-primary text-xs px-4 py-2"
                        >
                          Réinitialiser les filtres
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      {filteredRequests.map((request) => {
                  const requestData = request as any;
                  const images = requestData.images || [];
                  const status = requestData.status || 'pending';
                  
                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card-modern p-3 md:p-4 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => setSelectedPremiumRequest(requestData)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm md:text-base font-semibold text-blacksoft truncate">
                            {requestData.name || 'N/A'}
                          </h3>
                          <p className="text-xs text-gray-text mt-0.5">{requestData.phone || 'N/A'}</p>
                        </div>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          status === 'approved' ? 'bg-green-100 text-green-800' :
                          status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {status === 'approved' ? '✓' : status === 'rejected' ? '✗' : '⏳'}
                        </span>
                      </div>
                      
                      {images.length > 0 && (
                        <div className="mt-3 flex gap-1.5">
                          {images.slice(0, 3).map((img: string, idx: number) => (
                            <div key={idx} className="w-12 h-12 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                              <img
                                src={formatImageSrc(img)}
                                alt={`Preuve ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.src = '/back.jpg'; }}
                              />
                            </div>
                          ))}
                          {images.length > 3 && (
                            <div className="w-12 h-12 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] text-gray-text font-medium">
                              +{images.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-text">
                          {new Date(requestData.created_at || requestData.date || Date.now()).toLocaleDateString('fr-FR')}
                        </span>
                        {requestData.code && (
                          <span className="text-[10px] font-mono text-[#ff6c00] bg-[#ff6c00]/10 px-2 py-0.5 rounded">
                            {requestData.code}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                    </div>
                  )
                }
                </>
              );
            })()}
          </div>
        )}
        </div>
      </main>

      {/* Add Product Modal */}
      <ProductForm
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onSubmit={handleAddProduct}
        categories={state.categories}
        mode="create"
      />

      {/* Premium Request Modal */}
      <PremiumRequestModal
        request={selectedPremiumRequest}
        isOpen={!!selectedPremiumRequest}
        onClose={() => setSelectedPremiumRequest(null)}
        onApprove={async (requestId: string) => {
          setIsProcessingPremium(true);
          try {
            await approvePremiumRequest(requestId);
            await loadPremiumRequests();
            showSuccess('Demande approuvée et code généré avec succès');
            setSelectedPremiumRequest(null);
          } catch (error) {
            console.error('Erreur lors de l\'approbation:', error);
            showError('Erreur lors de l\'approbation');
          } finally {
            setIsProcessingPremium(false);
          }
        }}
        onReject={async (requestId: string) => {
          setIsProcessingPremium(true);
          try {
            await rejectPremiumRequest(requestId);
            await loadPremiumRequests();
            showSuccess('Demande rejetée');
            setSelectedPremiumRequest(null);
          } catch (error) {
            console.error('Erreur lors du rejet:', error);
            showError('Erreur lors du rejet');
          } finally {
            setIsProcessingPremium(false);
          }
        }}
        isProcessing={isProcessingPremium}
      />

      {/* Edit Product Modal */}
      {showEditProductModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="card-modern p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-base md:text-xl font-display font-bold text-blacksoft mb-3 md:mb-4">Modifier le Produit</h3>
            
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-blacksoft mb-1 md:mb-2">Nom du produit</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-sm md:text-base text-blacksoft focus:outline-none focus:border-karma-orange"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-blacksoft mb-1 md:mb-2">Catégorie</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-sm md:text-base text-blacksoft focus:outline-none focus:border-karma-orange"
                >
                  <option value="T-shirts">T-Shirts</option>
                  <option value="Vestes">Vestes</option>
                  <option value="Pantalons">Pantalons</option>
                  <option value="Chaussures">Chaussures</option>
                  <option value="Accessoires">Accessoires</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-blacksoft mb-1 md:mb-2">Prix (XOF)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-sm md:text-base text-blacksoft focus:outline-none focus:border-karma-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-blacksoft mb-1 md:mb-2">Prix original (XOF)</label>
                  <input
                    type="number"
                    value={editingProduct.original_price || editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, original_price: Number(e.target.value) })}
                    className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-sm md:text-base text-blacksoft focus:outline-none focus:border-karma-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-blacksoft mb-1 md:mb-2">Stock</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-sm md:text-base text-blacksoft focus:outline-none focus:border-karma-orange"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-blacksoft mb-1 md:mb-2">Image</label>
                <div 
                  className="border-2 border-dashed border-gray-200 rounded-lg p-3 md:p-4 text-center cursor-pointer hover:border-karma-orange transition-colors"
                  onClick={() => document.getElementById('edit-image-upload')?.click()}
                >
                  {editImagePreview ? (
                    <div className="relative">
                      <img src={editImagePreview} alt="Preview" className="w-full h-24 md:h-32 object-cover rounded" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEditImage();
                        }}
                        className="absolute top-2 right-2 bg-male-red text-white p-1 rounded-full hover:bg-male-red/90"
                      >
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-medium mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-text text-xs md:text-sm">Cliquez pour sélectionner une image</p>
                    </div>
                  )}
                  <input
                    id="edit-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button
                  onClick={() => setShowEditProductModal(false)}
                  className="flex-1 btn-secondary text-[10px] md:text-xs py-2"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateProduct}
                  disabled={!editingProduct?.name || !editingProduct?.category || editingProduct?.price <= 0}
                  className={`flex-1 text-[10px] md:text-xs py-2 rounded-lg transition-colors ${
                    !editingProduct?.name || !editingProduct?.category || editingProduct?.price <= 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
             )}

       {/* Order Details Modal */}
       {showOrderDetailsModal && selectedOrder && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
           <div className="card-modern p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-display font-bold text-blacksoft">Détails de la Commande #{selectedOrder.order_id}</h3>
               <button
                 onClick={() => setShowOrderDetailsModal(false)}
                 className="text-gray-text hover:text-blacksoft"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Informations client */}
               <div className="bg-offwhite rounded-lg p-4">
                 <h4 className="text-blacksoft font-semibold mb-3">Informations Client</h4>
                 <div className="space-y-2 text-sm">
                   <p><span className="text-gray-text">Nom:</span> <span className="text-blacksoft">{getUserInfo(selectedOrder).firstName} {getUserInfo(selectedOrder).lastName}</span></p>
                   <p><span className="text-gray-text">Téléphone:</span> <span className="text-blacksoft">{getUserInfo(selectedOrder).phoneNumber}</span></p>
                   <p><span className="text-gray-text">Ville:</span> <span className="text-blacksoft">{selectedOrder.city || 'N/A'}</span></p>
                   <p><span className="text-gray-text">Date de commande:</span> <span className="text-blacksoft">{selectedOrder.createdAt || selectedOrder.created_at ? new Date(selectedOrder.createdAt || selectedOrder.created_at).toLocaleDateString('fr-FR') : 'N/A'}</span></p>
                 </div>
               </div>

               {/* Statut et suivi */}
               <div className="bg-offwhite rounded-lg p-4">
                 <h4 className="text-blacksoft font-semibold mb-3">Statut et Suivi</h4>
                 <div className="space-y-3">
                   <div>
                     <label className="block text-sm font-medium text-blacksoft mb-2">Statut actuel</label>
                    <select
                      value={selectedOrder.status || 'pending'}
                      onChange={(e) => {
                        const orderId = selectedOrder.order_id || selectedOrder.id;
                        if (orderId) {
                          handleUpdateOrderStatus(orderId, e.target.value);
                        } else {
                          showError('ID de commande introuvable');
                        }
                      }}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-blacksoft focus:outline-none focus:border-karma-orange"
                    >
                       <option value="pending">En attente</option>
                       <option value="paid">Payé</option>
                       <option value="shipped">Expédié</option>
                       <option value="delivered">Livré</option>
                       <option value="cancelled">Annulé</option>
                     </select>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-blacksoft mb-2">Informations de suivi</label>
                     <textarea
                       placeholder="Ajouter des informations de suivi (numéro de suivi, commentaires...)"
                       className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-blacksoft focus:outline-none focus:border-karma-orange h-20 resize-none"
                     />
                   </div>
                 </div>
               </div>
             </div>

             {/* Articles commandés */}
             <div className="mt-6">
               <h4 className="text-blacksoft font-semibold mb-3">Articles Commandés</h4>
               <div className="bg-offwhite rounded-lg p-4">
                 <div className="space-y-3">
                   {selectedOrder.items?.map((item: any, index: number) => (
                     <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                       <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                           <svg className="w-5 h-5 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                           </svg>
                         </div>
                         <div>
                           <h5 className="text-blacksoft font-medium">{item.name}</h5>
                           <div className="flex items-center space-x-2 text-sm text-gray-text">
                             <span>Qté: {item.quantity}</span>
                             {item.size && <span>• Taille: {item.size}</span>}
                             {item.color && <span>• Couleur: {item.color}</span>}
                           </div>
                         </div>
                       </div>
                       <span className="text-blacksoft font-semibold">
                         {formatCurrency((item.price || 0) * (item.quantity || 0))}
                       </span>
                     </div>
                   ))}
                 </div>
                 
                 <div className="mt-4 pt-4 border-t border-gray-200">
                   <div className="flex justify-between items-center">
                     <span className="text-blacksoft font-semibold text-lg">Total</span>
                     <span className="text-male-red font-bold text-xl">
                       {formatCurrency(selectedOrder.total || 0)}
                     </span>
                   </div>
                 </div>
               </div>
             </div>

             {/* Actions */}
             <div className="mt-6 flex justify-end space-x-3">
               <button
                 onClick={() => setShowOrderDetailsModal(false)}
                 className="btn-secondary px-6 py-2"
               >
                 Fermer
               </button>
              <button
                onClick={() => {
                  const orderId = selectedOrder.order_id || selectedOrder.id;
                  if (orderId) {
                    handleUpdateOrderStatus(orderId, selectedOrder.status || 'pending');
                  } else {
                    showError('ID de commande introuvable');
                  }
                }}
                className="btn-primary px-6 py-2"
              >
                Mettre à jour
              </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };
 
 export default AdminDashboard;
