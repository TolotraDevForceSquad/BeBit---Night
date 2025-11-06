import React, { useState } from 'react';

// Types pour TypeScript
interface Employee {
  id: number;
  name: string;
  role: string;
  pin: string;
  device_id: number | null;
  status: boolean;
}

interface Device {
  id: number;
  name: string;
  location: string;
  status: boolean;
  last_active: string | null;
  sales: number;
}

// Données fictives fournies
const employees: Employee[] = [
  {"id":3,"name":"Alexandre Martin","role":"Responsable VIP","pin":"3333","device_id":3,"status":true},
  {"id":9,"name":"Anja","role":"Responsable VIP","pin":"1234","device_id":1,"status":false},
  {"id":1,"name":"Jean Dupont","role":"Manager","pin":"1111","device_id":1,"status":true},
  {"id":6,"name":"Kakana","role":"Manager","pin":"1234","device_id":null,"status":true},
  {"id":2,"name":"Marie Claire","role":"Barman","pin":"2222","device_id":2,"status":false},
  {"id":8,"name":"Rina","role":"Barman","pin":"1234","device_id":null,"status":true},
  {"id":7,"name":"Rina","role":"Manager","pin":"1234","device_id":1,"status":true},
  {"id":4,"name":"Sophie Leclerc","role":"Serveur","pin":"4444","device_id":4,"status":false},
  {"id":5,"name":"Thomas Petit","role":"Serveur","pin":"5555","device_id":5,"status":true}
];

const devices: Device[] = [
  {"id":1,"name":"POS Principal (Reception)","location":"Entree","status":true,"last_active":"2025-09-22T05:55:00.000Z","sales":152000},
  {"id":2,"name":"POS Bar","location":"Bar central","status":false,"last_active":"2025-09-22T05:58:00.000Z","sales":98500},
  {"id":3,"name":"POS VIP","location":"Lounge VIP","status":true,"last_active":"2025-09-22T05:50:00.000Z","sales":235000},
  {"id":4,"name":"Terminal Mobile 1","location":"Mobile","status":false,"last_active":"2025-09-22T03:30:00.000Z","sales":42000},
  {"id":5,"name":"Terminal Mobile 2","location":"Mobile","status":true,"last_active":"2025-09-22T05:45:00.000Z","sales":67500},
  {"id":8,"name":"Terminal Mobile 3","location":"Mobile Terrasse","status":true,"last_active":null,"sales":0},
  {"id":9,"name":"Terminal Mobile 4","location":"Mobile Terrasse","status":true,"last_active":"2025-09-23T17:45:36.187Z","sales":0}
];

