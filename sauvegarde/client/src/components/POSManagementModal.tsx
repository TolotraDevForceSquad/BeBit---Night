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

// Types pour les appareils POS et employés
export interface POSDevice {
  id: number;
  name: string;
  location: string;
  status: "active" | "inactive";
  lastActive?: string;
  sales: number;
  isActive?: boolean;
}

export interface Employee {
  id: number; // Changé de string à number pour correspondre à POSDevice
  name: string;
  pin: string;
  role: string;
  isActive?: boolean;
}

type ModalMode = 'device' | 'employee';

interface POSManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: POSDevice | Employee) => void;
  editingDevice: POSDevice | null;
  editingEmployee: Employee | null;
  locations: string[];
  mode: ModalMode;
}

const POSManagementModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingDevice, 
  editingEmployee, 
  locations, 
  mode 
}: POSManagementModalProps) => {
  const [device, setDevice] = useState<POSDevice>({
    id: 0,
    name: '',
    location: '',
    status: 'inactive',
    lastActive: '',
    sales: 0,
    isActive: true
  });

  const [employee, setEmployee] = useState<Employee>({
    id: 0, // Changé de string vide à 0
    name: '',
    pin: '',
    role: 'staff',
    isActive: true
  });

  const [customLocation, setCustomLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rôles disponibles pour les employés
  const employeeRoles = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' },
    { value: 'cashier', label: 'Caissier' }
  ];

  // Initialiser le formulaire selon le mode
  useEffect(() => {
    if (mode === 'device' && editingDevice) {
      setDevice({
        ...editingDevice,
        isActive: editingDevice.status === 'active'
      });
      setCustomLocation('');
    } else if (mode === 'employee' && editingEmployee) {
      setEmployee({
        ...editingEmployee,
        isActive: true // Par défaut actif pour les employés
      });
    } else {
      // Réinitialiser selon le mode
      if (mode === 'device') {
        setDevice({
          id: 0,
          name: '',
          location: locations.length > 0 ? locations[0] : '',
          status: 'inactive',
          lastActive: 'Jamais utilisé',
          sales: 0,
          isActive: true
        });
      } else {
        setEmployee({
          id: 0, // Changé de string vide à 0
          name: '',
          pin: '',
          role: 'staff',
          isActive: true
        });
      }
      setCustomLocation('');
    }
    setError(null); // Réinitialiser les erreurs à l'ouverture
  }, [editingDevice, editingEmployee, locations, mode, isOpen]); // Ajout de isOpen comme dépendance

  const handleDeviceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDevice(prev => ({
      ...prev,
      [name]: name === 'sales' ? parseFloat(value) || 0 : value
    }));
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'device') {
        // Validation pour les appareils
        if (!device.name.trim()) {
          setError("Veuillez entrer un nom pour le terminal.");
          setIsLoading(false);
          return;
        }
        
        const finalLocation = device.location === 'other' ? customLocation : device.location;
        
        if (!finalLocation.trim()) {
          setError("Veuillez sélectionner ou saisir un emplacement.");
          setIsLoading(false);
          return;
        }
        
        await onSave({
          ...device,
          location: finalLocation,
          status: device.isActive ? 'active' : 'inactive'
        });
        
      } else {
        // Validation pour les employés
        if (!employee.name.trim()) {
          setError("Veuillez entrer un nom pour l'employé.");
          setIsLoading(false);
          return;
        }
        
        if (!employee.pin.trim() || employee.pin.length < 4) {
          setError("Le PIN doit contenir au moins 4 chiffres.");
          setIsLoading(false);
          return;
        }
        
        if (!/^\d+$/.test(employee.pin)) {
          setError("Le PIN ne doit contenir que des chiffres.");
          setIsLoading(false);
          return;
        }
        
        await onSave(employee);
      }
      
      // Fermer le modal après sauvegarde réussie
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError("Une erreur s'est produite lors de la sauvegarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === 'device') {
      return editingDevice ? 'Modifier le terminal POS' : 'Ajouter un terminal POS';
    } else {
      return editingEmployee ? "Modifier l'employé" : "Ajouter un employé";
    }
  };

  const getDescription = () => {
    if (mode === 'device') {
      return editingDevice 
        ? 'Modifiez les détails du terminal de point de vente.' 
        : 'Configurez un nouveau terminal de point de vente pour votre établissement.';
    } else {
      return editingEmployee
        ? "Modifiez les informations de l'employé."
        : "Ajoutez un nouvel employé avec accès au système POS.";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-4 py-4">
            {mode === 'device' ? (
              // Formulaire pour les appareils POS
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nom</Label>
                  <Input
                    id="name"
                    name="name"
                    value={device.name}
                    onChange={handleDeviceChange}
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
                      onChange={handleDeviceChange}
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
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
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
              </>
            ) : (
              // Formulaire pour les employés
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employeeName" className="text-right">Nom</Label>
                  <Input
                    id="employeeName"
                    name="name"
                    value={employee.name}
                    onChange={handleEmployeeChange}
                    className="col-span-3"
                    placeholder="Ex: Jean Dupont"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pin" className="text-right">PIN</Label>
                  <Input
                    id="pin"
                    name="pin"
                    type="password"
                    value={employee.pin}
                    onChange={handleEmployeeChange}
                    className="col-span-3"
                    placeholder="4 chiffres minimum"
                    maxLength={6}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">Rôle</Label>
                  <Select 
                    value={employee.role} 
                    onValueChange={(val) => setEmployee(prev => ({ ...prev, role: val }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionnez un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {employeeRoles.map(role => (
                        <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'device' 
                ? (editingDevice ? 'Mettre à jour' : 'Ajouter')
                : (editingEmployee ? 'Mettre à jour' : 'Ajouter')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default POSManagementModal;