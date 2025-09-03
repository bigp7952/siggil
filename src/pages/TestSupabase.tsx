import React, { useState } from 'react';
import { testSupabaseConnection, testUserRegistration } from '../utils/testSupabase.ts';

const TestSupabase: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
  });

  const handleConnectionTest = async () => {
    setIsLoading(true);
    setTestResult('🔍 Test en cours...');
    
    try {
      const result = await testSupabaseConnection();
      setTestResult(result ? '✅ Test de connexion réussi !' : '❌ Test de connexion échoué. Vérifiez la console.');
    } catch (error) {
      setTestResult(`❌ Erreur: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTestResult('🔍 Test d\'inscription en cours...');
    
    try {
      const result = await testUserRegistration(formData);
      setTestResult(
        result.success 
          ? `✅ Inscription réussie ! ID: ${result.data?.id}` 
          : `❌ Échec de l'inscription: ${result.error}`
      );
    } catch (error) {
      setTestResult(`❌ Erreur: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-red-500">🔧 Test Supabase</h1>
        
        {/* Test de Connexion */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Test de Connexion</h2>
          <button
            onClick={handleConnectionTest}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
          >
            {isLoading ? 'Test en cours...' : 'Tester la Connexion'}
          </button>
          <div className="mt-4 p-3 bg-gray-800 rounded">
            <pre className="text-sm">{testResult}</pre>
          </div>
        </div>

        {/* Test d'Inscription */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test d'Inscription</h2>
          <form onSubmit={handleRegistrationTest} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Prénom</label>
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Numéro de téléphone</label>
              <input
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                placeholder="+221 77 123 45 67"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Adresse</label>
              <input
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50"
            >
              {isLoading ? 'Test en cours...' : 'Tester l\'Inscription'}
            </button>
          </form>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-yellow-900/20 border border-yellow-500/20 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">📋 Instructions</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Ouvrez les outils de développement (F12)</li>
            <li>Allez dans l'onglet "Console"</li>
            <li>Cliquez sur "Tester la Connexion"</li>
            <li>Vérifiez les messages dans la console</li>
            <li>Si la connexion échoue, vérifiez votre configuration Supabase</li>
            <li>Testez ensuite l'inscription avec des données valides</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestSupabase;


