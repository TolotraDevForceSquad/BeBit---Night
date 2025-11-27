import React, { useState, useEffect } from 'react';
import { useToast } from "../../hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { TerminalSquare, User, LockKeyhole, Clock, Unlock } from "lucide-react";
import { POSDevice } from '../../components/POSManagementModal';

// Informations des employés autorisés avec leurs PIN
interface Employee {
  id: string;
  name: string;
  role: string;
  pin: string;
}

// Données pour les terminaux POS disponibles
const availableDevices: POSDevice[] = [
  { id: 1, name: "POS Principal", location: "Entrée", status: "online", lastActive: "Il y a 5 minutes", sales: 152000 },
  { id: 2, name: "POS Bar", location: "Bar central", status: "online", lastActive: "Il y a 2 minutes", sales: 98500 },
  { id: 3, name: "POS VIP", location: "Lounge VIP", status: "online", lastActive: "Il y a 8 minutes", sales: 235000 },
  { id: 5, name: "Terminal Mobile 2", location: "Mobile", status: "online", lastActive: "Il y a 15 minutes", sales: 67500 },
];

// Base de données locale d'employés (normalement stockée côté serveur)
const authorizedEmployees: Employee[] = [
  { id: "1234", name: "Jean Dupont", role: "Manager", pin: "0000" },
  { id: "2345", name: "Marie Claire", role: "Barman", pin: "1234" },
  { id: "3456", name: "Alexandre Martin", role: "Responsable VIP", pin: "2222" },
  { id: "4567", name: "Sophie Leclerc", role: "Serveur", pin: "3333" },
  { id: "5678", name: "Thomas Petit", role: "Serveur", pin: "4444" },
];

