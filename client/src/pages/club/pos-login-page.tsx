import React, { useState, useEffect } from 'react';
import { useToast } from "../../hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { TerminalSquare, LockKeyhole, Coins, ClipboardList, Palmtree } from "lucide-react";
import { POSDevice } from '../../components/POSManagementModal';
import ResponsiveLayout from '../../layouts/ResponsiveLayout';
import { Link } from 'wouter';

// Données pour les terminaux POS disponibles
const availableDevices: POSDevice[] = [
  { id: 1, name: "POS Principal", location: "Entrée", status: "online", lastActive: "Il y a 5 minutes", sales: 152000 },
  { id: 2, name: "POS Bar", location: "Bar central", status: "online", lastActive: "Il y a 2 minutes", sales: 98500 },
  { id: 3, name: "POS VIP", location: "Lounge VIP", status: "online", lastActive: "Il y a 8 minutes", sales: 235000 },
  { id: 5, name: "Terminal Mobile 2", location: "Mobile", status: "online", lastActive: "Il y a 15 minutes", sales: 67500 },
];

const POSLoginPage = () => {
  const { toast } = useToast();
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Récupérer les infos de l'utilisateur connecté
  const storedUser = localStorage.getItem('auth_user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Pré-remplir l'ID employé si disponible
  useEffect(() => {
    if (user && user.id) {
      setEmployeeId(user.id.toString());
    }
  }, [user]);

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
        description: "Veuillez entrer un code PIN valide (minimum 4 chiffres).",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simuler une vérification d'authentification
    try {
      // Pour cet exemple, nous acceptons toujours la connexion après un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stocker l'info de connexion POS
      localStorage.setItem('pos_session', JSON.stringify({
        deviceId: selectedDevice,
        deviceName: availableDevices.find(d => d.id.toString() === selectedDevice)?.name,
        employeeId,
        timestamp: new Date().toISOString(),
      }));
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté au terminal POS.",
        variant: "default",
      });
      
      // Rediriger vers l'interface POS appropriée
      window.location.href = "/club/pos-tables";
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter au terminal. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResponsiveLayout>
      <div className="h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
        <Card className="w-full max-w-md shadow-lg border-2">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 mb-2 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <TerminalSquare size={32} />
            </div>
            <CardTitle className="text-2xl font-bold">Connexion au POS</CardTitle>
            <CardDescription>
              Connectez-vous à un terminal POS pour commencer
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="device">Terminal POS</Label>
                <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                  <SelectTrigger id="device">
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
                <Label htmlFor="employeeId">ID Employé</Label>
                <Input 
                  id="employeeId" 
                  placeholder="Entrez votre ID employé" 
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pin">Code PIN</Label>
                </div>
                <div className="relative">
                  <Input 
                    id="pin" 
                    type="password" 
                    placeholder="Entrez votre code PIN" 
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    disabled={isLoading}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    minLength={4}
                    maxLength={6}
                  />
                  <LockKeyhole className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter au terminal"}
              </Button>
              
              <div className="grid grid-cols-3 gap-2 w-full mt-4">
                <Link href="/club/pos" className="w-full">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1 px-0">
                    <TerminalSquare size={18} />
                    <span className="text-xs">Gestion POS</span>
                  </Button>
                </Link>
                
                <Link href="/club/pos-catalog" className="w-full">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1 px-0">
                    <ClipboardList size={18} />
                    <span className="text-xs">Catalogue</span>
                  </Button>
                </Link>
                
                <Link href="/club/pos-tables" className="w-full">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1 px-0">
                    <Palmtree size={18} />
                    <span className="text-xs">Tables</span>
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default POSLoginPage;