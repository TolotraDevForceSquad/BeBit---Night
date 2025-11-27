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

export type POSDevice = {
  id?: number;
  name: string;
  location: string;
  status: boolean;
  lastActive: string | null;
  sales: number;
};

export type Employee = {
  id?: number;
  name: string;
  role: string;
  pin: string;
  deviceId?: number | null;
  status: boolean;
};

type ModalType = 'device' | 'employee';

const POSManagementModal = ({
  isOpen,
  onClose,
  onSave,
  editingDevice,
  editingEmployee,
  locations,
  devices,
  modalType = 'device'
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: POSDevice | Employee) => void;
  editingDevice?: POSDevice | null;
  editingEmployee?: Employee | null;
  locations: string[];
  devices: POSDevice[];
  modalType?: ModalType;
}) => {
  const [device, setDevice] = useState<POSDevice>({
    name: "",
    location: "",
    status: true,
    lastActive: new Date().toISOString(),
    sales: 0,
  });

  const [employee, setEmployee] = useState<Employee>({
    name: "",
    role: "",
    pin: "",
    deviceId: null,
    status: true,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState("");

  useEffect(() => {
    if (modalType === 'device' && editingDevice) {
      setDevice({
        id: editingDevice.id,
        name: editingDevice.name,
        location: editingDevice.location,
        status: editingDevice.status,
        lastActive: editingDevice.lastActive,
        sales: editingDevice.sales,
      });
      setIsCustomLocation(!locations.includes(editingDevice.location));
      setCustomLocation(editingDevice.location);
    } else if (modalType === 'employee' && editingEmployee) {
      setEmployee({
        id: editingEmployee.id,
        name: editingEmployee.name,
        role: editingEmployee.role,
        pin: editingEmployee.pin || "",
        deviceId: editingEmployee.deviceId,
        status: editingEmployee.status,
      });
    } else {
      setDevice({
        name: "",
        location: "",
        status: true,
        lastActive: new Date().toISOString(),
        sales: 0,
      });
      setEmployee({
        name: "",
        role: "",
        pin: "",
        deviceId: null,
        status: true,
      });
      setIsCustomLocation(false);
      setCustomLocation("");
    }
  }, [editingDevice, editingEmployee, isOpen, locations, modalType]);

  const handleDeviceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDevice({ ...device, [e.target.name]: e.target.value });
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleCustomLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomLocation(e.target.value);
    setDevice({ ...device, location: e.target.value });
  };

  const handleLocationChange = (value: string) => {
    if (value === "other") {
      setIsCustomLocation(true);
      setDevice({ ...device, location: "" });
      setCustomLocation("");
    } else {
      setIsCustomLocation(false);
      setDevice({ ...device, location: value });
    }
  };

  const handleDeviceSelectChange = (value: string) => {
    setEmployee({ ...employee, deviceId: value === "none" ? null : Number(value) });
  };

  const validatePin = (pin: string) => {
    // Le PIN doit être de 4 chiffres
    return /^\d{4}$/.test(pin);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (modalType === 'device') {
      if (!device.name || !device.location) {
        setError("Nom et emplacement sont requis");
        setIsLoading(false);
        return;
      }
      onSave(device);
    } else {
      if (!employee.name || !employee.role || !employee.pin) {
        setError("Nom, rôle et PIN sont requis");
        setIsLoading(false);
        return;
      }

      if (!validatePin(employee.pin)) {
        setError("Le PIN doit être composé de 4 chiffres");
        setIsLoading(false);
        return;
      }
      onSave(employee);
    }
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {modalType === 'device' 
              ? (editingDevice ? 'Modifier le terminal POS' : 'Ajouter un terminal POS')
              : (editingEmployee ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur')}
          </DialogTitle>
          <DialogDescription>
            {modalType === 'device'
              ? (editingDevice 
                  ? 'Modifiez les détails du terminal de point de vente.' 
                  : 'Configurez un nouveau terminal de point de vente pour votre établissement.')
              : (editingEmployee
                  ? 'Modifiez les détails de l\'utilisateur POS.'
                  : 'Ajoutez un nouvel utilisateur pour gérer les terminaux POS.')}
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
            {modalType === 'device' ? (
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
                      value={isCustomLocation ? "other" : device.location} 
                      onValueChange={handleLocationChange}
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
                
                {isCustomLocation && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customLocation" className="text-right">Nouvel emplacement</Label>
                    <Input
                      id="customLocation"
                      name="customLocation"
                      value={customLocation}
                      onChange={handleCustomLocationChange}
                      className="col-span-3"
                      placeholder="Entrez un nouvel emplacement"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Actif</Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="status"
                      checked={device.status}
                      onCheckedChange={(checked) => setDevice(prev => ({ 
                        ...prev, 
                        status: checked 
                      }))}
                    />
                    <Label htmlFor="status" className="cursor-pointer">
                      {device.status ? 'Terminal actif' : 'Terminal inactif'}
                    </Label>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nom complet</Label>
                  <Input
                    id="name"
                    name="name"
                    value={employee.name}
                    onChange={handleEmployeeChange}
                    className="col-span-3"
                    placeholder="Ex: Jean Dupont"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">Rôle</Label>
                  <Select 
                    value={employee.role} 
                    onValueChange={(value) => setEmployee(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionnez un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Barman">Barman</SelectItem>
                      <SelectItem value="Serveur">Serveur</SelectItem>
                      <SelectItem value="Responsable VIP">Responsable VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pin" className="text-right">Code PIN</Label>
                  <Input
                    id="pin"
                    name="pin"
                    type="text"
                    value={employee.pin}
                    onChange={handleEmployeeChange}
                    className="col-span-3"
                    placeholder="Ex: 1234"
                    maxLength={4}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deviceId" className="text-right">Terminal assigné</Label>
                  <Select 
                    value={employee.deviceId?.toString() || "none"} 
                    onValueChange={handleDeviceSelectChange}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionnez un terminal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      {devices.map(device => (
                        <SelectItem key={device.id} value={device.id!.toString()}>
                          {device.name} ({device.location})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Statut</Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="status"
                      checked={employee.status}
                      onCheckedChange={(checked) => setEmployee(prev => ({ 
                        ...prev, 
                        status: checked 
                      }))}
                    />
                    <Label htmlFor="status" className="cursor-pointer">
                      {employee.status ? 'Utilisateur actif' : 'Utilisateur inactif'}
                    </Label>
                  </div>
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
              {modalType === 'device' 
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