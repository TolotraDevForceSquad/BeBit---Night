import React, { useState, useEffect } from 'react';
import { useToast } from "../../hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { TerminalSquare, UserCircle, ShieldAlert, LockKeyhole, LogOut } from "lucide-react";
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-900 to-slate-900">
      {/* En-tête POS */}
      <header className="bg-black/50 p-4 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <TerminalSquare className="h-6 w-6 text-white" />
            <span className="text-lg font-bold text-white">Be bit. POS</span>
          </div>
          <Button variant="ghost" className="text-white" onClick={handleCancel}>
            <LogOut className="h-5 w-5 mr-1" />
            <span>Quitter</span>
          </Button>
        </div>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="space-y-1 text-center bg-black text-white rounded-t-lg">
            <div className="mx-auto w-16 h-16 mb-2 bg-white/10 text-white rounded-full flex items-center justify-center">
              <TerminalSquare size={32} />
            </div>
            <CardTitle className="text-2xl font-bold tracking-wider">AUTHENTIFICATION POS</CardTitle>
            <CardDescription className="text-gray-300">
              Veuillez vous identifier pour accéder au système de caisse
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 p-6 bg-white dark:bg-gray-950">
              <div className="space-y-2">
                <div className="flex items-center">
                  <TerminalSquare className="mr-2 h-5 w-5 text-primary" />
                  <Label htmlFor="device" className="font-medium">Terminal POS</Label>
                </div>
                <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                  <SelectTrigger id="device" className="border-2">
                    <SelectValue placeholder="Sélectionner un terminal" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDevices.map((device) => (
                      <SelectItem key={device.id} value={device.id.toString()}>
                        {device.name} ({device.location})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <UserCircle className="mr-2 h-5 w-5 text-primary" />
                  <Label htmlFor="employeeId" className="font-medium">ID Employé</Label>
                </div>
                <Input 
                  id="employeeId"
                  className="border-2" 
                  placeholder="Entrez votre ID employé" 
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <LockKeyhole className="mr-2 h-5 w-5 text-primary" />
                  <Label htmlFor="pin" className="font-medium">Code PIN</Label>
                </div>
                
                {showPinPad ? (
                  <div>
                    <div className="bg-gray-100 dark:bg-gray-800 h-12 flex items-center justify-center mb-2 border rounded-md">
                      <div className="text-2xl font-mono tracking-widest">{pinDisplay}</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <Button 
                          key={num} 
                          type="button"
                          variant="outline" 
                          className="h-14 text-xl font-semibold"
                          onClick={() => handlePinDigit(num.toString())}
                          disabled={isLoading}
                        >
                          {num}
                        </Button>
                      ))}
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-14 text-sm"
                        onClick={clearPin}
                        disabled={isLoading}
                      >
                        Effacer
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-14 text-xl font-semibold"
                        onClick={() => handlePinDigit("0")}
                        disabled={isLoading}
                      >
                        0
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-14 text-sm"
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
                      className="border-2"
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
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs px-2"
                      onClick={() => setShowPinPad(true)}
                    >
                      Pavé num.
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-2 bg-yellow-50 dark:bg-yellow-900/20">
                <ShieldAlert className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                <div className="text-sm text-yellow-600 dark:text-yellow-500">
                  <span className="font-medium">Mode de sécurité:</span> {securityLevel === "high" ? "Élevé" : "Normal"}
                  <Select value={securityLevel} onValueChange={(val: "normal" | "high") => setSecurityLevel(val)}>
                    <SelectTrigger className="h-7 mt-1 text-xs border-yellow-200 dark:border-yellow-700 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal (8 heures)</SelectItem>
                      <SelectItem value="high">Élevé (30 minutes)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 bg-gray-100 dark:bg-gray-900 p-6 rounded-b-lg">
              <Button 
                className="w-full h-12 text-lg font-semibold" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Vérification en cours..." : "Se connecter au POS"}
              </Button>
              
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Terminal protégé. Accès réservé au personnel autorisé.</p>
                <p className="mt-1">
                  <span className="font-medium">ID techniques:</span> 1234, 2345, 3456, 4567, 5678
                </p>
                <p>
                  <span className="font-medium">PIN de test:</span> 0000, 1234, 2222, 3333, 4444
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