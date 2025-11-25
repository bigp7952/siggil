import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header.tsx';
import { supabase } from '../lib/supabase.ts';
import { useToast } from '../contexts/ToastContext.tsx';
import { uploadPremiumProof, verifyPremiumCode, checkPremiumAccess } from '../services/premiumService.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useProducts } from '../contexts/ProductContext.tsx';
import ProductCard from '../components/products/ProductCard.tsx';
import PremiumOnboarding from '../components/premium/PremiumOnboarding.tsx';
// formatImageSrc removed - not used

const Premium: React.FC = () => {
  const { showError, showSuccess } = useToast();
  const { user } = useAuth();
  // productState removed - not used
  const [step, setStep] = useState<'locked' | 'form' | 'submitted' | 'code' | 'onboarding' | 'products'>('locked');
  const [premiumProducts, setPremiumProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    instagram: '',
    tiktok: '',
    proof1: null as File | null,
    proof2: null as File | null,
    proof3: null as File | null,
    proof4: null as File | null,
    proof5: null as File | null,
    proof6: null as File | null,
  });

  const handleFileChange = (field: keyof typeof formData, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  // Charger les produits premium
  const loadPremiumProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_premium', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des produits premium:', error);
        return;
      }

      setPremiumProducts(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Vérifier l'état premium au chargement
  useEffect(() => {
    const checkPremiumState = async () => {
      if (!user?.phoneNumber) {
        // Nettoyer le localStorage si pas d'utilisateur
        localStorage.removeItem('siggil_premium_access');
        localStorage.removeItem('siggil_premium_request_id');
        localStorage.removeItem('siggil_premium_code_entered');
        localStorage.removeItem('siggil_premium_onboarding_seen');
        localStorage.removeItem('siggil_premium_request_submitted');
        setStep('locked');
        return;
      }

      const normalizedPhone = user.phoneNumber.replace(/\D/g, '');
      console.log('Vérification de l\'état premium pour:', normalizedPhone);
      
      // D'abord, vérifier dans la base de données l'état réel de l'accès premium
      const access = await checkPremiumAccess(normalizedPhone);
      console.log('Résultat checkPremiumAccess:', access);
      
      if (access.hasAccess && access.requestId) {
        // L'utilisateur a un accès premium valide (code approuvé et pas encore utilisé)
        // checkPremiumAccess filtre déjà les codes utilisés, donc on peut faire confiance
        console.log('Accès premium valide, requestId:', access.requestId);
        
        // Sauvegarder dans localStorage pour la persistance
        localStorage.setItem('siggil_premium_access', 'true');
        localStorage.setItem('siggil_premium_request_id', access.requestId);
        localStorage.setItem('siggil_premium_code_entered', access.requestId);
        
        const hasSeenOnboarding = localStorage.getItem('siggil_premium_onboarding_seen') === 'true';
        
        if (!hasSeenOnboarding) {
          // Afficher l'onboarding si pas encore vu
          console.log('Affichage de l\'onboarding');
          setStep('onboarding');
        } else {
          // Afficher les produits premium
          console.log('Affichage des produits premium');
          setStep('products');
          loadPremiumProducts();
        }
        return;
      }
      
      // Si checkPremiumAccess retourne false, cela signifie que le code a été utilisé ou n'existe pas
      // Nettoyer complètement le localStorage et forcer une nouvelle demande
      console.log('Pas d\'accès premium valide (code utilisé ou inexistant), nettoyage complet et affichage de la page de soumission');
      localStorage.removeItem('siggil_premium_access');
      localStorage.removeItem('siggil_premium_request_id');
      localStorage.removeItem('siggil_premium_code_entered');
      localStorage.removeItem('siggil_premium_onboarding_seen');
      localStorage.removeItem('siggil_premium_request_submitted');
      
      // Forcer l'affichage de la page de soumission (locked) immédiatement
      setStep('locked');

      // Vérifier si l'utilisateur a une demande existante
      const { data: requests, error: requestsError } = await supabase
        .from('premium_requests')
        .select('id, status, code, code_used')
        .eq('phone', normalizedPhone)
        .order('created_at', { ascending: false })
        .limit(1);

      if (requestsError) {
        console.error('Erreur lors de la vérification des demandes:', requestsError);
      }

      if (requests && requests.length > 0) {
        const latestRequest = requests[0];
        console.log('Dernière demande trouvée:', latestRequest);
        
        // Si le code a été utilisé, l'utilisateur doit faire une nouvelle demande
        if (latestRequest.code_used) {
          console.log('Code déjà utilisé, affichage de la page normale pour nouvelle demande');
          setStep('locked');
          return;
        }
        
        // Si la demande est approuvée avec un code mais le code n'a pas encore été entré
        if (latestRequest.status === 'approved' && latestRequest.code && !latestRequest.code_used) {
          const codeEntered = localStorage.getItem('siggil_premium_code_entered') === latestRequest.id;
          console.log('Code approuvé non utilisé, code entré?', codeEntered);
          
          if (!codeEntered) {
            // Afficher l'input pour entrer le code
            console.log('Affichage de l\'input code');
            setStep('submitted');
            return;
          }
        }
        
        // Si la demande est en attente ou rejetée
        if (latestRequest.status === 'pending' || latestRequest.status === 'rejected') {
          console.log('Demande en attente ou rejetée, affichage de la page soumission');
          setStep('submitted');
          return;
        }
      }

      // Par défaut, afficher la page normale
      console.log('Affichage de la page normale (locked)');
      setStep('locked');
    };

    checkPremiumState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.phoneNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Normaliser le numéro de téléphone
      const normalizedPhone = formData.phone.replace(/\D/g, '');
      
      if (!normalizedPhone || normalizedPhone.length < 8) {
        showError('Veuillez entrer un numéro de téléphone valide');
        setIsSubmitting(false);
        return;
      }

      // Créer la demande dans Supabase
      const { data: requestData, error: insertError } = await supabase
        .from('premium_requests')
        .insert({
          name: formData.name,
          phone: normalizedPhone, // Numéro normalisé
          instagram: formData.instagram.replace('@', '').trim(),
          tiktok: formData.tiktok.replace('@', '').trim(),
          status: 'pending',
          images: [],
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erreur lors de la création de la demande:', insertError);
        showError('Erreur lors de la soumission. Veuillez réessayer.');
        setIsSubmitting(false);
        return;
      }

      // Uploader les images
      const imageUrls: string[] = [];
      const proofFiles = [
        formData.proof1,
        formData.proof2,
        formData.proof3,
        formData.proof4,
        formData.proof5,
        formData.proof6,
      ].filter(Boolean) as File[];

      for (let i = 0; i < proofFiles.length; i++) {
        const url = await uploadPremiumProof(proofFiles[i], requestData.id, i + 1);
        if (url) {
          imageUrls.push(url);
        }
      }

      // Mettre à jour la demande avec les URLs des images
      const { error: updateError } = await supabase
        .from('premium_requests')
        .update({ images: imageUrls })
        .eq('id', requestData.id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour des images:', updateError);
      }

      console.log('Demande premium créée:', requestData);
      
      // Sauvegarder l'ID de la demande dans localStorage pour persister l'état
      localStorage.setItem('siggil_premium_request_submitted', requestData.id);
      localStorage.setItem('siggil_premium_request_phone', normalizedPhone);
      
      setStep('submitted');
      showSuccess('Demande soumise avec succès !');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      showError('Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');
    
    if (!code.trim()) {
      setCodeError('Veuillez entrer votre code');
      return;
    }

    setIsVerifyingCode(true);
    // Normaliser le numéro de téléphone (supprimer tous les caractères non numériques)
    const phone = user?.phoneNumber 
      ? user.phoneNumber.replace(/\D/g, '') 
      : formData.phone.replace(/\D/g, '');

    if (!phone || phone.length < 8) {
      setCodeError('Numéro de téléphone invalide');
      setIsVerifyingCode(false);
      return;
    }

    // Normaliser le code (majuscules, supprimer espaces)
    const normalizedCode = code.toUpperCase().trim().replace(/\s+/g, '');
    
    console.log('Tentative de validation du code:', { 
      code: normalizedCode, 
      phone,
      userPhone: user?.phoneNumber,
      formPhone: formData.phone
    });

    try {
      const result = await verifyPremiumCode(normalizedCode, phone);
      
      if (result.valid && result.requestId) {
        // Code valide, activer l'accès premium
        localStorage.setItem('siggil_premium_access', 'true');
        localStorage.setItem('siggil_premium_request_id', result.requestId);
        localStorage.setItem('siggil_premium_code_entered', result.requestId);
        // Nettoyer les anciennes clés de demande soumise
        localStorage.removeItem('siggil_premium_request_submitted');
        localStorage.removeItem('siggil_premium_request_phone');
        
        showSuccess('Code validé ! Accès Premium activé.');
        // Supprimer le flag onboarding pour forcer l'affichage
        localStorage.removeItem('siggil_premium_onboarding_seen');
        // Afficher l'onboarding
        setStep('onboarding');
      } else {
        setCodeError(result.message || 'Code invalide');
        showError(result.message || 'Code invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setCodeError('Erreur lors de la vérification');
      showError('Erreur lors de la vérification');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const accessConditions = [
    {
      platform: 'Instagram',
      requirements: [
        'S\'abonner à 3 comptes SIGGIL',
        'Liker 10 posts sur chaque compte',
        'Commenter "leppsixela" sur 3 posts différents',
        'Capturer les preuves d\'abonnement'
      ],
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      platform: 'TikTok',
      requirements: [
        'S\'abonner à 3 comptes SIGGIL',
        'Liker 10 vidéos sur chaque compte',
        'Commenter "leppsixela" sur 3 vidéos différentes',
        'Capturer les preuves d\'abonnement'
      ],
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      )
    }
  ];

  const handleOnboardingComplete = () => {
    localStorage.setItem('siggil_premium_onboarding_seen', 'true');
    setStep('products');
    loadPremiumProducts();
  };

  // Vue onboarding
  if (step === 'onboarding') {
    return <PremiumOnboarding onComplete={handleOnboardingComplete} />;
  }

  // Vue produits premium
  if (step === 'products') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="section-padding py-6 md:py-8">
          <div className="container-custom">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8 md:mb-12"
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-3 md:mb-4">
                Produits <span className="gradient-text">Premium</span>
              </h1>
              <p className="text-gray-text text-xs md:text-sm max-w-2xl mx-auto">
                Collection exclusive - Produits gratuits, vous ne payez que la livraison
              </p>
            </motion.div>

            {/* Grille de produits */}
            {isLoadingProducts ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6c00]"></div>
                <p className="text-gray-text mt-4">Chargement des produits...</p>
              </div>
            ) : premiumProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {premiumProducts.map((product, index) => (
                  <ProductCard
                    key={product.id || product.product_id}
                    product={{
                      id: product.id,
                      product_id: product.product_id,
                      name: product.name,
                      category: product.category,
                      price: product.price,
                      original_price: product.original_price,
                      stock: product.stock,
                      image_url: product.image_url,
                      image_data: product.image_data,
                      sizes: product.sizes || [],
                      colors: product.colors || [],
                      is_new: product.is_new,
                      is_active: product.is_active,
                      description: product.description,
                    }}
                    delay={0.05 * index}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-text">Aucun produit premium disponible pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'locked') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        
        <div className="section-padding">
          <div className="container-custom max-w-4xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 md:mb-12"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-karma rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-male-red mb-2 block">
                Premium
              </span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-3 md:mb-4">
                ZONE <span className="gradient-text">PREMIUM</span>
              </h1>
              <p className="text-gray-text text-xs md:text-sm max-w-2xl mx-auto">
                Accès exclusif aux articles gratuits pour nos plus fidèles supporters
              </p>
            </motion.div>

            {/* Conditions d'accès */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 md:mb-12"
            >
              <h2 className="text-lg md:text-xl font-display font-bold text-blacksoft mb-6 md:mb-8 text-center">Conditions d'accès</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {accessConditions.map((platform, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="card-modern p-4 md:p-6"
                  >
                    <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-karma rounded-lg flex items-center justify-center text-white flex-shrink-0">
                        {platform.icon}
                      </div>
                      <h3 className="text-blacksoft font-display font-bold text-base md:text-lg">{platform.platform}</h3>
                    </div>
                    <ul className="space-y-1.5 md:space-y-2">
                      {platform.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-male-red rounded-full mt-1.5 md:mt-2 flex-shrink-0"></div>
                          <span className="text-gray-text text-xs md:text-sm">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Avantages Premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card-modern p-4 md:p-6 lg:p-8 mb-8 md:mb-12 bg-gradient-to-r from-karma-yellow/10 to-karma-orange/10"
            >
              <h2 className="text-lg md:text-xl font-display font-bold text-blacksoft mb-6 md:mb-8 text-center">Avantages Premium</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {[
                  { 
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ), 
                    title: 'Articles Gratuits', 
                    desc: 'Tous les articles sont gratuits, vous payez seulement la livraison' 
                  },
                  { 
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ), 
                    title: 'Accès Exclusif', 
                    desc: 'Collection réservée aux vrais supporters de la marque' 
                  },
                  { 
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ), 
                    title: 'Accès Unique', 
                    desc: 'Une commande = déconnexion, nouveau code requis' 
                  },
                ].map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-karma rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4 text-white">
                      {benefit.icon}
                    </div>
                    <h3 className="text-blacksoft font-semibold text-sm md:text-base mb-1 md:mb-2">{benefit.title}</h3>
                    <p className="text-gray-text text-[10px] md:text-xs">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bouton de demande */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <button
                onClick={() => setStep('form')}
                className="btn-primary text-sm md:text-base py-2.5 md:py-3 px-6 md:px-8"
              >
                Demander l'accès Premium
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        
        <div className="section-padding">
          <div className="container-custom max-w-4xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-6 md:mb-10"
            >
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-male-red mb-2 block">
                Demande
              </span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-3 md:mb-4">
                DEMANDE <span className="gradient-text">D'ACCÈS</span>
              </h1>
              <p className="text-gray-text text-xs md:text-sm max-w-2xl mx-auto">
                Remplissez le formulaire et fournissez les preuves d'abonnement
              </p>
            </motion.div>

            {/* Formulaire */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="card-modern p-4 md:p-6 lg:p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                <div>
                  <label className="block text-blacksoft font-semibold mb-1.5 md:mb-2 text-xs md:text-sm">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange transition-colors text-xs md:text-sm"
                    placeholder="Votre nom complet"
                  />
                </div>
                <div>
                  <label className="block text-blacksoft font-semibold mb-1.5 md:mb-2 text-xs md:text-sm">Numéro WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange transition-colors text-xs md:text-sm"
                    placeholder="Ex: 77 123 45 67"
                  />
                </div>
                <div>
                  <label className="block text-blacksoft font-semibold mb-1.5 md:mb-2 text-xs md:text-sm">Compte Instagram</label>
                  <input
                    type="text"
                    required
                    value={formData.instagram}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                    className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange transition-colors text-xs md:text-sm"
                    placeholder="@votre_compte"
                  />
                </div>
                <div>
                  <label className="block text-blacksoft font-semibold mb-1.5 md:mb-2 text-xs md:text-sm">Compte TikTok</label>
                  <input
                    type="text"
                    required
                    value={formData.tiktok}
                    onChange={(e) => setFormData(prev => ({ ...prev, tiktok: e.target.value }))}
                    className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-blacksoft placeholder-gray-medium focus:outline-none focus:border-karma-orange transition-colors text-xs md:text-sm"
                    placeholder="@votre_compte"
                  />
                </div>
              </div>

              {/* Upload des preuves */}
              <div className="mb-4 md:mb-6">
                <h3 className="text-blacksoft font-bold text-sm md:text-base mb-3 md:mb-4">Preuves d'abonnement (captures d'écran)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  {[
                    { field: 'proof1', label: 'Preuve Instagram 1' },
                    { field: 'proof2', label: 'Preuve Instagram 2' },
                    { field: 'proof3', label: 'Preuve Instagram 3' },
                    { field: 'proof4', label: 'Preuve TikTok 1' },
                    { field: 'proof5', label: 'Preuve TikTok 2' },
                    { field: 'proof6', label: 'Preuve TikTok 3' }
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <label className="block text-blacksoft font-semibold mb-1.5 md:mb-2 text-xs md:text-sm">{label}</label>
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => handleFileChange(field as keyof typeof formData, e.target.files?.[0] || null)}
                        className="w-full bg-offwhite border border-gray-200 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-blacksoft file:mr-2 md:file:mr-3 file:py-1 md:file:py-1.5 file:px-2 md:file:px-3 file:rounded-full file:border-0 file:text-[10px] md:file:text-xs file:font-semibold file:bg-gradient-karma file:text-white hover:file:opacity-90 transition-colors text-xs md:text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditions */}
              <div className="bg-offwhite rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                <h4 className="text-blacksoft font-semibold mb-2 md:mb-3 text-xs md:text-sm">Conditions importantes :</h4>
                <ul className="space-y-1 md:space-y-1.5 text-gray-text text-[10px] md:text-xs">
                  <li>• Vous devez être abonné à 3 comptes SIGGIL sur chaque plateforme</li>
                  <li>• Vous devez avoir liké 10 posts/vidéos sur chaque compte</li>
                  <li>• Vous devez avoir commenté "leppsixela" sur 3 posts/vidéos différents</li>
                  <li>• Les captures d'écran doivent être claires et complètes</li>
                  <li>• L'analyse peut prendre 24-48h</li>
                  <li>• Le code d'accès sera envoyé par WhatsApp</li>
                </ul>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-sm md:text-base py-2.5 md:py-3 px-6 md:px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Soumission en cours...' : 'Soumettre la demande'}
                </button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'submitted') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        
        <div className="section-padding py-6 md:py-8">
          <div className="container-custom max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-green-600 mb-2 block">
                Succès
              </span>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-3 md:mb-4">
                DEMANDE <span className="gradient-text">ENVOYÉE</span>
              </h1>
              <p className="text-gray-text text-xs md:text-sm max-w-xl mx-auto mb-6 md:mb-8">
                Votre demande d'accès Premium a été soumise avec succès. Notre équipe va analyser vos preuves d'abonnement et vous contactera par WhatsApp dans les 24-48h avec votre code d'accès.
              </p>
              
              {/* Champ pour entrer le code */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-modern p-4 md:p-6 mt-6"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="w-10 h-10 bg-[#ff6c00]/10 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-[#ff6c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h3 className="text-base md:text-lg font-display font-bold text-blacksoft">
                    Entrez votre code d'accès
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-gray-text mb-4 text-center">
                  Si vous avez déjà reçu votre code par WhatsApp, entrez-le ci-dessous pour activer immédiatement votre accès Premium. Vous pouvez revenir sur cette page à tout moment pour entrer votre code.
                </p>
                <form onSubmit={handleCodeSubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.toUpperCase());
                        setCodeError('');
                      }}
                      placeholder="SIGGIL-XXXXXX"
                      className="w-full bg-offwhite border border-gray-200 rounded-lg px-4 py-2.5 text-center text-sm md:text-base font-mono text-blacksoft focus:outline-none focus:border-[#ff6c00] transition-colors"
                      maxLength={13}
                    />
                    {codeError && (
                      <p className="text-xs text-red-600 mt-2">{codeError}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isVerifyingCode}
                    className="w-full btn-primary text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifyingCode ? 'Vérification...' : 'Activer l\'accès Premium'}
                  </button>
                </form>
              </motion.div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setStep('locked')}
                  className="btn-secondary text-sm py-2.5"
                >
                  Voir les conditions
                </button>
                <button
                  onClick={() => setStep('form')}
                  className="btn-secondary text-sm py-2.5"
                >
                  Nouvelle demande
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Premium;
