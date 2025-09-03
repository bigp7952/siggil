import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext.tsx';
import AnimatedText from '../components/common/AnimatedText.tsx';
import AnimatedCard from '../components/common/AnimatedCard.tsx';

const AdminDashboard: React.FC = () => {
  const { state, adminLogout, loadOrders, loadPremiumRequests, loadProducts, updateStats, isAdminAuthenticated, approvePremiumRequest, rejectPremiumRequest, updateOrderStatus, addProduct, deleteProduct, updateProduct } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    image: '',
    sizes: [] as string[],
    colors: [] as string[],
    isNew: false,
    isActive: true,
    description: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editImagePreview, setEditImagePreview] = useState<string>('');

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
      return;
    }

    // Charger les données une seule fois au montage du composant
    const initializeData = async () => {
      try {
        setIsInitializing(true);
        await Promise.all([
          loadOrders(),
          loadPremiumRequests(),
          loadProducts(),
          updateStats()
        ]);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des données:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeData();
  }, [isAdminAuthenticated, navigate]); // Supprimer les dépendances qui causent des re-renders

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const handleAddProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.category || newProduct.price <= 0) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      await addProduct({
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        original_price: newProduct.originalPrice,
        stock: newProduct.stock,
        image_url: newProduct.image,
        image_data: newProduct.image,
        sizes: newProduct.sizes,
        colors: newProduct.colors,
        is_new: newProduct.isNew,
        is_active: newProduct.isActive,
        description: '',
      });
      
      setNewProduct({
        name: '',
        category: '',
        price: 0,
        originalPrice: 0,
        stock: 0,
        image: '',
        sizes: [],
        colors: [],
        isNew: false,
        isActive: true,
      });
      setImagePreview('');
      setShowAddProductModal(false);
      
      // Recharger les produits pour afficher le nouveau
      loadProducts();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      alert('Erreur lors de l\'ajout du produit');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setNewProduct({ ...newProduct, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setNewProduct({ ...newProduct, image: '' });
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(productId);
        // Recharger les produits pour mettre à jour la liste
        loadProducts();
      } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        alert('Erreur lors de la suppression du produit');
      }
    }
  };

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string, trackingInfo?: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      if (trackingInfo) {
        // Ici on pourrait ajouter une fonction pour mettre à jour le suivi
        console.log('Suivi mis à jour:', trackingInfo);
      }
      // Recharger les commandes
      loadOrders();
      setShowOrderDetailsModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour');
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
          alert('Veuillez remplir tous les champs obligatoires');
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
        alert('Erreur lors de la modification du produit');
      }
    }
  };

  const handleEditImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditImagePreview(result);
      };
      reader.readAsDataURL(file);
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
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      case 'paid': return 'text-green-500 bg-green-500/10';
      case 'shipped': return 'text-blue-500 bg-blue-500/10';
      case 'delivered': return 'text-green-600 bg-green-500/10';
      case 'cancelled': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
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

  if (!isAdminAuthenticated) {
    return null;
  }

  // Afficher un indicateur de chargement pendant l'initialisation
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Chargement du Dashboard</h2>
          <p className="text-gray-400">Initialisation des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-red-500">SIGGIL</h1>
              <span className="text-gray-400">Dashboard Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble' },
              { id: 'orders', label: 'Commandes' },
              { id: 'products', label: 'Produits' },
              { id: 'premium', label: 'Demandes Premium' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedText text="Vue d'ensemble" className="text-3xl font-bold mb-8" />
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <AnimatedCard delay={0.1}>
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Commandes Totales</p>
                      <p className="text-2xl font-bold text-white">{state.stats.totalOrders}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard delay={0.2}>
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Revenus Totaux</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(state.stats.totalRevenue)}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard delay={0.3}>
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Clients</p>
                      <p className="text-2xl font-bold text-white">{state.stats.totalCustomers}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard delay={0.4}>
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Produits</p>
                      <p className="text-2xl font-bold text-white">{state.stats.totalProducts}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            {/* Recent Orders */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-4">Commandes Récentes</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Client</th>
                      <th className="text-left py-3 px-4">Montant</th>
                      <th className="text-left py-3 px-4">Statut</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                                         {state.orders.slice(0, 5).map((order) => {
                       const userInfo = getUserInfo(order);
                       return (
                         <tr key={order.id || order.order_id} className="border-b border-gray-800">
                           <td className="py-3 px-4 text-sm">{order.order_id || 'N/A'}</td>
                           <td className="py-3 px-4 text-sm">{userInfo.firstName} {userInfo.lastName}</td>
                           <td className="py-3 px-4 text-sm">{formatCurrency(order.total || 0)}</td>
                           <td className="py-3 px-4">
                             <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status || 'pending')}`}>
                               {getStatusText(order.status || 'pending')}
                             </span>
                           </td>
                           <td className="py-3 px-4 text-sm">
                             {order.createdAt || order.created_at ? new Date(order.createdAt || order.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                           </td>
                         </tr>
                       );
                     })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-8">
              <AnimatedText text="Gestion des Commandes" className="text-3xl font-bold" />
              <button
                onClick={async () => {
                  try {
                    await loadOrders();
                    await updateStats();
                  } catch (error) {
                    console.error('Erreur lors de l\'actualisation:', error);
                    alert('Erreur lors de l\'actualisation');
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Actualiser
              </button>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Client</th>
                      <th className="text-left py-3 px-4">Téléphone</th>
                      <th className="text-left py-3 px-4">Montant</th>
                      <th className="text-left py-3 px-4">Statut</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                                         {state.orders.map((order) => {
                       const userInfo = getUserInfo(order);
                       return (
                         <tr key={order.id || order.order_id} className="border-b border-gray-800">
                           <td className="py-3 px-4 text-sm">{order.order_id || 'N/A'}</td>
                           <td className="py-3 px-4 text-sm">{userInfo.firstName} {userInfo.lastName}</td>
                           <td className="py-3 px-4 text-sm">{userInfo.phoneNumber}</td>
                           <td className="py-3 px-4 text-sm">{formatCurrency(order.total || 0)}</td>
                           <td className="py-3 px-4">
                             <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status || 'pending')}`}>
                               {getStatusText(order.status || 'pending')}
                             </span>
                           </td>
                           <td className="py-3 px-4 text-sm">
                             {order.createdAt || order.created_at ? new Date(order.createdAt || order.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                           </td>
                           <td className="py-3 px-4">
                             <div className="flex flex-col space-y-2">
                               <select
                                 value={order.status || 'pending'}
                                 onChange={async (e) => {
                                   try {
                                     await updateOrderStatus(order.order_id, e.target.value);
                                     // Recharger les commandes pour mettre à jour l'affichage
                                     loadOrders();
                                   } catch (error) {
                                     console.error('Erreur lors de la mise à jour du statut:', error);
                                     alert('Erreur lors de la mise à jour du statut');
                                   }
                                 }}
                                 className="bg-gray-800 text-white text-sm px-2 py-1 rounded border border-gray-700"
                               >
                                 <option value="pending">En attente</option>
                                 <option value="paid">Payé</option>
                                 <option value="shipped">Expédié</option>
                                 <option value="delivered">Livré</option>
                                 <option value="cancelled">Annulé</option>
                               </select>
                               
                               <button
                                 onClick={() => handleViewOrderDetails(order)}
                                 className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors"
                               >
                                 Détails
                               </button>
                             </div>
                           </td>
                         </tr>
                       );
                     })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-8">
              <AnimatedText text="Gestion des Produits" className="text-3xl font-bold" />
              <button
                onClick={() => setShowAddProductModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Ajouter un Produit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.products.map((product) => (
                <AnimatedCard key={product.id} delay={0.1}>
                  <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                    <div className="aspect-square bg-gray-800 relative">
                      <img
                        src={product.image_url || product.image_data || '/back.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.is_new && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          NOUVEAU
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{product.category}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-red-500 font-bold text-lg">{formatCurrency(product.price)}</span>
                        {product.original_price && (
                          <span className="text-gray-500 line-through text-sm">
                            {formatCurrency(product.original_price)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm">Stock: {product.stock}</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          product.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {product.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors text-sm"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.product_id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* Premium Requests Tab */}
        {activeTab === 'premium' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedText text="Demandes Premium" className="text-3xl font-bold mb-8" />
            
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Nom</th>
                      <th className="text-left py-3 px-4">Téléphone</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                                         {state.premiumRequests.map((request) => (
                       <tr key={request.id} className="border-b border-gray-800">
                         <td className="py-3 px-4 text-sm">{request.id || 'N/A'}</td>
                         <td className="py-3 px-4 text-sm">{request.name || 'N/A'}</td>
                         <td className="py-3 px-4 text-sm">{request.phone || 'N/A'}</td>
                         <td className="py-3 px-4 text-sm">
                           {request.date ? new Date(request.date).toLocaleDateString('fr-FR') : 'N/A'}
                         </td>
                         <td className="py-3 px-4">
                           <div className="flex gap-2">
                             <button
                               onClick={async () => {
                                 try {
                                   await approvePremiumRequest(request.id);
                                   // Recharger les demandes premium
                                   loadPremiumRequests();
                                 } catch (error) {
                                   console.error('Erreur lors de l\'approbation:', error);
                                   alert('Erreur lors de l\'approbation');
                                 }
                               }}
                               className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                             >
                               Approuver
                             </button>
                             <button
                               onClick={async () => {
                                 try {
                                   await rejectPremiumRequest(request.id);
                                   // Recharger les demandes premium
                                   loadPremiumRequests();
                                 } catch (error) {
                                   console.error('Erreur lors du rejet:', error);
                                   alert('Erreur lors du rejet');
                                 }
                               }}
                               className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                             >
                               Rejeter
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Ajouter un Produit</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nom du produit</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Catégorie</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="T-shirts">T-Shirts</option>
                  <option value="Vestes">Vestes</option>
                  <option value="Pantalons">Pantalons</option>
                  <option value="Chaussures">Chaussures</option>
                  <option value="Accessoires">Accessoires</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Prix (XOF)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Prix original (XOF)</label>
                  <input
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Stock</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Image</label>
                                 <div 
                   className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:border-red-500 transition-colors"
                   onClick={() => document.getElementById('image-upload')?.click()}
                 >
                   {imagePreview ? (
                     <div className="relative">
                       <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded" />
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           removeImage();
                         }}
                         className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                       </button>
                     </div>
                   ) : (
                     <div>
                       <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                       </svg>
                       <p className="text-gray-400 text-sm">Cliquez pour sélectionner une image</p>
                     </div>
                   )}
                   <input
                     id="image-upload"
                     type="file"
                     accept="image/*"
                     onChange={handleImageUpload}
                     className="hidden"
                   />
                 </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddProduct}
                  disabled={!newProduct.name || !newProduct.category || newProduct.price <= 0}
                  className={`flex-1 py-2 rounded-lg transition-colors ${
                    !newProduct.name || !newProduct.category || newProduct.price <= 0
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Modifier le Produit</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nom du produit</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Catégorie</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="T-shirts">T-Shirts</option>
                  <option value="Vestes">Vestes</option>
                  <option value="Pantalons">Pantalons</option>
                  <option value="Chaussures">Chaussures</option>
                  <option value="Accessoires">Accessoires</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Prix (XOF)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Prix original (XOF)</label>
                  <input
                    type="number"
                    value={editingProduct.original_price || editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, original_price: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Stock</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Image</label>
                                 <div 
                   className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:border-red-500 transition-colors"
                   onClick={() => document.getElementById('edit-image-upload')?.click()}
                 >
                   {editImagePreview ? (
                     <div className="relative">
                       <img src={editImagePreview} alt="Preview" className="w-full h-32 object-cover rounded" />
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           removeEditImage();
                         }}
                         className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                       </button>
                     </div>
                   ) : (
                     <div>
                       <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                       </svg>
                       <p className="text-gray-400 text-sm">Cliquez pour sélectionner une image</p>
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

              <div className="flex gap-4">
                <button
                  onClick={() => setShowEditProductModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateProduct}
                  disabled={!editingProduct?.name || !editingProduct?.category || editingProduct?.price <= 0}
                  className={`flex-1 py-2 rounded-lg transition-colors ${
                    !editingProduct?.name || !editingProduct?.category || editingProduct?.price <= 0
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
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
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-semibold text-white">Détails de la Commande #{selectedOrder.order_id}</h3>
               <button
                 onClick={() => setShowOrderDetailsModal(false)}
                 className="text-gray-400 hover:text-white"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Informations client */}
               <div className="bg-gray-800 rounded-lg p-4">
                 <h4 className="text-white font-semibold mb-3">Informations Client</h4>
                 <div className="space-y-2 text-sm">
                   <p><span className="text-gray-400">Nom:</span> {getUserInfo(selectedOrder).firstName} {getUserInfo(selectedOrder).lastName}</p>
                   <p><span className="text-gray-400">Téléphone:</span> {getUserInfo(selectedOrder).phoneNumber}</p>
                   <p><span className="text-gray-400">Ville:</span> {selectedOrder.city || 'N/A'}</p>
                   <p><span className="text-gray-400">Date de commande:</span> {selectedOrder.createdAt || selectedOrder.created_at ? new Date(selectedOrder.createdAt || selectedOrder.created_at).toLocaleDateString('fr-FR') : 'N/A'}</p>
                 </div>
               </div>

               {/* Statut et suivi */}
               <div className="bg-gray-800 rounded-lg p-4">
                 <h4 className="text-white font-semibold mb-3">Statut et Suivi</h4>
                 <div className="space-y-3">
                   <div>
                     <label className="block text-sm font-medium text-gray-400 mb-2">Statut actuel</label>
                     <select
                       value={selectedOrder.status || 'pending'}
                       onChange={(e) => handleUpdateOrderStatus(selectedOrder.order_id, e.target.value)}
                       className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                     >
                       <option value="pending">En attente</option>
                       <option value="paid">Payé</option>
                       <option value="shipped">Expédié</option>
                       <option value="delivered">Livré</option>
                       <option value="cancelled">Annulé</option>
                     </select>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-400 mb-2">Informations de suivi</label>
                     <textarea
                       placeholder="Ajouter des informations de suivi (numéro de suivi, commentaires...)"
                       className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 h-20 resize-none"
                     />
                   </div>
                 </div>
               </div>
             </div>

             {/* Articles commandés */}
             <div className="mt-6">
               <h4 className="text-white font-semibold mb-3">Articles Commandés</h4>
               <div className="bg-gray-800 rounded-lg p-4">
                 <div className="space-y-3">
                   {selectedOrder.items?.map((item: any, index: number) => (
                     <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                       <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                           <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                           </svg>
                         </div>
                         <div>
                           <h5 className="text-white font-medium">{item.name}</h5>
                           <div className="flex items-center space-x-2 text-sm text-gray-400">
                             <span>Qté: {item.quantity}</span>
                             {item.size && <span>• Taille: {item.size}</span>}
                             {item.color && <span>• Couleur: {item.color}</span>}
                           </div>
                         </div>
                       </div>
                       <span className="text-white font-semibold">
                         {formatCurrency((item.price || 0) * (item.quantity || 0))}
                       </span>
                     </div>
                   ))}
                 </div>
                 
                 <div className="mt-4 pt-4 border-t border-gray-600">
                   <div className="flex justify-between items-center">
                     <span className="text-white font-semibold text-lg">Total</span>
                     <span className="text-red-500 font-bold text-xl">
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
                 className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
               >
                 Fermer
               </button>
               <button
                 onClick={() => handleUpdateOrderStatus(selectedOrder.order_id, selectedOrder.status)}
                 className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
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