const POSLoginPage: React.FC = () => {
  // États pour le formulaire
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [employeeId, setEmployeeId] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [securityLevel, setSecurityLevel] = useState<'normal' | 'high'>('normal');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showTestInfo, setShowTestInfo] = useState<boolean>(false);

  // Fonction de validation et connexion
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeviceId || !employeeId || !pin) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    if (pin.length !== 4) {
      setError('Le PIN doit comporter 4 chiffres.');
      return;
    }

    const emp = employees.find(e => e.id.toString() === employeeId && e.pin === pin && e.status);
    if (!emp) {
      setError('ID employé ou PIN incorrect.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulation de vérification (en vrai, appel API)
    setTimeout(() => {
      // Créer session locale (ex. localStorage)
      localStorage.setItem('posSession', JSON.stringify({
        deviceId: selectedDeviceId,
        employeeId: emp.id,
        employeeName: emp.name,
        role: emp.role,
        securityLevel,
        timestamp: new Date().toISOString()
      }));
      setLoading(false);
      // Redirection simulée (en vrai, useNavigate de react-router)
      alert(`Connexion réussie ! Redirection vers l\'interface POS pour ${emp.name} sur ${devices.find(d => d.id === selectedDeviceId)?.name}.`);
      // window.location.href = '/pos-interface'; // Exemple
    }, 1500);
  };

  // Composant pavé numérique optionnel (caché par défaut sur web)
  const NumericKeypad: React.FC<{ onChange: (value: string) => void; show: boolean }> = ({ onChange, show }) => {
    if (!show) return null;
    const keys = [1,2,3,4,5,6,7,8,9,0];
    const handleKey = (key: number) => {
      if (pin.length < 4) {
        setPin(prev => prev + key.toString());
        onChange(prev => prev + key.toString());
      }
    };

    return (
      <div className="grid grid-cols-3 gap-2 mt-2">
        {keys.map(key => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded neon-effect"
            type="button"
          >
            {key}
          </button>
        ))}
        <button
          onClick={() => setPin('')}
          className="bg-red-600 hover:bg-red-500 text-white p-4 rounded neon-effect col-span-3"
          type="button"
        >
          Effacer
        </button>
      </div>
    );
  };

  const [showKeypad, setShowKeypad] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-cyan-400">Be bit. POS</h1>
        <button
          onClick={() => window.location.href = '/accueil'} // Simulation retour
          className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded neon-effect text-lg"
        >
          Quitter
        </button>
      </header>

      {/* Corps principal - Plus large pour web */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-gray-800 rounded-lg shadow-xl p-10 w-full max-w-lg neon-border">
          <h2 className="text-2xl font-semibold mb-8 text-center text-cyan-400">Connexion POS</h2>
          
          <form onSubmit={handleLogin}>
            {/* Sélecteur de terminal */}
            <div className="mb-6">
              <label className="block text-base font-medium mb-3">Terminal POS</label>
              <select
                value={selectedDeviceId || ''}
                onChange={(e) => setSelectedDeviceId(parseInt(e.target.value) || null)}
                className="w-full p-3 bg-gray-700 border border-cyan-500 rounded text-white text-base"
                required
              >
                <option value="">Choisir un terminal</option>
                {devices.map(device => (
                  <option key={device.id} value={device.id} disabled={!device.status}>
                    {device.name} ({device.location}) {device.status ? '🟢' : '🔴'}
                  </option>
                ))}
              </select>
            </div>

            {/* ID Employé */}
            <div className="mb-6">
              <label className="block text-base font-medium mb-3">ID Employé</label>
              <input
                type="number"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-cyan-500 rounded text-white text-base"
                placeholder="Entrez votre ID"
                required
              />
            </div>

            {/* PIN */}
            <div className="mb-6">
              <label className="block text-base font-medium mb-3">PIN (4 chiffres)</label>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    if (e.target.value.length <= 4 && /^\d*$/.test(e.target.value)) {
                      setPin(e.target.value);
                    }
                  }}
                  className="w-full p-3 bg-gray-700 border border-cyan-500 rounded text-white text-base mb-3"
                  placeholder="****"
                  maxLength={4}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKeypad(!showKeypad)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 text-sm hover:text-cyan-300"
                >
                  {showKeypad ? 'Masquer pavé' : 'Pavé num.'}
                </button>
              </div>
              {/* Pavé numérique optionnel */}
              <NumericKeypad onChange={setPin} show={showKeypad} />
            </div>

            {/* Niveau de sécurité */}
            <div className="mb-8">
              <label className="block text-base font-medium mb-3">Niveau de sécurité</label>
              <select
                value={securityLevel}
                onChange={(e) => setSecurityLevel(e.target.value as 'normal' | 'high')}
                className="w-full p-3 bg-gray-700 border border-cyan-500 rounded text-white text-base"
              >
                <option value="normal">Session normale (longue durée)</option>
                <option value="high">Sécurité élevée (courte durée)</option>
              </select>
            </div>

            {/* Erreur */}
            {error && <p className="text-red-400 text-base mb-6 text-center">{error}</p>}

            {/* Bouton Se connecter */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 p-4 rounded font-semibold neon-effect text-lg"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Infos de test (toggle pour affichage) */}
          <button
            onClick={() => setShowTestInfo(!showTestInfo)}
            className="w-full mt-6 text-sm text-gray-400 underline hover:text-gray-300"
            type="button"
          >
            {showTestInfo ? 'Masquer' : 'IDs et PIN de test'}
          </button>
          {showTestInfo && (
            <div className="mt-3 text-sm text-gray-400 p-3 bg-gray-700 rounded">
              <p>Exemples : Jean Dupont (ID:1, PIN:1111), Marie Claire (ID:2, PIN:2222)</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 p-6 text-center text-base text-gray-400">
        <p>Accès réservé au personnel autorisé</p>
      </footer>

      {/* Styles CSS inline pour effets néon (simplifié) */}
      <style jsx>{`
        .neon-effect {
          box-shadow: 0 0 5px #0ea5e9, inset 0 0 5px #0ea5e9;
          transition: box-shadow 0.3s;
        }
        .neon-effect:hover {
          box-shadow: 0 0 15px #0ea5e9, inset 0 0 15px #0ea5e9;
        }
        .neon-border {
          border: 1px solid #0ea5e9;
          box-shadow: 0 0 10px #0ea5e9;
        }
      `}</style>
    </div>
  );
};

export default POSLoginPage;