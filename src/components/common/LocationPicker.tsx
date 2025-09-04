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
      <div className="text-center">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLocating}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLocating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Localisation en cours...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Détecter ma position
            </>
          )}
        </button>
      </div>

      {/* Erreur de géolocalisation */}
      {locationError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/30 rounded-lg p-3"
        >
          <p className="text-red-400 text-sm">{locationError}</p>
        </motion.div>
      )}

      {/* Localisation suggérée */}
      {suggestedLocation && !showManualInput && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/30 rounded-lg p-4"
        >
          <h4 className="text-green-400 font-semibold mb-2">📍 Position détectée</h4>
          <div className="space-y-2 mb-3">
            <p className="text-white text-sm">
              <span className="text-gray-400">Adresse :</span> {suggestedLocation.address}
            </p>
            <p className="text-white text-sm">
              <span className="text-gray-400">Ville :</span> {suggestedLocation.city}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={confirmSuggestedLocation}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded text-sm hover:bg-green-700 transition-colors"
            >
              ✅ Confirmer cette adresse
            </button>
            <button
              onClick={editManualAddress}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              ✏️ Modifier l'adresse
            </button>
          </div>
        </motion.div>
      )}

      {/* Saisie manuelle */}
      {showManualInput && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-4"
        >
          <h4 className="text-white font-semibold mb-3">📍 Saisir l'adresse manuellement</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Adresse détaillée *
              </label>
              <input
                type="text"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder="Ex: Rue 12, Zone A, Secteur 3"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Ville *
              </label>
              <select
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
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
          
          <div className="mt-4 flex space-x-2">
            <button
              onClick={useManualAddress}
              disabled={!manualAddress.trim() || !manualCity.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ✅ Valider l'adresse
            </button>
            {suggestedLocation && (
              <button
                onClick={() => setShowManualInput(false)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded text-sm hover:bg-gray-700 transition-colors"
              >
                🔄 Utiliser la position détectée
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <p className="text-blue-400 text-sm">
          💡 <strong>Conseil :</strong> Utilisez la géolocalisation pour une adresse précise, ou saisissez manuellement si vous préférez.
        </p>
      </div>
    </div>
  );
};

export default LocationPicker;
