import React, { useState, useEffect } from 'react';
import AdminHeader from '../components/common/AdminHeader.tsx';
import { uploadCategoryImage, fileToBase64 } from '../services/imageUploadService.ts';
import { supabaseAdmin } from '../lib/supabase.ts';
import { useToast } from '../contexts/ToastContext.tsx';
import { useConfirm } from '../contexts/ConfirmContext.tsx';
import { formatImageSrc, handleImageError } from '../utils/imageUtils.ts';
interface Category {
  id?: number | string;
  name: string;
  description?: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  product_count: number;
  image_data?: string;
}

interface CreateCategoryData {
  name: string;
  description?: string;
  color: string;
  sort_order: number;
  image_data?: string;
}

const AdminCategories: React.FC = () => {
  const { showSuccess, showError, showWarning } = useToast();
  const confirm = useConfirm();
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
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadCategories();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      console.log('Chargement des catégories...');
      
      // Charger depuis Supabase
      const { data: categoriesData, error: categoriesError } = await supabaseAdmin
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (categoriesError) {
        console.error('Erreur Supabase categories:', categoriesError);
        throw categoriesError;
      }

      // Charger les produits pour compter
      const { data: productsData } = await supabaseAdmin
        .from('products')
        .select('category')
        .eq('is_active', true);

      const categoryMap = new Map<string, Category>();
      (categoriesData || []).forEach((cat: any) => {
        const productCount = (productsData || []).filter((p: any) => p.category === cat.name).length;
        categoryMap.set(cat.name, {
          id: cat.id,
          name: cat.name,
          description: cat.description || '',
          color: cat.color || '#3B82F6',
          image_data: cat.image_data || undefined,
          is_active: cat.is_active !== false,
          sort_order: cat.sort_order || 0,
          product_count: productCount,
        });
      });
      
      const data = Array.from(categoryMap.values());
      console.log('Catégories chargées:', data);
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      console.log('Chargement des statistiques...');
      
      const { data: productsData } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('is_active', true);

      const data = {
        total_categories: categories.length,
        active_categories: categories.filter(c => c.is_active).length,
        inactive_categories: categories.filter(c => !c.is_active).length,
        total_products: (productsData || []).length,
      };
      console.log('📈 Statistiques chargées:', data);
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation
      if (!file.type.startsWith('image/')) {
        showWarning('Veuillez sélectionner uniquement des fichiers image.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showWarning('L\'image ne doit pas dépasser 5MB.');
        return;
      }

      // Stocker le fichier
      setImageFile(file);

      // Aperçu immédiat (base64)
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Début de la soumission du formulaire');
    console.log('Données du formulaire:', formData);
    
    setUploadingImage(true);

    try {
      let imageUrl: string | null = null;
      let imageData: string | null = null;

      // Si une nouvelle image a été sélectionnée, l'uploader
      if (imageFile) {
        console.log('Upload de l\'image vers Supabase Storage...');
        imageUrl = await uploadCategoryImage(imageFile, formData.name);
        
        if (!imageUrl) {
          // Fallback vers base64 si l'upload échoue
          console.log('Échec upload Storage, utilisation de base64');
          imageData = imagePreview;
        }
      } else if (imagePreview) {
        // Image existante (base64 ou URL)
        if (imagePreview.startsWith('http')) {
          imageUrl = imagePreview;
        } else {
          imageData = imagePreview;
        }
      }

      // Préparer les données pour Supabase
      const insertData: any = {
        name: formData.name,
        description: formData.description || null,
        color: formData.color || '#3B82F6',
        sort_order: formData.sort_order || 0,
        is_active: true,
      };

      // Ajouter l'image (URL ou base64)
      if (imageUrl) {
        // Si on a une URL, on la stocke dans image_data (ou on pourrait créer un champ image_url séparé)
        insertData.image_data = imageUrl;
      } else if (imageData) {
        insertData.image_data = imageData;
      }

      console.log('📤 Données à envoyer vers Supabase:', insertData);

      // Vérifier si une catégorie avec le même nom existe déjà
      const { data: existingCategory } = await supabaseAdmin
        .from('categories')
        .select('id, name')
        .eq('name', insertData.name.trim())
        .maybeSingle();

      if (editingCategory && editingCategory.id) {
        // Mise à jour de la catégorie existante
        console.log('✏️ Mise à jour de la catégorie:', editingCategory.id);
        
        // Vérifier si le nom a changé et si le nouveau nom existe déjà
        if (existingCategory && existingCategory.id !== editingCategory.id) {
          showError('Une catégorie avec ce nom existe déjà. Veuillez choisir un autre nom.');
          setUploadingImage(false);
          return;
        }
        
        const updateData: any = {
          name: insertData.name.trim(),
          description: insertData.description,
          color: insertData.color,
          sort_order: insertData.sort_order,
          updated_at: new Date().toISOString(),
        };

        // Ajouter l'image si elle existe
        if (insertData.image_data !== undefined) {
          updateData.image_data = insertData.image_data;
        }

        const { data, error } = await supabaseAdmin
          .from('categories')
          .update(updateData)
          .eq('id', editingCategory.id)
          .select()
          .single();

        if (error) {
          console.error('Erreur Supabase lors de la mise à jour:', error);
          if (error.code === '23505' || error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
            showError('Une catégorie avec ce nom existe déjà. Veuillez choisir un autre nom.');
          } else {
            throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
          }
          return;
        }

        console.log('Catégorie mise à jour avec succès:', data);
        showSuccess('Catégorie mise à jour avec succès !');
      } else {
        // Création d'une nouvelle catégorie
        console.log('➕ Création d\'une nouvelle catégorie');
        
        // Vérifier si le nom existe déjà
        if (existingCategory) {
          showError('Une catégorie avec ce nom existe déjà. Veuillez choisir un autre nom.');
          setUploadingImage(false);
          return;
        }
        
        const { data, error } = await supabaseAdmin
          .from('categories')
          .insert({
            ...insertData,
            name: insertData.name.trim(),
          })
          .select()
          .single();

        if (error) {
          console.error('Erreur Supabase lors de la création:', error);
          if (error.code === '23505' || error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
            showError('Une catégorie avec ce nom existe déjà. Veuillez choisir un autre nom.');
          } else {
            throw new Error(`Erreur lors de la création: ${error.message}`);
          }
          return;
        }

        console.log('Catégorie créée avec succès:', data);
        showSuccess('Catégorie créée avec succès !');
      }

      // Recharger les catégories après création/mise à jour
      await loadCategories();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      // Vérifier si c'est une erreur de contrainte unique
      if (errorMessage.includes('duplicate key') || errorMessage.includes('unique constraint') || errorMessage.includes('23505')) {
        showError('Une catégorie avec ce nom existe déjà. Veuillez choisir un autre nom.');
      } else {
        showError('Erreur lors de la sauvegarde: ' + errorMessage);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      sort_order: 0
    });
    setImagePreview('');
    setImageFile(null);
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

  const handleDelete = async (id: number | string) => {
    const confirmed = await confirm({
      title: 'Supprimer la catégorie',
      message: 'Êtes-vous sûr de vouloir supprimer cette catégorie ? Les produits de cette catégorie ne seront pas supprimés.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
    });

    if (!confirmed) return;

    try {
      console.log('Suppression définitive de la catégorie:', id);
      
      // Supprimer définitivement de Supabase
      const { error, data } = await supabaseAdmin
        .from('categories')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error('Erreur Supabase lors de la suppression:', error);
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }

      console.log('Catégorie supprimée définitivement de la base de données:', data);
      showSuccess('Catégorie supprimée définitivement !');
      
      // Mettre à jour l'état local immédiatement
      setCategories(prev => prev.filter(cat => cat.id !== id));
      
      // Recharger les catégories et les stats
      await loadCategories();
      await loadStats();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showError('Erreur lors de la suppression: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  const handleToggleStatus = async (id: number | string, currentStatus: boolean) => {
    try {
      console.log('Changement de statut de la catégorie:', id, '->', !currentStatus);
      
      const { error } = await supabaseAdmin
        .from('categories')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase lors du changement de statut:', error);
        throw new Error(`Erreur lors du changement de statut: ${error.message}`);
      }

      console.log('Statut de la catégorie mis à jour avec succès');
      await loadCategories();
      await loadStats();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      showError('Erreur lors du changement de statut: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  const handleOrderChange = async (id: number | string, newOrder: number) => {
    try {
      console.log('Changement d\'ordre de la catégorie:', id, '->', newOrder);
      
      const { error } = await supabaseAdmin
        .from('categories')
        .update({ sort_order: newOrder })
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase lors du changement d\'ordre:', error);
        throw new Error(`Erreur lors du changement d'ordre: ${error.message}`);
      }

      console.log('Ordre de la catégorie mis à jour avec succès');
      await loadCategories();
    } catch (error) {
      console.error('Erreur lors du changement d\'ordre:', error);
      showError('Erreur lors du changement d\'ordre: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white relative">
        <AdminHeader />
        <div className="absolute inset-0 flex items-center justify-center bg-white z-40" style={{ top: '64px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-male-red border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-text text-sm">Chargement des catégories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />
      
      <div className="py-4 md:py-8 px-4 md:px-0">
        <div className="container-custom">
          {/* En-tête */}
          <div className="text-center mb-4 md:mb-8">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-male-red mb-1 md:mb-2 block">
              Gestion
            </span>
            <h1 className="text-xl md:text-3xl lg:text-4xl font-display font-bold mb-2 md:mb-4">
              CATÉGORIES
            </h1>
            <p className="text-gray-text text-sm md:text-base">
              Créez et gérez les catégories populaires de votre site
            </p>
          </div>

          {/* Statistiques */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
              <div className="card-modern p-3 md:p-4">
                <h3 className="text-gray-text text-[10px] md:text-sm mb-0.5 md:mb-1">Total</h3>
                <p className="text-lg md:text-2xl font-bold text-blacksoft">{stats.total_categories}</p>
              </div>
              <div className="card-modern p-3 md:p-4">
                <h3 className="text-gray-text text-[10px] md:text-sm mb-0.5 md:mb-1">Actives</h3>
                <p className="text-lg md:text-2xl font-bold text-[#ffba00]">{stats.active_categories}</p>
              </div>
              <div className="card-modern p-3 md:p-4">
                <h3 className="text-gray-text text-[10px] md:text-sm mb-0.5 md:mb-1">Inactives</h3>
                <p className="text-lg md:text-2xl font-bold text-red-500">{stats.inactive_categories}</p>
              </div>
              <div className="card-modern p-3 md:p-4">
                <h3 className="text-gray-text text-[10px] md:text-sm mb-0.5 md:mb-1">Produits</h3>
                <p className="text-lg md:text-2xl font-bold text-[#ff6c00]">{stats.total_products}</p>
              </div>
            </div>
          )}

          {/* Bouton Ajouter */}
          <div className="mb-4 md:mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#ff6c00] hover:bg-[#e55a00] text-white text-[11px] md:text-xs font-semibold px-4 md:px-6 py-2 md:py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
                + Ajouter une catégorie
            </button>
          </div>

          {/* Formulaire */}
          {showForm && (
            <div className="card-modern p-3 md:p-4 mb-4 md:mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm md:text-base font-display font-bold text-blacksoft">
                  {editingCategory ? 'Modifier' : 'Nouvelle catégorie'}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-text hover:text-blacksoft transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Nom et Couleur */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-blacksoft text-[10px] md:text-xs font-medium mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-xs md:text-sm text-blacksoft focus:outline-none focus:border-karma-orange transition-colors"
                      placeholder="Ex: T-Shirts..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-blacksoft text-[10px] md:text-xs font-medium mb-1">
                      Couleur *
                    </label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border border-gray-200 flex-shrink-0"
                        style={{ backgroundColor: formData.color }}
                      ></div>
                      <input
                        type="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="flex-1 h-8 bg-offwhite border border-gray-200 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-blacksoft text-[10px] md:text-xs font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-xs md:text-sm text-blacksoft focus:outline-none focus:border-karma-orange transition-colors resize-none"
                    placeholder="Description optionnelle..."
                  />
                </div>

                {/* Image et Ordre */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Image de la catégorie */}
                  <div>
                    <label className="block text-blacksoft text-[10px] md:text-xs font-medium mb-1">
                      Image
                    </label>
                    <div
                      className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:border-karma-orange transition-colors bg-offwhite"
                      onClick={() => document.getElementById('category-image-upload')?.click()}
                    >
                      {imagePreview ? (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Aperçu"
                            className="w-20 h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImagePreview('');
                            }}
                            className="absolute -top-1 -right-1 bg-male-red text-white p-1 rounded-full hover:bg-male-red/90 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <svg className="w-6 h-6 text-gray-text mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-blacksoft text-[10px] md:text-xs">Cliquez pour uploader</p>
                        </div>
                      )}
                      <input
                        id="category-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Ordre d'affichage */}
                  <div>
                    <label className="block text-blacksoft text-[10px] md:text-xs font-medium mb-1">
                      Ordre
                    </label>
                    <input
                      type="number"
                      name="sort_order"
                      value={formData.sort_order}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 py-2 text-xs md:text-sm text-blacksoft focus:outline-none focus:border-karma-orange transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] md:text-xs font-medium px-3 py-2 rounded-lg transition-colors border border-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#ff6c00] hover:bg-[#e55a00] text-white text-[11px] md:text-xs font-medium px-3 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    {editingCategory ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Liste des catégories */}
          <div className="card-modern overflow-hidden p-3 md:p-6">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-offwhite">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blacksoft uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blacksoft uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blacksoft uppercase tracking-wider">
                      Produits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blacksoft uppercase tracking-wider">
                      Ordre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blacksoft uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blacksoft uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.filter(c => c.is_active).map((category) => (
                    <tr key={category.id} className="hover:bg-offwhite transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-8 h-8 rounded-lg"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <div>
                            <div className="text-sm font-medium text-blacksoft">
                              {category.name}
                            </div>
                            {category.image_data && (
                              <img
                                src={formatImageSrc(null, category.image_data)}
                                alt={category.name}
                                className="w-6 h-6 object-cover rounded mt-1"
                                onError={handleImageError}
                                loading="lazy"
                              />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-text max-w-xs truncate">
                          {category.description || 'Aucune description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-blacksoft">
                          {category.product_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={category.sort_order}
                          onChange={(e) => handleOrderChange(category.id!, parseInt(e.target.value))}
                          className="w-16 bg-offwhite border border-gray-200 rounded px-2 py-1 text-blacksoft text-sm focus:outline-none focus:border-karma-orange"
                          min="0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(category.id!, category.is_active)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            category.is_active
                              ? 'bg-[#ffba00]/10 text-[#ffba00]'
                              : 'bg-[#e53637]/10 text-[#e53637]'
                          }`}
                        >
                          {category.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-[#ff6c00] hover:text-[#ff6c00]/80"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(category.id!)}
                            className="text-red-500 hover:text-red-600"
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
            {/* Mobile Cards */}
            <div className="md:hidden space-y-2.5">
              {categories.filter(c => c.is_active).map((category) => (
                <div key={category.id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex-shrink-0 border border-gray-200"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-blacksoft truncate mb-0.5">
                          {category.name}
                        </div>
                        <div className="text-xs text-gray-text line-clamp-2">
                          {category.description || 'Aucune description'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleStatus(category.id!, category.is_active)}
                      className={`px-2 py-1 rounded-full text-[10px] font-medium flex-shrink-0 whitespace-nowrap ml-2 ${
                        category.is_active
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {category.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  
                  {category.image_data && (
                    <div className="mb-2.5">
                      <img
                        src={formatImageSrc(null, category.image_data)}
                        alt={category.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        onError={handleImageError}
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-2.5 pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <span className="text-[10px] text-gray-text mr-1">Produits:</span>
                        <span className="text-xs font-semibold text-blacksoft">{category.product_count}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-[10px] text-gray-text mr-1">Ordre:</span>
                        <input
                          type="number"
                          value={category.sort_order}
                          onChange={(e) => handleOrderChange(category.id!, parseInt(e.target.value))}
                          className="w-10 bg-white border border-gray-200 rounded px-1 py-0.5 text-xs text-blacksoft focus:outline-none focus:border-[#ff6c00] ml-1"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-medium px-3 py-2 rounded-lg transition-colors border border-gray-200"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(category.id!)}
                      className="flex-1 bg-[#e53637] hover:bg-[#d32f2f] text-white text-[11px] font-medium px-3 py-2 rounded-lg transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
