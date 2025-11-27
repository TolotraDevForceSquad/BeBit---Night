import React, { useState, useEffect } from 'react';
import { useToast } from "../../hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { TerminalSquare, UserCircle, ShieldAlert, LockKeyhole, LogOut, Disc3 } from "lucide-react";
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
  const [showPinPad, setShowPinPad] = useState<boolean>(false);
  const [securityLevel, setSecurityLevel] = useState<"normal" | "high">("normal");
  const [pinDisplay, setPinDisplay] = useState<string>("");

  // Récupérer les infos de l'utilisateur connecté
  const storedUser = localStorage.getItem('auth_user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  // Gérer la saisie du code PIN par le pavé numérique
  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setPinDisplay("•".repeat(newPin.length));
    }
  };
  
  const clearPin = () => {
    setPin("");
    setPinDisplay("");
  };
  
  const handleBackspace = () => {
    if (pin.length > 0) {
      const newPin = pin.slice(0, -1);
      setPin(newPin);
      setPinDisplay("•".repeat(newPin.length));
    }
  };

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
        securityLevel
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
      clearPin();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Rediriger vers la page principale du club
    window.location.href = "/club";
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans overflow-hidden relative">
      {/* Animation de fond néon / gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] rounded-full bg-fuchsia-600 blur-[200px] opacity-40 -top-[400px] -left-[400px] animate-pulse-slow"></div>
        <div className="absolute w-[800px] h-[800px] rounded-full bg-cyan-600 blur-[200px] opacity-40 -bottom-[400px] -right-[400px] animate-pulse-slow animation-delay-500"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full bg-indigo-600 blur-[150px] opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow animation-delay-1000"></div>
      </div>

      {/* En-tête de l'application */}
      <header className="relative z-10 bg-black/50 p-4 border-b border-white/10 backdrop-blur-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 animate-fade-in-up">
            <Disc3 className="h-6 w-6 text-fuchsia-400 animate-spin-slow" />
            <span className="text-xl font-extrabold tracking-widest uppercase text-white drop-shadow-neon">Be bit. POS</span>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/10 transition-all" onClick={handleCancel}>
            <LogOut className="h-5 w-5 mr-1" />
            <span>Quitter</span>
          </Button>
        </div>
      </header>

      {/* Contenu principal de la connexion */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-lg bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-3xl shadow-xl animate-fade-in-down">
          <CardHeader className="space-y-4 text-center p-8 border-b border-white/10">
            <div className="mx-auto w-20 h-20 mb-2 bg-white/10 text-fuchsia-400 rounded-full flex items-center justify-center border-2 border-fuchsia-400/50 shadow-neon-fuchsia">
              <TerminalSquare size={40} className="drop-shadow-neon" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tighter uppercase drop-shadow-neon text-fuchsia-400">
              AUTHENTIFICATION POS
            </CardTitle>
            <CardDescription className="text-gray-300 drop-shadow-text">
              <span>Veuillez vous identifier pour accéder au système de caisse.</span>
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <div className="flex items-center text-fuchsia-400">
                  <TerminalSquare className="mr-2 h-5 w-5" />
                  <Label htmlFor="device" className="font-semibold uppercase tracking-wide">Terminal POS</Label>
                </div>
                <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                  <SelectTrigger id="device" className="border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all">
                    <SelectValue placeholder="Sélectionner un terminal" className="text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20 text-white">
                    {availableDevices.map((device) => (
                      <SelectItem key={device.id} value={device.id.toString()} className="hover:bg-fuchsia-600/20 data-[state=checked]:bg-fuchsia-600/30">
                        {device.name} ({device.location})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-cyan-400">
                  <UserCircle className="mr-2 h-5 w-5" />
                  <Label htmlFor="employeeId" className="font-semibold uppercase tracking-wide">ID Employé</Label>
                </div>
                <Input 
                  id="employeeId"
                  className="border-2 border-white/20 bg-white/5 text-white placeholder:text-gray-500 focus-visible:ring-fuchsia-400 transition-all" 
                  placeholder="Entrez votre ID employé" 
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-fuchsia-400">
                  <LockKeyhole className="mr-2 h-5 w-5" />
                  <Label htmlFor="pin" className="font-semibold uppercase tracking-wide">Code PIN</Label>
                </div>
                
                {showPinPad ? (
                  <div>
                    <div className="bg-white/5 border border-white/20 h-12 flex items-center justify-center mb-2 rounded-lg shadow-inner-neon">
                      <div className="text-3xl font-mono tracking-widest text-fuchsia-400 drop-shadow-neon">{pinDisplay}</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <Button 
                          key={num} 
                          type="button"
                          variant="outline" 
                          className="h-16 text-2xl font-bold bg-white/5 border-white/20 hover:bg-fuchsia-600/20 text-white transition-all shadow-md"
                          onClick={() => handlePinDigit(num.toString())}
                          disabled={isLoading}
                        >
                          {num}
                        </Button>
                      ))}
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-16 text-sm bg-white/5 border-white/20 hover:bg-white/10 text-white transition-all shadow-md"
                        onClick={clearPin}
                        disabled={isLoading}
                      >
                        Effacer
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-16 text-2xl font-bold bg-white/5 border-white/20 hover:bg-fuchsia-600/20 text-white transition-all shadow-md"
                        onClick={() => handlePinDigit("0")}
                        disabled={isLoading}
                      >
                        0
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-16 text-sm bg-white/5 border-white/20 hover:bg-red-600/20 text-white transition-all shadow-md"
                        onClick={handleBackspace}
                        disabled={isLoading}
                      >
                        ←
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <Input 
                      id="pin" 
                      type="password" 
                      className="border-2 border-white/20 bg-white/5 text-white placeholder:text-gray-500 focus-visible:ring-fuchsia-400 transition-all"
                      placeholder="Entrez votre code PIN" 
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      disabled={isLoading}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      minLength={4}
                      maxLength={4}
                    />
                    <Button 
                      type="button"
                      variant="ghost" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs px-2 text-fuchsia-400 hover:bg-fuchsia-400/10 transition-all"
                      onClick={() => setShowPinPad(true)}
                    >
                      Pavé num.
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 border-2 border-yellow-400/30 rounded-lg p-4 bg-yellow-400/10 shadow-inner-neon-yellow">
                <ShieldAlert className="h-6 w-6 text-yellow-400 animate-pulse" />
                <div className="text-sm text-yellow-400 drop-shadow-text-sm">
                  <span className="font-bold">Mode de sécurité:</span> {securityLevel === "high" ? "Élevé" : "Normal"}
                  <Select value={securityLevel} onValueChange={(val: "normal" | "high") => setSecurityLevel(val)}>
                    <SelectTrigger className="h-8 mt-1 text-xs border-yellow-400/30 bg-yellow-400/10 text-white w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-yellow-400/30 text-white">
                      <SelectItem value="normal" className="hover:bg-yellow-600/20 data-[state=checked]:bg-yellow-600/30">Normal (8 heures)</SelectItem>
                      <SelectItem value="high" className="hover:bg-yellow-600/20 data-[state=checked]:bg-yellow-600/30">Élevé (30 minutes)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 p-8 border-t border-white/10">
              <Button 
                className="w-full h-14 text-xl font-bold uppercase tracking-widest bg-fuchsia-600 hover:bg-fuchsia-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-neon-fuchsia-btn" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Vérification en cours..." : "Se connecter au POS"}
              </Button>
              
              <div className="text-center text-xs text-gray-400 mt-4">
                <span>Terminal protégé. Accès réservé au personnel autorisé.</span>
                <p className="mt-1 font-mono">
                  <span className="font-bold text-gray-300">ID techniques:</span> 1234, 2345, 3456, 4567, 5678
                </p>
                <p className="font-mono">
                  <span className="font-bold text-gray-300">PIN de test:</span> 0000, 1234, 2222, 3333, 4444
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default POSLoginPage;