import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext.tsx';

interface SearchResult {
  product_id: string;
  name: string;
  category: string;
  price: number;
  image_url?: string;
  image_data?: string;
}

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const { searchProducts } = useProducts();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Recherche dans la base de données
  const performSearch = async (searchQuery: string): Promise<SearchResult[]> => {
    try {
      // Utiliser la fonction de recherche du contexte
      const searchResults = await searchProducts(searchQuery);
      
      // Convertir les produits en résultats de recherche
      const results: SearchResult[] = searchResults.map(product => ({
        product_id: product.product_id,
        name: product.name,
        category: product.category,
        price: product.price,
        image_url: product.image_url,
        image_data: product.image_data,
      }));
      
      return results.slice(0, 8); // Limiter à 8 résultats
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      return [];
    }
  };

  // Gestion du clic en dehors de la barre de recherche
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Recherche en temps réel
  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        // Simuler une recherche avec délai pour éviter trop de requêtes
        const searchResults = await performSearch(query);
        setResults(searchResults);
        setShowResults(searchResults.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // Gestion des touches clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      } else if (query.trim()) {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  // Clic sur un résultat
  const handleResultClick = (result: SearchResult) => {
    navigate(`/produit/${result.product_id}`);
    setQuery('');
    setShowResults(false);
    setSelectedIndex(-1);
  };

  // Recherche manuelle
  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/produits?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setShowResults(false);
      setSelectedIndex(-1);
    }
  };

  // Formatage du prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="relative" ref={searchRef}>
      <motion.form 
        onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
        className="relative mt-8 rounded-full sm:mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <div className="relative">
          <div className="absolute rounded-full -inset-px bg-gradient-to-r from-red-500 to-red-600"></div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-6">
              {isSearching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
              ) : (
                <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
            <input 
              ref={inputRef}
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowResults(results.length > 0)}
              placeholder="Rechercher un produit..." 
              className="block w-full py-4 pr-6 text-white placeholder-gray-500 bg-black border border-transparent rounded-full pl-14 sm:py-5 focus:border-transparent focus:ring-0" 
              autoComplete="off"
            />
          </div>
        </div>
        <div className="sm:absolute flex sm:right-1.5 sm:inset-y-1.5 mt-4 sm:mt-0">
          <button 
            type="submit" 
            className="inline-flex items-center justify-center w-full px-5 py-5 text-sm font-semibold tracking-widest text-black uppercase transition-all duration-200 bg-white rounded-full sm:w-auto sm:py-3 hover:opacity-90"
          >
            Rechercher
          </button>
        </div>
      </motion.form>

      {/* Résultats de recherche */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <motion.div
                  key={result.product_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-800 transition-colors ${
                    index === selectedIndex ? 'bg-gray-800' : ''
                  } ${index === results.length - 1 ? '' : 'border-b border-gray-700'}`}
                  onClick={() => handleResultClick(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {/* Image du produit */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-700">
                    <img
                      src={result.image_url || result.image_data || '/back.jpg'}
                      alt={result.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Informations du produit */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm truncate">
                      {result.name}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {result.category}
                    </p>
                  </div>
                  
                  {/* Prix */}
                  <div className="flex-shrink-0">
                    <span className="text-red-500 font-bold text-sm">
                      {formatPrice(result.price)}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {/* Message si aucun résultat */}
              {results.length === 0 && query.trim().length >= 2 && !isSearching && (
                <div className="p-4 text-center text-gray-400">
                  <p>Aucun produit trouvé pour "{query}"</p>
                  <p className="text-sm mt-1">Essayez d'autres termes de recherche</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
