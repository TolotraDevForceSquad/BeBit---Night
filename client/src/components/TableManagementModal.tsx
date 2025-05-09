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
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

// Type pour les tables
export interface POSTable {
  id: number;
  name: string;
  number?: number;
  area: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrderId?: number;
}

// Type pour les zones/sections
const tableAreas = [
  'Terrasse', 
  'Intérieur', 
  'VIP', 
  'Bar',
  'Lounge',
  'Piste de danse'
];

interface TableManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (table: POSTable) => void;
  editingTable: POSTable | null;
}

const TableManagementModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingTable 
}: TableManagementModalProps) => {
  const [table, setTable] = useState<POSTable>({
    id: 0,
    name: '',
    number: undefined,
    area: tableAreas[0],
    capacity: 4,
    status: 'available',
    currentOrderId: undefined
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialiser le formulaire lorsqu'on édite une table existante
  useEffect(() => {
    if (editingTable) {
      setTable({
        ...editingTable
      });
    } else {
      // Réinitialiser pour une nouvelle table
      setTable({
        id: Date.now(),
        name: '',
        number: undefined,
        area: tableAreas[0],
        capacity: 4,
        status: 'available',
        currentOrderId: undefined
      });
    }
  }, [editingTable]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!table.name.trim() && !table.number) {
      setError("Veuillez entrer un nom ou un numéro pour la table.");
      return;
    }
    
    // Si le nom n'est pas rempli mais qu'il y a un numéro, générer un nom par défaut
    if (!table.name.trim() && table.number) {
      table.name = `Table ${table.number}`;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Simuler une requête API
    setTimeout(() => {
      onSave(table);
      setIsLoading(false);
      onClose();
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTable(prev => ({
      ...prev,
      [name]: name === 'number' || name === 'capacity' ? parseInt(value) || undefined : value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingTable ? 'Modifier la table' : 'Ajouter une table'}</DialogTitle>
          <DialogDescription>
            {editingTable 
              ? 'Modifiez les détails de la table.' 
              : 'Créez une nouvelle table dans votre établissement.'}
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
                value={table.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ex: VIP Gold, Table Fenêtre, etc."
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">Numéro</Label>
              <Input
                id="number"
                name="number"
                type="number"
                value={table.number || ''}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ex: 1, 2, 3, etc."
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="area" className="text-right">Zone</Label>
              <Select 
                value={table.area} 
                onValueChange={(val) => setTable(prev => ({ ...prev, area: val }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez une zone" />
                </SelectTrigger>
                <SelectContent>
                  {tableAreas.map(area => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">Capacité</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={table.capacity}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ex: 4, 6, 8, etc."
                min="1"
              />
            </div>
            
            {editingTable && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Statut</Label>
                <Select 
                  value={table.status} 
                  onValueChange={(val) => setTable(prev => ({ 
                    ...prev, 
                    status: val as 'available' | 'occupied' | 'reserved'
                  }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="occupied">Occupée</SelectItem>
                    <SelectItem value="reserved">Réservée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingTable ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TableManagementModal;