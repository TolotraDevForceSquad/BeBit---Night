import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, MapPin, Clock, Calendar as CalendarIcon, Users, Star, Info } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle, 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import TableReservationForm from "@/components/TableReservationForm";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Type pour les clubs
type Club = {
  id: number;
  name: string;
  description: string;
  location: string;
  address: string;
  coverImage: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
  openingHours: {
    [key: string]: string;
  };
  tableAreas: TableArea[];
  amenities: string[];
  images: string[];
  policies: {
    title: string;
    content: string;
  }[];
};

// Type pour les zones de tables
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

// Données fictives d'un club pour le rendu initial
const mockClub: Club = {
  id: 1,
  name: "Club Oxygen",
  description: "Le Club Oxygen est un établissement de premier plan dans la vie nocturne de Madagascar. Avec une atmosphère électrisante, une programmation musicale variée et un service impeccable, nous offrons une expérience incomparable pour tous les amateurs de fête.",
  location: "Antananarivo, Madagascar",
  address: "Lot II J 129 X Ivandry, Antananarivo 101",
  coverImage: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200&h=400&fit=crop",
  profileImage: "https://images.unsplash.com/photo-1559329255-2e7cb6866d5f?w=300&h=300&fit=crop",
  rating: 4.7,
  reviewCount: 124,
  openingHours: {
    "Lundi": "Fermé",
    "Mardi": "Fermé",
    "Mercredi": "19:00 - 02:00",
    "Jeudi": "19:00 - 03:00",
    "Vendredi": "19:00 - 05:00",
    "Samedi": "19:00 - 05:00",
    "Dimanche": "16:00 - 00:00"
  },
  tableAreas: [
    {
      id: "standard",
      name: "Table Standard",
      description: "Tables situées dans la zone principale, près de la piste de danse",
      minCapacity: 4,
      maxCapacity: 8,
      basePrice: 100000,
      available: true,
      image: "https://images.unsplash.com/photo-1581536392583-e0343634847c?w=500&h=300&fit=crop"
    },
    {
      id: "vip",
      name: "Espace VIP",
      description: "Tables exclusives dans notre zone VIP avec service dédié et vue imprenable",
      minCapacity: 6,
      maxCapacity: 12,
      basePrice: 250000,
      available: true,
      image: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=500&h=300&fit=crop"
    },
    {
      id: "booth",
      name: "Booth Privé",
      description: "Espaces intimes séparés pour plus de confidentialité et de confort",
      minCapacity: 8,
      maxCapacity: 15,
      basePrice: 350000,
      available: true,
      image: "https://images.unsplash.com/photo-1622623128719-978d99425ebb?w=500&h=300&fit=crop"
    },
    {
      id: "mezzanine",
      name: "Mezzanine Premium",
      description: "Espace exclusif en mezzanine avec vue panoramique sur le club",
      minCapacity: 10,
      maxCapacity: 20,
      basePrice: 500000,
      available: true,
      image: "https://images.unsplash.com/photo-1502872364588-894d7d6ddfab?w=500&h=300&fit=crop"
    }
  ],
  amenities: [
    "Bouteilles et service inclus",
    "Menu de cocktails exclusifs",
    "Service à table",
    "Vestiaire privé",
    "Accès prioritaire à l'entrée",
    "Garde du corps (sur demande)",
    "Parking sécurisé"
  ],
  images: [
    "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1545128485-c400ce7b23d2?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1602030638412-bb8dcc0bc8b0?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1438557068880-c5f474830377?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1581974206967-93856b25aa13?w=800&h=500&fit=crop"
  ],
  policies: [
    {
      title: "Politique de réservation",
      content: "Les réservations sont confirmées après paiement d'un acompte de 50%. L'acompte est non remboursable en cas d'annulation dans les 24 heures précédant l'événement."
    },
    {
      title: "Dépense minimale",
      content: "Chaque réservation de table est soumise à une dépense minimale sur les consommations, variable selon le jour et la zone. Cette dépense minimale doit être respectée en plus des frais de réservation."
    },
    {
      title: "Code vestimentaire",
      content: "Une tenue correcte est exigée. L'accès peut être refusé en cas de tenue inappropriée (tongs, shorts, maillots de sport, etc.). Une tenue élégante est fortement recommandée."
    },
    {
      title: "Politique d'âge",
      content: "L'âge minimum requis est de 18 ans. Une pièce d'identité valide avec photo peut être demandée à l'entrée."
    }
  ]
};

