import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

// Type pour les appareils POS
export interface POSDevice {
  id: number;
  name: string;
  location: string;
  status: "online" | "offline";
  lastActive: string;
  sales: number;
  isActive?: boolean;  // Ajouté pour le statut d'activation
}

interface POSManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (device: POSDevice) => void;
  editingDevice: POSDevice | null;
  locations: string[];
}

const POSManagementModal = ({ isOpen, onClose, onSave, editingDevice, locations }: POSManagementModalProps) => {
  const [device, setDevice] = useState<POSDevice>({
    id: 0,
    name: '',
    location: '',
    status: 'offline',
    lastActive: '',
    sales: 0,
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialiser le formulaire lorsqu'on édite un appareil existant
  useEffect(() => {
    if (editingDevice) {
      setDevice({
        ...editingDevice,
        isActive: editingDevice.status === 'online'
      });
    } else {
      // Réinitialiser pour un nouvel appareil
      setDevice({
        id: Date.now(), // ID temporaire
        name: '',
        location: locations.length > 0 ? locations[0] : '',
        status: 'offline',
        lastActive: 'Jamais utilisé',
        sales: 0,
        isActive: true
      });
    }
  }, [editingDevice, locations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!device.name.trim()) {
      setError("Veuillez entrer un nom pour le terminal.");
      return;
    }
    
    if (!device.location.trim()) {
      setError("Veuillez sélectionner un emplacement.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Simuler une requête API
    setTimeout(() => {
      onSave({
        ...device,
        status: device.isActive ? 'online' : 'offline'
      });
      setIsLoading(false);
      onClose();
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDevice(prev => ({
      ...prev,
      [name]: name === 'sales' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingDevice ? 'Modifier le terminal POS' : 'Ajouter un terminal POS'}</DialogTitle>
          <DialogDescription>
            {editingDevice 
              ? 'Modifiez les détails du terminal de point de vente.' 
              : 'Configurez un nouveau terminal de point de vente pour votre établissement.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nom</Label>
              <Input
                id="name"
                name="name"
                value={device.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ex: Terminal Bar Principal"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Emplacement</Label>
              {locations.length > 0 ? (
                <Select 
                  value={device.location} 
                  onValueChange={(val) => setDevice(prev => ({ ...prev, location: val }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez un emplacement" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                    <SelectItem value="other">Autre emplacement...</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="location"
                  name="location"
                  value={device.location}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="Ex: Bar, Entrée, VIP..."
                />
              )}
            </div>
            
            {device.location === 'other' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customLocation" className="text-right">Nouvel emplacement</Label>
                <Input
                  id="customLocation"
                  name="location"
                  value={device.location === 'other' ? '' : device.location}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="Entrez un nouvel emplacement"
                />
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">Actif</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="isActive"
                  checked={device.isActive}
                  onCheckedChange={(checked) => setDevice(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {device.isActive ? 'Terminal actif' : 'Terminal inactif'}
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingDevice ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default POSManagementModal;