const POSLoginPage = () => {
  const { toast } = useToast();
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionDuration, setSessionDuration] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDevice) {
      toast({
        title: "Terminal requis",
        description: "Veuillez sélectionner un terminal POS.",
        variant: "destructive",
      });
      return;
    }
    
    if (!employeeId) {
      toast({
        title: "ID Employé requis",
        description: "Veuillez entrer votre identifiant employé.",
        variant: "destructive",
      });
      return;
    }
    
    if (!pin || pin.length < 4) {
      toast({
        title: "PIN invalide",
        description: "Veuillez entrer un code PIN valide (4 chiffres).",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Vérification des identifiants (simulée)
    try {
      // Délai pour simuler une authentification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérification des identifiants
      const employee = authorizedEmployees.find(emp => emp.id === employeeId);
      
      if (!employee) {
        throw new Error("Identifiant employé non reconnu");
      }
      
      if (employee.pin !== pin) {
        throw new Error("Code PIN incorrect");
      }
      
      // Authentification réussie
      localStorage.setItem('pos_session', JSON.stringify({
        deviceId: selectedDevice,
        deviceName: availableDevices.find(d => d.id.toString() === selectedDevice)?.name,
        employeeId,
        employeeName: employee.name,
        employeeRole: employee.role,
        timestamp: new Date().toISOString(),
        sessionDuration
      }));
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${employee.name} ! Vous êtes maintenant connecté au terminal POS.`,
        variant: "default",
      });
      
      // Rediriger vers l'interface POS appropriée
      window.location.href = "/club/pos-tables";
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Impossible de se connecter au terminal. Veuillez réessayer.",
        variant: "destructive",
      });
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Rediriger vers la page principale du club
    window.location.href = "/club";
  };

  return (
    // Fond d'écran : Noir total
    <div className="min-h-screen flex items-center justify-center p-4 bg-black"> 
      {/* Conteneur principal : Gris très foncé */}
      <div className="w-full max-w-[1100px] bg-[#1a1a1a] rounded-[15px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[550px]">
          {/* Section Connexion (gauche) : Gris foncé */}
          <div className="order-2 lg:order-none flex-1 flex flex-col justify-start items-center p-5 lg:p-[0_40px_40px] bg-[#1a1a1a] text-center">
            <div className="mb-8 pt-10">
              <div className="text-[2.5em] font-black tracking-[-2px] leading-none">
                {/* Couleurs d'accentuation conservées */}
                <span className="text-[#FE2F58]">Be</span>
                <span className="text-[#26DADF]">Bit</span>
              </div>
            </div>

            <div className="w-full mb-5">
              <h2 className="font-semibold mb-1 text-white text-xl">Authentification Employé</h2>
              {/* Texte secondaire : Gris clair */}
              <p className="text-[#a0a0a0] text-sm">Accédez à votre Terminal pour démarrer votre session.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5 w-full max-w-[300px]">
              {/* Sélection du terminal */}
              <div className="relative">
                {/* Icônes : Gris clair */}
                <TerminalSquare className="absolute top-1/2 -translate-y-1/2 left-4 text-[#a0a0a0] h-5 w-5 pointer-events-none" />
                <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                  {/* Trigger : Fond gris/noir, bordure gris foncé, focus accentué */}
                  <SelectTrigger className="pl-12 pr-8 py-4 border border-[#333333] bg-[#222222] text-white rounded-lg data-[placeholder]:text-[#a0a0a0] focus:border-[#FE2F58] w-full">
                    <SelectValue placeholder="Choisir un terminal POS" />
                  </SelectTrigger>
                  {/* Contenu : Fond gris/noir, bordure gris foncé */}
                  <SelectContent className="bg-[#222222] border-[#333333] text-white">
                    {availableDevices.map((device) => (
                      <SelectItem 
                        key={device.id} 
                        value={device.id.toString()} 
                        // Hover/Focus : Utilisation de l'accentuation rouge/rose
                        className="hover:bg-[#FE2F58]/20 focus:bg-[#FE2F58]/20"
                      >
                        {device.name} ({device.location})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ID Employé */}
              <div className="relative">
                <User className="absolute top-1/2 -translate-y-1/2 left-4 text-[#a0a0a0] h-5 w-5 pointer-events-none" />
                <Input 
                  // Input : Fond gris/noir, bordure gris foncé, focus accentué
                  className="pl-12 py-4 border border-[#333333] bg-[#222222] text-white placeholder:text-[#a0a0a0] rounded-lg focus:border-[#FE2F58] w-full" 
                  placeholder="ID Employé" 
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Code PIN */}
              <div className="relative">
                <LockKeyhole className="absolute top-1/2 -translate-y-1/2 left-4 text-[#a0a0a0] h-5 w-5 pointer-events-none" />
                <Input 
                  type="password" 
                  // Input : Fond gris/noir, bordure gris foncé, focus accentué
                  className="pl-12 py-4 border border-[#333333] bg-[#222222] text-white placeholder:text-[#a0a0a0] rounded-lg focus:border-[#FE2F58] w-full" 
                  placeholder="PIN" 
                  value={pin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setPin(val);
                  }}
                  disabled={isLoading}
                  inputMode="numeric"
                  maxLength={4}
                />
              </div>

              {/* Durée de session */}
              <div className="relative">
                <Clock className="absolute top-1/2 -translate-y-1/2 left-4 text-[#a0a0a0] h-5 w-5 pointer-events-none" />
                <Select value={sessionDuration} onValueChange={setSessionDuration}>
                  {/* Trigger : Fond gris/noir, bordure gris foncé, focus accentué */}
                  <SelectTrigger className="pl-12 pr-8 py-4 border border-[#333333] bg-[#222222] text-white rounded-lg data-[placeholder]:text-[#a0a0a0] focus:border-[#FE2F58] w-full">
                    <SelectValue placeholder="Durée de session maximale" />
                  </SelectTrigger>
                  {/* Contenu : Fond gris/noir, bordure gris foncé */}
                  <SelectContent className="bg-[#222222] border-[#333333] text-white">
                    <SelectItem value="60" className="hover:bg-[#FE2F58]/20 focus:bg-[#FE2F58]/20">1 Heure (Standard)</SelectItem>
                    <SelectItem value="120" className="hover:bg-[#FE2F58]/20 focus:bg-[#FE2F58]/20">2 Heures</SelectItem>
                    <SelectItem value="360" className="hover:bg-[#FE2F58]/20 focus:bg-[#FE2F58]/20">6 Heures (Journée)</SelectItem>
                    <SelectItem value="0" className="hover:bg-[#FE2F58]/20 focus:bg-[#FE2F58]/20">Déconnexion après transaction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                // Bouton : Fond bleu-cyan, texte noir (pour un meilleur contraste sur fond clair), hover rouge/rose
                className="w-full max-w-[300px] py-4 bg-[#26DADF] text-black rounded-lg font-semibold text-base hover:bg-[#FE2F58] hover:text-white transition-all duration-300 mx-auto flex items-center justify-center" 
                type="submit" 
                disabled={isLoading}
              >
                <Unlock className="h-5 w-5 mr-2" />
                {isLoading ? "Vérification..." : "Démarrer la Session"}
              </Button>
            </form>
          </div>

          {/* Section POS (droite) : Gris très foncé (légèrement différent du fond) */}
          <div className="order-1 lg:order-none flex-1 relative flex justify-center items-center text-center p-10 overflow-hidden bg-[#222222] lg:min-h-[550px] h-[220px]">
            {/* Dégradé de fond : Noir total, rouge/rose, bleu-cyan (pas de violet) */}
            <div className="absolute inset-0 opacity-60 bg-gradient-to-br from-black via-[#FE2F58] to-[#26DADF] blur-xl scale-150 animate-pulse" style={{ animationDuration: '15s' }} />
            <div className="relative z-10 flex flex-col items-center justify-center max-w-[400px] text-white">
              <TerminalSquare size={80} className="mb-5 drop-shadow-[0_0_10px_#26DADF]" />
              <h1 className="text-2xl lg:text-3xl font-black mb-4">Connectez-vous à votre Terminal</h1>
              {/* Texte secondaire : Gris clair */}
              <p className="text-sm lg:text-base leading-6 text-[#a0a0a0]">Activez votre session, prenez vos commandes et réalisez vos meilleures performances de la journée.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSLoginPage;