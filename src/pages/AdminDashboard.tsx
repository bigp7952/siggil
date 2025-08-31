import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext.tsx';
import { useProducts } from '../contexts/ProductContext.tsx';
import AnimatedText from '../components/common/AnimatedText.tsx';
import AnimatedCard from '../components/common/AnimatedCard.tsx';

const AdminDashboard: React.FC = () => {
  const { state, adminLogout, loadOrders, loadPremiumRequests, loadProducts, updateStats, isAdminAuthenticated, approvePremiumRequest, rejectPremiumRequest, updateOrderStatus } = useAdmin();
  const { state: productState, addProduct, deleteProduct, updateProduct } = useProducts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
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
  });
  // const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  // const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>('');

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
      return;
    }

    loadOrders();
    loadPremiumRequests();
    loadProducts();
    updateStats();
  }, [isAdminAuthenticated, navigate, loadOrders, loadPremiumRequests, loadProducts, updateStats]);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const handleAddProduct = () => {
    addProduct(newProduct);
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
    setImageFile(null);
    setImagePreview('');
    setShowAddProductModal(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB.');
        return;
      }

      setImageFile(file);
      
      // Créer une URL pour la prévisualisation
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
    setImageFile(null);
    setImagePreview('');
    setNewProduct({ ...newProduct, image: '' });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-red-500');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-red-500');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-red-500');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        if (file.size <= 5 * 1024 * 1024) {
          setImageFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setImagePreview(result);
            setNewProduct({ ...newProduct, image: result });
          };
          reader.readAsDataURL(file);
        } else {
          alert('L\'image ne doit pas dépasser 5MB.');
        }
      } else {
        alert('Veuillez sélectionner un fichier image valide.');
      }
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct(productId);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setEditImagePreview(product.image);
    setShowEditProductModal(true);
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      const updatedProduct = {
        ...editingProduct,
        image: editImagePreview || editingProduct.image
      };
      updateProduct(updatedProduct);
      setShowEditProductModal(false);
      setEditingProduct(null);
      setEditImageFile(null);
      setEditImagePreview('');
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

      setEditImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeEditImage = () => {
    setEditImageFile(null);
    setEditImagePreview('');
  };

  const handleEditDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-red-500');
  };

  const handleEditDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-red-500');
  };

  const handleEditDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-red-500');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        if (file.size <= 5 * 1024 * 1024) {
          setEditImageFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setEditImagePreview(result);
          };
          reader.readAsDataURL(file);
        } else {
          alert('L\'image ne doit pas dépasser 5MB.');
        }
      } else {
        alert('Veuillez sélectionner un fichier image valide.');
      }
    }
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
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/logo.png" alt="SIGGIL" className="w-8 h-8" />
              <AnimatedText type="word" className="text-xl font-bold text-white">
                SIGGIL <span className="text-red-500">ADMIN</span>
              </AnimatedText>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">
                Connecté en tant que <span className="text-white font-medium">{state.admin?.username}</span>
              </span>
              <motion.button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Déconnexion
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 min-h-screen border-r border-gray-800">
          <nav className="p-4 space-y-2">
            {[
              { 
                id: 'overview', 
                label: 'Vue d\'ensemble', 
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              { 
                id: 'orders', 
                label: 'Commandes', 
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )
              },
              { 
                id: 'premium', 
                label: 'Demandes Premium', 
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )
              },
              { 
                id: 'products', 
                label: 'Gestion Produits', 
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                )
              },
              { 
                id: 'customers', 
                label: 'Clients', 
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                )
              },
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-red-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <AnimatedText type="word" className="text-3xl font-bold text-white mb-6">
                Tableau de <span className="text-red-500">Bord</span>
              </AnimatedText>

              {/* Statistiques principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatedCard delay={0.1}>
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Commandes Totales</p>
                        <p className="text-2xl font-bold text-white">{state.stats.totalOrders}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard delay={0.2}>
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
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
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Clients</p>
                        <p className="text-2xl font-bold text-white">{state.stats.totalCustomers}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard delay={0.4}>
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Produits</p>
                        <p className="text-2xl font-bold text-white">{state.stats.totalProducts}</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </div>

              {/* Graphiques et détails */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Commandes récentes */}
                <AnimatedCard delay={0.5}>
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Commandes Récentes</h3>
                    <div className="space-y-3">
                      {state.orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                          <div>
                            <p className="text-white font-medium">
                              {order.userInfo.firstName} {order.userInfo.lastName}
                            </p>
                            <p className="text-gray-400 text-sm">{formatCurrency(order.total)}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedCard>

                {/* Clients par ville */}
                <AnimatedCard delay={0.6}>
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Clients par Ville</h3>
                    <div className="space-y-3">
                      {Object.entries(state.stats.customersByCity).map(([city, count]) => (
                        <div key={city} className="flex items-center justify-between">
                          <span className="text-gray-300">{city}</span>
                          <span className="text-white font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <AnimatedText type="word" className="text-3xl font-bold text-white mb-6">
                Gestion des <span className="text-red-500">Commandes</span>
              </AnimatedText>

              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {state.orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">
                                {order.userInfo.firstName} {order.userInfo.lastName}
                              </div>
                              <div className="text-sm text-gray-400">{order.userInfo.phoneNumber}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                            >
                              <option value="pending">En attente</option>
                              <option value="paid">Payé</option>
                              <option value="shipped">Expédié</option>
                              <option value="delivered">Livré</option>
                              <option value="cancelled">Annulé</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Section Premium */}
          {activeTab === 'premium' && (
            <div className="space-y-6">
              <AnimatedText type="word" className="text-3xl font-bold text-white mb-6">
                Gestion <span className="text-red-500">Premium</span>
              </AnimatedText>

              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Réseaux Sociaux
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {state.premiumRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">
                                {request.userInfo.firstName} {request.userInfo.lastName}
                              </div>
                              <div className="text-sm text-gray-400">{request.userInfo.phoneNumber}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                Instagram
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                TikTok
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === 'pending' ? 'text-yellow-500 bg-yellow-500/10' :
                              request.status === 'approved' ? 'text-green-500 bg-green-500/10' :
                              'text-red-500 bg-red-500/10'
                            }`}>
                              {request.status === 'pending' ? 'En attente' :
                               request.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {request.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => approvePremiumRequest(request.id)}
                                  className="text-green-500 hover:text-green-400 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => rejectPremiumRequest(request.id)}
                                  className="text-red-500 hover:text-red-400 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            )}
                            {request.status === 'approved' && request.code && (
                              <span className="text-green-500 font-mono text-xs">{request.code}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Section Products */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <AnimatedText type="word" className="text-3xl font-bold text-white">
                  Gestion des <span className="text-red-500">Produits</span>
                </AnimatedText>
                <motion.button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Ajouter un produit</span>
                </motion.button>
              </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productState.products.map((product) => (
                  <AnimatedCard key={product.id} delay={0.1}>
                    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                      <div className="aspect-square overflow-hidden relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.isNew && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            NOUVEAU
                          </div>
                        )}
                      </div>
                                             <div className="p-4">
                         <h3 className="text-white font-semibold mb-2">{product.name}</h3>
                         <p className="text-gray-400 text-sm mb-3">{product.category}</p>
                         <div className="flex justify-between items-center mb-3">
                           <span className="text-white font-bold">{formatCurrency(product.price)}</span>
                           <span className="text-gray-400 text-sm">Stock: {product.stock}</span>
                         </div>
                         
                         {/* Affichage des tailles et couleurs */}
                         <div className="mb-3">
                           {product.sizes.length > 0 && (
                             <div className="mb-2">
                               <span className="text-gray-400 text-xs">Tailles: </span>
                               <div className="flex flex-wrap gap-1 mt-1">
                                 {product.sizes.map((size) => (
                                   <span key={size} className="px-2 py-1 bg-gray-800 text-white text-xs rounded">
                                     {size}
                                   </span>
                                 ))}
                               </div>
                             </div>
                           )}
                           
                           {product.colors && product.colors.length > 0 && (
                             <div>
                               <span className="text-gray-400 text-xs">Couleurs: </span>
                               <div className="flex flex-wrap gap-1 mt-1">
                                 {product.colors.map((color) => (
                                   <span key={color} className="px-2 py-1 bg-gray-800 text-white text-xs rounded capitalize">
                                     {color}
                                   </span>
                                 ))}
                               </div>
                             </div>
                           )}
                         </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          )}

          {/* Section Customers */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <AnimatedText type="word" className="text-3xl font-bold text-white mb-6">
                Gestion des <span className="text-red-500">Clients</span>
              </AnimatedText>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Statistiques clients */}
                <AnimatedCard delay={0.1}>
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Répartition par Ville</h3>
                    <div className="space-y-3">
                      {Object.entries(state.stats.customersByCity).map(([city, count]) => (
                        <div key={city} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-gray-300">{city}</span>
                          </div>
                          <span className="text-white font-semibold">{count} clients</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedCard>

                {/* Commandes récentes par client */}
                <AnimatedCard delay={0.2}>
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Clients Récents</h3>
                    <div className="space-y-3">
                      {state.orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                          <div>
                            <p className="text-white font-medium">
                              {order.userInfo.firstName} {order.userInfo.lastName}
                            </p>
                            <p className="text-gray-400 text-sm">{order.userInfo.phoneNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white text-sm">{formatCurrency(order.total)}</p>
                            <p className="text-gray-400 text-xs">{order.city}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedCard>
              </div>

              {/* Tableau détaillé des clients */}
              <AnimatedCard delay={0.3}>
                <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Client
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Ville
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Commandes
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Total Dépensé
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {Object.values(state.orders.reduce((acc, order) => {
                          const key = order.userInfo.phoneNumber;
                          if (!acc[key]) {
                            acc[key] = {
                              user: order.userInfo,
                              orders: 0,
                              total: 0,
                              city: order.city
                            };
                          }
                          acc[key].orders += 1;
                          acc[key].total += order.total;
                          return acc;
                        }, {} as Record<string, any>)).map((customer) => (
                          <tr key={customer.user.phoneNumber} className="hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">
                                {customer.user.firstName} {customer.user.lastName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {customer.user.phoneNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {customer.city}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {customer.orders}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {formatCurrency(customer.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          )}
        </main>
      </div>

      {/* Modal d'ajout de produit */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-2xl mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Ajouter un nouveau produit</h2>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="Nom du produit"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Catégorie
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="T-shirts">T-shirts</option>
                    <option value="Pantalons">Pantalons</option>
                    <option value="Chaussures">Chaussures</option>
                    <option value="Accessoires">Accessoires</option>
                    <option value="Vestes">Vestes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Prix (XOF)
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Prix original (XOF) - Optionnel
                  </label>
                  <input
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Stock disponible
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="0"
                  />
                </div>

                                 <div>
                   <label className="block text-gray-300 text-sm font-medium mb-2">
                     Image du produit
                   </label>
                   <div className="space-y-3">
                     {/* Zone d'upload */}
                     <div 
                       className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-red-500 transition-colors"
                       onDragOver={handleDragOver}
                       onDragLeave={handleDragLeave}
                       onDrop={handleDrop}
                     >
                       <input
                         type="file"
                         accept="image/*"
                         onChange={handleImageUpload}
                         className="hidden"
                         id="image-upload"
                       />
                       <label
                         htmlFor="image-upload"
                         className="cursor-pointer flex flex-col items-center space-y-2"
                       >
                         <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                         </svg>
                         <div>
                           <span className="text-gray-300 font-medium">Cliquez pour uploader</span>
                           <p className="text-gray-500 text-sm">ou glissez-déposez une image</p>
                         </div>
                         <p className="text-gray-500 text-xs">PNG, JPG, JPEG jusqu'à 5MB</p>
                       </label>
                     </div>

                     {/* Prévisualisation de l'image */}
                     {imagePreview && (
                       <div className="relative">
                         <img
                           src={imagePreview}
                           alt="Aperçu"
                           className="w-full h-32 object-cover rounded-lg"
                         />
                         <button
                           type="button"
                           onClick={removeImage}
                           className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                         >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                         </button>
                       </div>
                     )}
                   </div>
                 </div>
              </div>

                             <div>
                 <label className="block text-gray-300 text-sm font-medium mb-2">
                   Tailles disponibles
                 </label>
                 <div className="flex flex-wrap gap-2">
                   {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                     <button
                       key={size}
                       type="button"
                       onClick={() => {
                         const updatedSizes = newProduct.sizes.includes(size)
                           ? newProduct.sizes.filter(s => s !== size)
                           : [...newProduct.sizes, size];
                         setNewProduct({ ...newProduct, sizes: updatedSizes });
                       }}
                       className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${
                         newProduct.sizes.includes(size)
                           ? 'bg-red-500 text-white border-red-500'
                           : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-red-500'
                       }`}
                     >
                       {size}
                     </button>
                   ))}
                 </div>
               </div>

               <div>
                 <label className="block text-gray-300 text-sm font-medium mb-2">
                   Couleurs disponibles
                 </label>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                   {[
                     { name: 'Noir', value: 'noir', bgColor: 'bg-black' },
                     { name: 'Blanc', value: 'blanc', bgColor: 'bg-white' },
                     { name: 'Rouge', value: 'rouge', bgColor: 'bg-red-500' },
                     { name: 'Bleu', value: 'bleu', bgColor: 'bg-blue-500' },
                     { name: 'Vert', value: 'vert', bgColor: 'bg-green-500' },
                     { name: 'Jaune', value: 'jaune', bgColor: 'bg-yellow-500' },
                     { name: 'Orange', value: 'orange', bgColor: 'bg-orange-500' },
                     { name: 'Rose', value: 'rose', bgColor: 'bg-pink-500' },
                     { name: 'Violet', value: 'violet', bgColor: 'bg-purple-500' },
                     { name: 'Gris', value: 'gris', bgColor: 'bg-gray-500' },
                     { name: 'Marron', value: 'marron', bgColor: 'bg-amber-700' },
                     { name: 'Beige', value: 'beige', bgColor: 'bg-amber-100' },
                   ].map((color) => (
                     <button
                       key={color.value}
                       type="button"
                       onClick={() => {
                         const updatedColors = newProduct.colors.includes(color.value)
                           ? newProduct.colors.filter(c => c !== color.value)
                           : [...newProduct.colors, color.value];
                         setNewProduct({ ...newProduct, colors: updatedColors });
                       }}
                       className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors ${
                         newProduct.colors.includes(color.value)
                           ? 'border-red-500 bg-gray-800'
                           : 'border-gray-700 bg-gray-800 hover:border-red-500'
                       }`}
                     >
                       <div className={`w-4 h-4 rounded-full ${color.bgColor} border border-gray-600`}></div>
                       <span className={`text-sm font-medium ${
                         newProduct.colors.includes(color.value) ? 'text-white' : 'text-gray-300'
                       }`}>
                         {color.name}
                       </span>
                     </button>
                   ))}
                 </div>
               </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newProduct.isNew}
                    onChange={(e) => setNewProduct({ ...newProduct, isNew: e.target.checked })}
                    className="w-4 h-4 text-red-500 bg-gray-800 border-gray-700 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <span className="ml-2 text-gray-300">Nouveau produit</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newProduct.isActive}
                    onChange={(e) => setNewProduct({ ...newProduct, isActive: e.target.checked })}
                    className="w-4 h-4 text-red-500 bg-gray-800 border-gray-700 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <span className="ml-2 text-gray-300">Produit actif</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowAddProductModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddProduct}
                disabled={!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.image}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajouter le produit
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de modification de produit */}
      {showEditProductModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Modifier le produit</h2>
              <button
                onClick={() => {
                  setShowEditProductModal(false);
                  setEditingProduct(null);
                  setEditImageFile(null);
                  setEditImagePreview('');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="Nom du produit"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Catégorie
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="T-shirts">T-shirts</option>
                    <option value="Pantalons">Pantalons</option>
                    <option value="Chaussures">Chaussures</option>
                    <option value="Accessoires">Accessoires</option>
                    <option value="Vestes">Vestes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Prix (XOF)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Prix original (XOF) - Optionnel
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Stock disponible
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Image du produit
                  </label>
                  <div className="space-y-3">
                    {/* Zone d'upload */}
                    <div 
                      className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-red-500 transition-colors"
                      onDragOver={handleEditDragOver}
                      onDragLeave={handleEditDragLeave}
                      onDrop={handleEditDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageUpload}
                        className="hidden"
                        id="edit-image-upload"
                      />
                      <label
                        htmlFor="edit-image-upload"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div>
                          <span className="text-gray-300 font-medium">Cliquez pour changer l'image</span>
                          <p className="text-gray-500 text-sm">ou glissez-déposez une nouvelle image</p>
                        </div>
                        <p className="text-gray-500 text-xs">PNG, JPG, JPEG jusqu'à 5MB</p>
                      </label>
                    </div>

                    {/* Prévisualisation de l'image */}
                    {editImagePreview && (
                      <div className="relative">
                        <img
                          src={editImagePreview}
                          alt="Aperçu"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeEditImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Tailles disponibles
                </label>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        const updatedSizes = editingProduct.sizes.includes(size)
                          ? editingProduct.sizes.filter((s: string) => s !== size)
                          : [...editingProduct.sizes, size];
                        setEditingProduct({ ...editingProduct, sizes: updatedSizes });
                      }}
                      className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${
                        editingProduct.sizes.includes(size)
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-red-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Couleurs disponibles
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { name: 'Noir', value: 'noir', bgColor: 'bg-black' },
                    { name: 'Blanc', value: 'blanc', bgColor: 'bg-white' },
                    { name: 'Rouge', value: 'rouge', bgColor: 'bg-red-500' },
                    { name: 'Bleu', value: 'bleu', bgColor: 'bg-blue-500' },
                    { name: 'Vert', value: 'vert', bgColor: 'bg-green-500' },
                    { name: 'Jaune', value: 'jaune', bgColor: 'bg-yellow-500' },
                    { name: 'Orange', value: 'orange', bgColor: 'bg-orange-500' },
                    { name: 'Rose', value: 'rose', bgColor: 'bg-pink-500' },
                    { name: 'Violet', value: 'violet', bgColor: 'bg-purple-500' },
                    { name: 'Gris', value: 'gris', bgColor: 'bg-gray-500' },
                    { name: 'Marron', value: 'marron', bgColor: 'bg-amber-700' },
                    { name: 'Beige', value: 'beige', bgColor: 'bg-amber-100' },
                  ].map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => {
                        const updatedColors = editingProduct.colors.includes(color.value)
                          ? editingProduct.colors.filter((c: string) => c !== color.value)
                          : [...editingProduct.colors, color.value];
                        setEditingProduct({ ...editingProduct, colors: updatedColors });
                      }}
                      className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors ${
                        editingProduct.colors.includes(color.value)
                          ? 'border-red-500 bg-gray-800'
                          : 'border-gray-700 bg-gray-800 hover:border-red-500'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${color.bgColor} border border-gray-600`}></div>
                      <span className={`text-sm font-medium ${
                        editingProduct.colors.includes(color.value) ? 'text-white' : 'text-gray-300'
                      }`}>
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNew}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                    className="w-4 h-4 text-red-500 bg-gray-800 border-gray-700 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <span className="ml-2 text-gray-300">Nouveau produit</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingProduct.isActive}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                    className="w-4 h-4 text-red-500 bg-gray-800 border-gray-700 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <span className="ml-2 text-gray-300">Produit actif</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowEditProductModal(false);
                  setEditingProduct(null);
                  setEditImageFile(null);
                  setEditImagePreview('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateProduct}
                disabled={!editingProduct.name || !editingProduct.category || !editingProduct.price}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mettre à jour le produit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