// Composant principal
export default function TableReservationPage() {
  const [, setLocation] = useLocation();
  const [club, setClub] = useState<Club | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reservation");
  
  // Charger les données du club
  useEffect(() => {
    // Dans un cas réel, vous utiliseriez l'ID du club pour le récupérer depuis l'API
    setClub(mockClub);
    setIsLoading(false);
  }, []);
  
  // Si les données sont en cours de chargement
  if (isLoading || !club) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Contenu de l'en-tête
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Réservation de table</span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <Users className="h-3 w-3 mr-1" />
          <span>Réservation</span>
        </Badge>
      </div>
    </div>
  );
  
  return (
    <ResponsiveLayout
      activeItem="none"
      headerContent={headerContent}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation(`/club/${club.id}`)}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Réserver une table</h1>
        </div>
        
        {/* En-tête du club */}
        <div className="relative mb-8">
          <div 
            className="h-48 w-full bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${club.coverImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg"></div>
          </div>
          
          <div className="absolute left-4 bottom-0 transform translate-y-1/3 flex items-end">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={club.profileImage} alt={club.name} />
              <AvatarFallback>{club.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="ml-4 mb-2 text-white">
              <h2 className="text-2xl font-bold">{club.name}</h2>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{club.location}</span>
              </div>
            </div>
          </div>
          
          <div className="absolute right-4 bottom-4 flex items-center bg-black/50 px-3 py-1.5 rounded-full">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-white font-medium">{club.rating}</span>
            <span className="text-white/70 text-sm ml-1">({club.reviewCount} avis)</span>
          </div>
        </div>
        
        <div className="mt-20 md:flex gap-8">
          {/* Colonne principale avec le formulaire */}
          <div className="md:w-7/12 mb-8 md:mb-0">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reservation">Réservation</TabsTrigger>
                <TabsTrigger value="info">Informations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reservation" className="pt-6">
                <TableReservationForm 
                  clubId={club.id}
                  clubName={club.name}
                  tableAreas={club.tableAreas}
                  onReservationComplete={(data) => {
                    console.log("Réservation complétée:", data);
                  }}
                />
              </TabsContent>
              
              <TabsContent value="info" className="pt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>À propos de {club.name}</CardTitle>
                      <CardDescription>Description et services</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{club.description}</p>
                      
                      <h4 className="font-medium mt-4">Horaires d'ouverture</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(club.openingHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className="font-medium">{day}</span>
                            <span className="text-muted-foreground">{hours}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <h4 className="font-medium">Adresse</h4>
                      <p className="text-muted-foreground flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                        {club.address}
                      </p>
                      
                      <Separator />
                      
                      <h4 className="font-medium">Services inclus</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {club.amenities.map((amenity, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Politiques du club</CardTitle>
                      <CardDescription>Conditions importantes à connaître</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {club.policies.map((policy, index) => (
                          <AccordionItem key={index} value={`policy-${index}`}>
                            <AccordionTrigger className="text-left">
                              <div className="flex items-center">
                                <Info className="h-4 w-4 mr-2" />
                                {policy.title}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="text-sm text-muted-foreground pl-6">{policy.content}</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Colonne latérale avec les zones de tables */}
          <div className="md:w-5/12">
            <Card>
              <CardHeader>
                <CardTitle>Nos espaces de tables</CardTitle>
                <CardDescription>
                  Découvrez les différentes zones de tables disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Carousel className="mb-8">
                  <CarouselContent>
                    {club.tableAreas.map((area) => (
                      <CarouselItem key={area.id}>
                        <div className="p-1">
                          <Card className="overflow-hidden border-0">
                            <img 
                              src={area.image || club.images[0]} 
                              alt={area.name}
                              className="w-full aspect-video object-cover"
                            />
                            <CardContent className="p-4">
                              <h3 className="font-bold">{area.name}</h3>
                              <p className="text-sm text-muted-foreground">{area.description}</p>
                              <div className="flex items-center justify-between mt-2">
                                <Badge variant="outline" className="flex items-center">
                                  <Users className="h-3 w-3 mr-1" />
                                  {area.minCapacity}-{area.maxCapacity} pers.
                                </Badge>
                                <span className="text-sm font-medium">
                                  {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(area.basePrice).replace('MGA', 'Ar')}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
                
                <h3 className="font-medium mb-3">Galerie du club</h3>
                <div className="grid grid-cols-2 gap-2">
                  {club.images.slice(0, 4).map((image, index) => (
                    <img 
                      key={index}
                      src={image}
                      alt={`${club.name} image ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                  ))}
                </div>
                
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium">Informations importantes</h3>
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">Politique d'annulation</p>
                      <p className="text-muted-foreground">Annulation gratuite jusqu'à 24h avant. Après cette limite, 50% du montant sera retenu.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CalendarIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">Dépôt de garantie</p>
                      <p className="text-muted-foreground">Un acompte de 50% vous sera demandé pour confirmer la réservation.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab("reservation")}
                  >
                    Réserver maintenant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}