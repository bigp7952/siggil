import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderAdmin from '../components/common/HeaderAdmin.tsx';
import AnimatedText from '../components/common/AnimatedText.tsx';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  updateCategoryOrder,
  getCategoryStats,
  Category,
  CreateCategoryData
} from '../services/categoryService.ts';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
    description: '',
    color: '#3B82F6',
    sort_order: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    loadCategories();
    loadStats();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des catégories...');
      const data = await getAllCategories();
      console.log('📊 Catégories chargées:', data);
      setCategories(data);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      console.log('🔄 Chargement des statistiques...');
      const data = await getCategoryStats();
      console.log('📈 Statistiques chargées:', data);
      setStats(data);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 Début de la soumission du formulaire');
    console.log('📝 Données du formulaire:', formData);
    console.log('🖼️ Image preview:', imagePreview);
    
    try {
      const categoryData = {
        ...formData,
        image_data: imagePreview || undefined
      };

      console.log('📤 Données à envoyer:', categoryData);

      if (editingCategory) {
        // Mise à jour
        console.log('✏️ Mode édition pour la catégorie:', editingCategory.id);
        const success = await updateCategory(editingCategory.id!, categoryData);
        if (success) {
          console.log('✅ Mise à jour réussie');
          await loadCategories();
          resetForm();
        } else {
          console.log('❌ Échec de la mise à jour');
        }
      } else {
        // Création
        console.log('🆕 Mode création de nouvelle catégorie');
        const newCategory = await createCategory(categoryData);
        if (newCategory) {
          console.log('✅ Création réussie:', newCategory);
          await loadCategories();
          resetForm();
        } else {
          console.log('❌ Échec de la création');
        }
      }
    } catch (error) {
      console.error('💥 Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      sort_order: 0
    });
    setImageFile(null);
    setImagePreview('');
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color,
      sort_order: category.sort_order
    });
    setImagePreview(category.image_data || '');
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        const success = await deleteCategory(id);
        if (success) {
          await loadCategories();
          await loadStats();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const success = await toggleCategoryStatus(id, !currentStatus);
      if (success) {
        await loadCategories();
        await loadStats();
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleOrderChange = async (id: number, newOrder: number) => {
    try {
      const success = await updateCategoryOrder(id, newOrder);
      if (success) {
        await loadCategories();
      }
    } catch (error) {
      console.error('Erreur lors du changement d\'ordre:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <HeaderAdmin />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-center text-white">Chargement des catégories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <HeaderAdmin />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <AnimatedText type="word" className="text-4xl font-bold text-white mb-4">
              Gestion des <span className="text-red-500">Catégories</span>
            </AnimatedText>
            <p className="text-gray-400">
              Créez et gérez les catégories populaires de votre site
            </p>
          </motion.div>

          {/* Statistiques */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h3 className="text-gray-400 text-sm">Total Catégories</h3>
                <p className="text-2xl font-bold text-white">{stats.total_categories}</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h3 className="text-gray-400 text-sm">Actives</h3>
                <p className="text-2xl font-bold text-green-500">{stats.active_categories}</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h3 className="text-gray-400 text-sm">Inactives</h3>
                <p className="text-2xl font-bold text-red-500">{stats.inactive_categories}</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h3 className="text-gray-400 text-sm">Total Produits</h3>
                <p className="text-2xl font-bold text-blue-500">{stats.total_products}</p>
              </div>
            </motion.div>
          )}

          {/* Bouton Ajouter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6"
          >
            <button
              onClick={() => setShowForm(true)}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              + Ajouter une catégorie
            </button>
          </motion.div>

          {/* Formulaire */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Nom de la catégorie *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                        placeholder="Ex: Vêtements"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Couleur *
                      </label>
                      <input
                        type="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-full h-10 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                      placeholder="Description de la catégorie..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Ordre d'affichage
                      </label>
                      <input
                        type="number"
                        name="sort_order"
                        value={formData.sort_order}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Image de la catégorie
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* Aperçu de l'image */}
                  {imagePreview && (
                    <div className="flex items-center space-x-4">
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                        }}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Supprimer l'image
                      </button>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      {editingCategory ? 'Mettre à jour' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Liste des catégories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Produits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Ordre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-8 h-8 rounded-lg"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {category.name}
                            </div>
                            {category.image_data && (
                              <img
                                src={category.image_data}
                                alt={category.name}
                                className="w-6 h-6 object-cover rounded mt-1"
                              />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300 max-w-xs truncate">
                          {category.description || 'Aucune description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">
                          {category.product_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={category.sort_order}
                          onChange={(e) => handleOrderChange(category.id!, parseInt(e.target.value))}
                          className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                          min="0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(category.id!, category.is_active)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            category.is_active
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {category.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(category.id!)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
