import React, { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import UserLayout from "@/layouts/user-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, Clock, Users, MapPin, Search, Music, Star, Phone, Mail } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types
type Club = {
  id: number;
  name: string;
  rating: number;
  location: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  musicTypes: string[];
  tables: TableArea[];
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

// Données fictives des clubs
const mockClubs: Club[] = [
  {
    id: 1,
    name: "Club Oxygen",
    rating: 4.8,
    location: "Antananarivo",
    address: "25 Avenue de l'Indépendance, Antananarivo",
    phone: "+261 20 22 123 456",
    email: "contact@cluboxygen.mg",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmlnaHRjbHVifGVufDB8fDB8fHwy",
    musicTypes: ["Électronique", "House", "Techno"],
    tables: [
      {
        id: "vip1",
        name: "VIP Suite",
        description: "Espace VIP privatisé avec vue sur la piste de danse et service personnalisé",
        minCapacity: 4,
        maxCapacity: 10,
        basePrice: 500000,
        available: true,
        image: "https://images.unsplash.com/photo-1575844611398-2a68400b437c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dmlwJTIwbG91bmdlfGVufDB8fDB8fHwy"
      },
      {
        id: "premium1",
        name: "Premium Lounge",
        description: "Espace confortable avec canapés et table privée, service bouteille inclus",
        minCapacity: 4,
        maxCapacity: 8,
        basePrice: 350000,
        available: true,
        image: "https://images.unsplash.com/photo-1610641818989-bbc5e1e805dd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGxvdW5nZXxlbnwwfHwwfHx8Mg%3D%3D"
      },
      {
        id: "standard1",
        name: "Table Standard",
        description: "Table proche de la piste de danse avec service",
        minCapacity: 2,
        maxCapacity: 6,
        basePrice: 200000,
        available: true,
        image: "https://images.unsplash.com/photo-1517457210348-703079e57d4b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFibGUlMjBjbHVifGVufDB8fDB8fHwy"
      }
    ]
  },
  {
    id: 2,
    name: "Havana Club",
    rating: 4.6,
    location: "Antananarivo",
    address: "Zone Tana Waterfront, Antananarivo",
    phone: "+261 20 22 234 567",
    email: "info@havanaclub.mg",
    image: "https://images.unsplash.com/photo-1628688351280-c5636e954ff1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fG5pZ2h0Y2x1YnxlbnwwfHwwfHx8Mg%3D%3D",
    musicTypes: ["Latino", "Salsa", "Variété"],
    tables: [
      {
        id: "vip2",
        name: "Espace Prestige",
        description: "Espace exclusif avec balcon privé et majordome dédié",
        minCapacity: 6,
        maxCapacity: 12,
        basePrice: 600000,
        available: true,
        image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODZ8fHZpcCUyMGxvdW5nZXxlbnwwfHwwfHx8Mg%3D%3D"
      },
      {
        id: "lounge2",
        name: "Lounge Cubain",
        description: "Ambiance chaleureuse inspirée de La Havane avec service premium",
        minCapacity: 4,
        maxCapacity: 8,
        basePrice: 300000,
        available: true,
        image: "https://images.unsplash.com/photo-1585685219515-8f717da9db28?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGxvdW5nZXxlbnwwfHwwfHx8Mg%3D%3D"
      }
    ]
  },
  {
    id: 3,
    name: "Sky Lounge",
    rating: 4.9,
    location: "Antananarivo",
    address: "Tour Zital, 15ème étage, Ankorondrano",
    phone: "+261 20 22 345 678",
    email: "reservation@skylounge.mg",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2x1YnxlbnwwfHwwfHx8Mg%3D%3D",
    musicTypes: ["Lounge", "Deep House", "Jazz"],
    tables: [
      {
        id: "skybox",
        name: "Sky Box",
        description: "Espace privatif avec vue panoramique sur la ville et service haut de gamme",
        minCapacity: 4,
        maxCapacity: 10,
        basePrice: 700000,
        available: true,
        image: "https://images.unsplash.com/photo-1616353071538-cb4ae0a6be56?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNsdWIlMjBsb3VuZ2V8ZW58MHx8MHx8fDI%3D"
      },
      {
        id: "premier",
        name: "Premier Lounge",
        description: "Espace premium avec service attentionné et vue imprenable",
        minCapacity: 2,
        maxCapacity: 6,
        basePrice: 400000,
        available: true,
        image: "https://images.unsplash.com/photo-1602960384314-d68955a10a04?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNsdWIlMjBsb3VuZ2V8ZW58MHx8MHx8fDI%3D"
      }
    ]
  }
];

export default function TableReservationPage() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [clubs, setClubs] = useState(mockClubs);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [selectedTable, setSelectedTable] = useState<TableArea | null>(null);
  const [reservationDate, setReservationDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(4);
  const [bottle, setBottle] = useState("standard");
  const [special, setSpecial] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.musicTypes.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectClub = (club: Club) => {
    setSelectedClub(club);
    setCurrentStep(2);
  };

  const handleSelectTable = (table: TableArea) => {
    setSelectedTable(table);
    setCurrentStep(3);
  };

  const calculateTotal = () => {
    if (!selectedTable) return 0;
    
    let total = selectedTable.basePrice;
    
    // Ajuster le prix en fonction du package de bouteilles
    if (bottle === "premium") {
      total += 150000;
    } else if (bottle === "luxe") {
      total += 300000;
    }
    
    return total;
  };

  const handleSubmitReservation = () => {
    if (!selectedClub || !selectedTable || !reservationDate) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    console.log({
      clubId: selectedClub.id,
      tableId: selectedTable.id,
      date: reservationDate,
      guests,
      bottlePackage: bottle,
      specialRequests: special,
      totalPrice: calculateTotal()
    });

    toast({
      title: "Réservation confirmée!",
      description: `Table réservée chez ${selectedClub.name} pour le ${format(reservationDate, 'dd MMMM yyyy', { locale: fr })}`,
    });

    // Rediriger vers la page de confirmation ou vers le paiement
    setTimeout(() => {
      navigate("/user/tickets");
    }, 2000);
  };

  // Affichage en fonction de l'étape actuelle
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un club par nom, lieu ou type de musique..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClubs.map(club => (
                <Card key={club.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <img 
                      src={club.image} 
                      alt={club.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{club.name}</h3>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{club.rating}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">{club.location}</p>
                        <p className="text-xs text-muted-foreground">{club.address}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {club.musicTypes.map(type => (
                        <Badge key={type} variant="secondary" className="flex items-center">
                          <Music className="h-3 w-3 mr-1" />
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      onClick={() => handleSelectClub(club)} 
                      className="w-full"
                    >
                      Réserver une table
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            {selectedClub && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedClub.image} />
                    <AvatarFallback>{selectedClub.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{selectedClub.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedClub.location}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="ml-auto" 
                    onClick={() => setCurrentStep(1)}
                  >
                    Changer de club
                  </Button>
                </div>
                
                <h3 className="text-lg font-medium mb-4">Sélectionnez une table</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedClub.tables.map(table => (
                    <Card 
                      key={table.id} 
                      className={`overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all ${table.available ? '' : 'opacity-50'}`}
                      onClick={() => table.available && handleSelectTable(table)}
                    >
                      <div className="relative h-40">
                        <img 
                          src={table.image} 
                          alt={table.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 text-white">
                          <h3 className="text-lg font-bold">{table.name}</h3>
                          <div className="flex items-center mt-1">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{table.minCapacity}-{table.maxCapacity} personnes</span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground mb-2">{table.description}</p>
                        <p className="text-lg font-semibold">{table.basePrice.toLocaleString()} Ar</p>
                      </CardContent>
                      {!table.available && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <Badge variant="destructive" className="text-sm">Non disponible</Badge>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            {selectedClub && selectedTable && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Finaliser la réservation</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedClub.name} - {selectedTable.name}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="ml-auto" 
                    onClick={() => setCurrentStep(2)}
                  >
                    Changer de table
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="date" className="text-base">Date de réservation</Label>
                      <div className="mt-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={`w-full justify-start text-left font-normal ${!reservationDate ? "text-muted-foreground" : ""}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {reservationDate ? format(reservationDate, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={reservationDate}
                              onSelect={setReservationDate}
                              initialFocus
                              disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="guests" className="text-base">Nombre d'invités</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          value={[guests]}
                          min={selectedTable.minCapacity}
                          max={selectedTable.maxCapacity}
                          step={1}
                          onValueChange={(value) => setGuests(value[0])}
                          className="flex-1"
                        />
                        <span className="w-12 text-center">{guests}</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="bottle" className="text-base">Package bouteilles</Label>
                      <RadioGroup value={bottle} onValueChange={setBottle} className="mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard">Standard (inclus)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="premium" id="premium" />
                          <Label htmlFor="premium">Premium (+150 000 Ar)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="luxe" id="luxe" />
                          <Label htmlFor="luxe">Luxe (+300 000 Ar)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label htmlFor="special" className="text-base">Demandes spéciales</Label>
                      <Input
                        id="special"
                        placeholder="Allergies, préférences, décoration..."
                        className="mt-2"
                        value={special}
                        onChange={(e) => setSpecial(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Récapitulatif</CardTitle>
                        <CardDescription>Détails de votre réservation</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Club:</span>
                          <span className="font-medium">{selectedClub.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Table:</span>
                          <span className="font-medium">{selectedTable.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Date:</span>
                          <span className="font-medium">
                            {reservationDate 
                              ? format(reservationDate, 'dd MMMM yyyy', { locale: fr }) 
                              : "Non sélectionnée"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Invités:</span>
                          <span className="font-medium">{guests} personnes</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Package bouteilles:</span>
                          <span className="font-medium capitalize">{bottle}</span>
                        </div>
                        <div className="border-t pt-4 mt-4">
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total:</span>
                            <span>{calculateTotal().toLocaleString()} Ar</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          disabled={!reservationDate}
                          onClick={handleSubmitReservation}
                        >
                          Confirmer la réservation
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Informations importantes</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>La réservation est soumise à disponibilité</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>Un acompte de 50% sera demandé pour confirmer la réservation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>Annulation gratuite jusqu'à 48h avant l'événement</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <UserLayout>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border p-3 flex items-center justify-center mb-4">
        <h1 className="font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Be bit.
        </h1>
      </div>
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Réservation de Table</h1>
          {currentStep > 1 && (
            <div className="flex items-center mt-2">
              <div className={`h-1 w-1/3 ${currentStep >= 1 ? 'bg-primary' : 'bg-muted'} rounded-l-full`}></div>
              <div className={`h-1 w-1/3 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
              <div className={`h-1 w-1/3 ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'} rounded-r-full`}></div>
            </div>
          )}
        </div>
        
        {renderStep()}
      </div>
    </UserLayout>
  );
}