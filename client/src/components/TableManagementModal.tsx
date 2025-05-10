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
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// Type pour les tables
export interface POSTable {
  id: number;
  name: string;
  number?: number;
  area: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrderId?: number;
  reservationInfo?: {
    userId: number;
    userName: string;
    reservationTime: string;
    partySize: number;
    notes?: string;
  };
}

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
    area: 'Intérieur',
    capacity: 2,
    status: 'available'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const areaOptions = [
    'Intérieur',
    'Terrasse',
    'VIP',
    'Bar'
  ];

  // Initialiser le formulaire lorsqu'on édite une table existante
  useEffect(() => {
    if (editingTable) {
      setTable(editingTable);
    } else {
      // Réinitialiser pour une nouvelle table
      setTable({
        id: Date.now(),
        name: '',
        number: undefined,
        area: 'Intérieur',
        capacity: 2,
        status: 'available'
      });
    }
  }, [editingTable]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!table.name.trim()) {
      setError('Le nom de la table est requis.');
      return;
    }
    
    if (table.capacity <= 0) {
      setError('La capacité doit être supérieure à zéro.');
      return;
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'capacity') {
      setTable(prev => ({
        ...prev,
        capacity: value ? parseInt(value) : 0
      }));
    } else if (name === 'number') {
      setTable(prev => ({
        ...prev,
        number: value ? parseInt(value) : undefined
      }));
    } else {
      setTable(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAreaChange = (value: string) => {
    setTable(prev => ({
      ...prev,
      area: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingTable ? 'Modifier la table' : 'Ajouter une table'}
          </DialogTitle>
          <DialogDescription>
            {editingTable
              ? 'Modifiez les détails de la table.'
              : 'Ajoutez une nouvelle table à votre établissement.'}
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
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                name="name"
                value={table.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ex: Table centrale, Comptoir, etc."
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Numéro
              </Label>
              <Input
                id="number"
                name="number"
                type="number"
                value={table.number === undefined ? '' : table.number}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Optionnel"
                min="1"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="area" className="text-right">
                Zone
              </Label>
              <Select
                value={table.area}
                onValueChange={handleAreaChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez une zone" />
                </SelectTrigger>
                <SelectContent>
                  {areaOptions.map(area => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacité
              </Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={table.capacity}
                onChange={handleChange}
                className="col-span-3"
                min="1"
                max="20"
                placeholder="Nombre de places"
              />
            </div>
            
            {editingTable && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right text-sm text-muted-foreground">
                    Statut
                  </div>
                  <div className="col-span-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      table.status === 'available' ? 'bg-green-100 text-green-800' :
                      table.status === 'reserved' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {table.status === 'available' ? 'Disponible' :
                       table.status === 'reserved' ? 'Réservée' :
                       'Occupée'}
                    </span>
                    {table.currentOrderId && (
                      <span className="text-xs text-muted-foreground ml-2">
                        Commande #{table.currentOrderId}
                      </span>
                    )}
                  </div>
                </div>

                {table.status === 'reserved' && table.reservationInfo && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="text-right text-sm text-muted-foreground">
                        Réservée par
                      </div>
                      <div className="col-span-3 text-sm">
                        {table.reservationInfo.userName}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="text-right text-sm text-muted-foreground">
                        Horaire
                      </div>
                      <div className="col-span-3 text-sm">
                        {table.reservationInfo.reservationTime}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="text-right text-sm text-muted-foreground">
                        Personnes
                      </div>
                      <div className="col-span-3 text-sm">
                        {table.reservationInfo.partySize} personne{table.reservationInfo.partySize > 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    {table.reservationInfo.notes && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <div className="text-right text-sm text-muted-foreground">
                          Notes
                        </div>
                        <div className="col-span-3 text-sm">
                          {table.reservationInfo.notes}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
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