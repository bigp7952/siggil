import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LocationPickerProps {
  onLocationSelect: (location: {
    address: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  }) => void;
  initialAddress?: string;
  initialCity?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  onLocationSelect, 
  initialAddress = '', 
  initialCity = '' 
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [suggestedLocation, setSuggestedLocation] = useState<{
    address: string;
    city: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);
  const [manualAddress, setManualAddress] = useState(initialAddress);
  const [manualCity, setManualCity] = useState(initialCity);
  const [showManualInput, setShowManualInput] = useState(false);

  // Géolocalisation automatique
  const getCurrentLocation = async () => {
    setIsLocating(true);
    setLocationError(null);

    try {
      // Demander la permission de géolocalisation
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Géolocalisation non supportée'));
          return;
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Récupérer l'adresse via l'API de géocodage inverse
      const address = await reverseGeocode(latitude, longitude);
      
      setSuggestedLocation({
        address: address.address,
        city: address.city,
        coordinates: { lat: latitude, lng: longitude }
      });
      
      setShowManualInput(false);
      
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      setLocationError('Impossible de récupérer votre position. Veuillez entrer votre adresse manuellement.');
      setShowManualInput(true);
    } finally {
      setIsLocating(false);
    }
  };

  // Géocodage inverse (simulation - en production, utilisez Google Maps API ou OpenStreetMap)
  const reverseGeocode = async (lat: number, lng: number) => {
    // Simulation - en production, utilisez une vraie API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Retourner une adresse simulée basée sur les coordonnées
    const cities = ['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Touba'];
    const city = cities[Math.floor(Math.abs(lat + lng) % cities.length)];
    
    return {
      address: `Zone ${Math.floor(lat * 1000) % 100}, Secteur ${Math.floor(lng * 1000) % 100}`,
      city: city
    };
  };

  // Valider la localisation suggérée
  const confirmSuggestedLocation = () => {
    if (suggestedLocation) {
      onLocationSelect({
        address: suggestedLocation.address,
        city: suggestedLocation.city,
        coordinates: suggestedLocation.coordinates
      });
    }
  };

  // Utiliser l'adresse manuelle
  const useManualAddress = () => {
    if (manualAddress.trim() && manualCity.trim()) {
      onLocationSelect({
        address: manualAddress.trim(),
        city: manualCity.trim()
      });
    }
  };

  // Modifier l'adresse manuellement
  const editManualAddress = () => {
    setShowManualInput(true);
    setSuggestedLocation(null);
  };

  return (
    <div className="space-y-4">
      {/* Bouton de géolocalisation */}
      <button
        type="button"
        onClick={getCurrentLocation}
        disabled={isLocating}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#ff6c00] to-[#ffba00] text-white rounded-lg hover:from-[#e55a00] hover:to-[#e5a000] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg font-medium text-sm"
      >
        {isLocating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>Localisation en cours...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Détecter ma position automatiquement</span>
          </>
        )}
      </button>

      {/* Erreur de géolocalisation */}
      {locationError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-3"
        >
          <p className="text-red-700 text-sm flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{locationError}</span>
          </p>
        </motion.div>
      )}

      {/* Localisation suggérée */}
      {suggestedLocation && !showManualInput && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-green-800 font-semibold text-sm">Position détectée</h4>
          </div>
          <div className="space-y-2 mb-4 bg-white/50 rounded-lg p-3">
            <p className="text-blacksoft text-sm">
              <span className="text-gray-600 font-medium">Adresse :</span> {suggestedLocation.address}
            </p>
            <p className="text-blacksoft text-sm">
              <span className="text-gray-600 font-medium">Ville :</span> {suggestedLocation.city}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={confirmSuggestedLocation}
              className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              Confirmer cette adresse
            </button>
            <button
              onClick={editManualAddress}
              className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Modifier l'adresse
            </button>
          </div>
        </motion.div>
      )}

      {/* Saisie manuelle */}
      {showManualInput && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#ff6c00]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#ff6c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h4 className="text-blacksoft font-semibold text-sm">Saisir l'adresse manuellement</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-blacksoft text-xs font-semibold mb-2">
                Adresse détaillée <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder="Ex: Rue 12, Zone A, Secteur 3"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-blacksoft focus:outline-none focus:ring-2 focus:ring-[#ff6c00]/20 focus:border-[#ff6c00] transition-all text-sm"
              />
            </div>
            
            <div>
              <label className="block text-blacksoft text-xs font-semibold mb-2">
                Ville <span className="text-red-500">*</span>
              </label>
              <select
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-blacksoft focus:outline-none focus:ring-2 focus:ring-[#ff6c00]/20 focus:border-[#ff6c00] transition-all text-sm"
              >
                <option value="">Sélectionner une ville</option>
                <option value="Dakar">Dakar</option>
                <option value="Thiès">Thiès</option>
                <option value="Saint-Louis">Saint-Louis</option>
                <option value="Kaolack">Kaolack</option>
                <option value="Ziguinchor">Ziguinchor</option>
                <option value="Touba">Touba</option>
                <option value="Mbour">Mbour</option>
                <option value="Rufisque">Rufisque</option>
                <option value="Diourbel">Diourbel</option>
                <option value="Louga">Louga</option>
                <option value="Fatick">Fatick</option>
                <option value="Kaffrine">Kaffrine</option>
                <option value="Tambacounda">Tambacounda</option>
                <option value="Kédougou">Kédougou</option>
                <option value="Sédhiou">Sédhiou</option>
                <option value="Kolda">Kolda</option>
                <option value="Matam">Matam</option>
                <option value="Podor">Podor</option>
                <option value="Bakel">Bakel</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button
              onClick={useManualAddress}
              disabled={!manualAddress.trim() || !manualCity.trim()}
              className="flex-1 bg-[#ff6c00] text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-[#e55a00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Valider l'adresse
            </button>
            {suggestedLocation && (
              <button
                onClick={() => setShowManualInput(false)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Utiliser la position détectée
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LocationPicker;
