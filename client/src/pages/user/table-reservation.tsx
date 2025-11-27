import React, { useState } from 'react';
import { UtensilsCrossed, MapPin, Calendar, Clock, Users, CreditCard } from 'lucide-react';
import UserLayout from '../../layouts/user-layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Types
type Club = {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  hasVIP: boolean;
  hasTables: boolean;
};

type TableArea = {
  id: string;
  name: string;
  description: string;
  minCapacity: number;
  maxCapacity: number;
  basePrice: number;
  available: boolean;
  image?: string;
};

// Clubs avec tables disponibles
const mockClubs: Club[] = [
  {
    id: 1,
    name: "Club Oxygen",
    location: "Antananarivo",
    description: "Club moderne avec piste de danse spacieuse et zones VIP",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmlnaHRjbHVifGVufDB8fDB8fHww",
    rating: 4.8,
    hasVIP: true,
    hasTables: true
  },
  {
    id: 2,
    name: "Le Palace",
    location: "Antananarivo",
    description: "Ambiance élégante avec tables réservées et service premium",
    image: "https://images.unsplash.com/photo-1628495182697-805379dc0d83?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGNsdWJ8ZW58MHx8MHx8fDA%3D",
    rating: 4.5,
    hasVIP: true,
    hasTables: true
  },
  {
    id: 3,
    name: "Bamboo Club",
    location: "Toamasina",
    description: "Club en bord de mer avec terrasse privée et tables réservables",
    image: "https://images.unsplash.com/photo-1595781518663-29af8aa2bbe6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJlYWNoJTIwY2x1YnxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.6,
    hasVIP: false,
    hasTables: true
  }
];

// Configuration des zones de tables pour le Club Oxygen (id: 1)
const clubTables: Record<number, TableArea[]> = {
  1: [
    {
      id: "vip",
      name: "Zone VIP",
      description: "Espace exclusif avec vue sur la piste, service bouteille et hôtesse dédiée",
      minCapacity: 6,
      maxCapacity: 12,
      basePrice: 500000,
      available: true,
      image: "https://images.unsplash.com/photo-1570872267931-32a2d4d22e32?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlwJTIwbG91bmdlfGVufDB8fDB8fHww"
    },
    {
      id: "premium",
      name: "Tables Premium",
      description: "Tables surélevées avec vue sur la piste et service privilégié",
      minCapacity: 4,
      maxCapacity: 8,
      basePrice: 250000,
      available: true,
      image: "https://images.unsplash.com/photo-1602532583827-1e93d5183981?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bmlnaHRjbHViJTIwdGFibGV8ZW58MHx8MHx8fDA%3D"
    },
    {
      id: "standard",
      name: "Tables Standard",
      description: "Tables près du bar avec accès à la piste de danse",
      minCapacity: 2,
      maxCapacity: 6,
      basePrice: 120000,
      available: true,
      image: "https://images.unsplash.com/photo-1612160806751-42ca0c896677?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG5pZ2h0Y2x1YiUyMHRhYmxlfGVufDB8fDB8fHww"
    }
  ],
  2: [
    {
      id: "royal",
      name: "Espace Royal",
      description: "Notre espace le plus exclusif avec service premium et intimité garantie",
      minCapacity: 8,
      maxCapacity: 15,
      basePrice: 600000,
      available: true,
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwbG91bmdlfGVufDB8fDB8fHww"
    },
    {
      id: "lounge",
      name: "Coin Lounge",
      description: "Espace confortable avec canapés et service personnalisé",
      minCapacity: 4,
      maxCapacity: 10,
      basePrice: 350000,
      available: true,
      image: "https://images.unsplash.com/photo-1528495612343-9ca9f4a9f67c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29ja3RhaWwlMjBsb3VuZ2V8ZW58MHx8MHx8fDA%3D"
    }
  ],
  3: [
    {
      id: "beach",
      name: "Section Plage",
      description: "Tables en bord de mer avec vue imprenable et service exclusif",
      minCapacity: 4,
      maxCapacity: 8,
      basePrice: 200000,
      available: true,
      image: "https://images.unsplash.com/photo-1544634190-d34e9acaa3cb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmVhY2glMjBjbHVifGVufDB8fDB8fHww"
    },
    {
      id: "terrace",
      name: "Terrasse Premium",
      description: "Espace en terrasse avec vue panoramique sur la mer",
      minCapacity: 2,
      maxCapacity: 6,
      basePrice: 150000,
      available: true,
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2x1YiUyMHRlcnJhY2V8ZW58MHx8MHx8fDA%3D"
    }
  ]
};

export default function TableReservationPage() {
  // Récupérer les paramètres d'URL
  const queryParams = new URLSearchParams(window.location.search);
  const urlClubId = queryParams.get('clubId');
  const urlClubName = queryParams.get('clubName');
  
  // États pour le formulaire
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [selectedTableArea, setSelectedTableArea] = useState<TableArea | null>(null);
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [guestCount, setGuestCount] = useState('4');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Pré-sélectionner le club si spécifié dans l'URL
  React.useEffect(() => {
    if (urlClubId) {
      const clubId = parseInt(urlClubId);
      const club = mockClubs.find(c => c.id === clubId);
      
      if (club && clubTables[clubId] && clubTables[clubId].length > 0) {
        console.log("Club pré-sélectionné depuis l'URL:", club.name);
        
        // Si le club a des tables disponibles, sélectionner la première
        const firstTableArea = clubTables[clubId][0];
        
        // Ouvrir directement le formulaire de réservation
        setSelectedClub(club);
        setSelectedTableArea(firstTableArea);
        setShowReservationForm(true);
      }
    }
  }, [urlClubId]);

  const handleReservation = (clubId: number, tableAreaId: string) => {
    const club = mockClubs.find(c => c.id === clubId);
    const tableArea = clubTables[clubId]?.find(t => t.id === tableAreaId);
    
    if (club && tableArea) {
      setSelectedClub(club);
      setSelectedTableArea(tableArea);
      setShowReservationForm(true);
    }
  };

  const submitReservation = () => {
    if (!selectedClub || !selectedTableArea || !reservationDate || !reservationTime || !guestCount) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Vérifier que le nombre de personnes est dans les limites
    const guests = parseInt(guestCount);
    if (guests < selectedTableArea.minCapacity || guests > selectedTableArea.maxCapacity) {
      alert(`Le nombre de personnes doit être entre ${selectedTableArea.minCapacity} et ${selectedTableArea.maxCapacity} pour cette zone`);
      return;
    }

    // Ici on simule l'envoi de la réservation
    console.log("Réservation de table soumise:", {
      clubId: selectedClub.id,
      clubName: selectedClub.name,
      tableArea: selectedTableArea.name,
      date: reservationDate,
      time: reservationTime,
      guests: guests,
      specialRequests: specialRequests
    });

    alert(`Demande de réservation de table envoyée à ${selectedClub.name} pour le ${reservationDate} à ${reservationTime}`);
    
    // Réinitialiser le formulaire
    setShowReservationForm(false);
    setSelectedClub(null);
    setSelectedTableArea(null);
    setReservationDate('');
    setReservationTime('');
    setGuestCount('4');
    setSpecialRequests('');
  };

  return (
    <UserLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Réservation de Tables</h1>
        
        <Tabs defaultValue="clubs">
          <TabsList className="mb-6 w-full grid grid-cols-2">
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
            <TabsTrigger value="reservations">Mes Réservations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clubs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {mockClubs.map(club => (
                <Card key={club.id} className="overflow-hidden">
                  <CardHeader className="p-0 relative h-48">
                    <img 
                      src={club.image} 
                      alt={club.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 z-10">
                      <CardTitle className="text-white text-xl">{club.name}</CardTitle>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="bg-primary/20 text-white border-primary mr-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {club.location}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">{club.description}</p>
                    <div className="grid grid-cols-1 gap-3">
                      {clubTables[club.id]?.map(tableArea => (
                        <div key={tableArea.id} className="flex justify-between items-center border rounded-lg p-3">
                          <div>
                            <h4 className="font-medium">{tableArea.name}</h4>
                            <p className="text-xs text-muted-foreground">{tableArea.minCapacity}-{tableArea.maxCapacity} personnes</p>
                            <p className="text-sm font-semibold mt-1">{tableArea.basePrice.toLocaleString()} Ar</p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleReservation(club.id, tableArea.id)}
                          >
                            Réserver
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reservations">
            <div className="text-center py-12">
              <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h2 className="mt-4 text-xl font-semibold">Aucune réservation</h2>
              <p className="mt-2 text-muted-foreground">
                Vous n'avez pas encore de réservations de tables.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Formulaire de réservation dans une modal */}
      <Dialog open={showReservationForm} onOpenChange={setShowReservationForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Réserver une table</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedClub && selectedTableArea && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-lg overflow-hidden">
                    <img 
                      src={selectedTableArea.image || selectedClub.image} 
                      alt={selectedTableArea.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedClub.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedTableArea.name}</p>
                    <p className="text-sm font-medium">{selectedTableArea.basePrice.toLocaleString()} Ar</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">{selectedTableArea.description}</p>
                
                <div className="rounded-md bg-muted/50 p-3 text-sm">
                  <p>Capacité: {selectedTableArea.minCapacity} à {selectedTableArea.maxCapacity} personnes</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input 
                  id="date" 
                  type="date" 
                  className="pl-10" 
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Heure d'arrivée</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input 
                  id="time" 
                  type="time" 
                  className="pl-10" 
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guests">Nombre de personnes</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input 
                  id="guests" 
                  type="number" 
                  className="pl-10" 
                  min={selectedTableArea?.minCapacity || 1}
                  max={selectedTableArea?.maxCapacity || 10}
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  required
                />
              </div>
              {selectedTableArea && (
                <p className="text-xs text-muted-foreground">
                  Min: {selectedTableArea.minCapacity}, Max: {selectedTableArea.maxCapacity} personnes
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requests">Demandes spéciales</Label>
              <Textarea 
                id="requests" 
                placeholder="Demandes particulières, service bouteille, etc." 
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button type="button" onClick={submitReservation}>
              Confirmer la réservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UserLayout>
  );
}