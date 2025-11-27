import { useState, useEffect } from "react";
import { Calendar, Music, MapPin, Clock, Users, Banknote, Info, Check, CheckCircle } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format, addHours } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
};

// Type pour les clubs
type Club = {
  id: number;
  name: string;
  image: string;
  location: string;
  capacity: number;
  description: string;
  rating: number;
  tableOptions: TableOption[];
};

type TableOption = {
  id: number;
  name: string;
  capacity: number;
  price: number;
  available: boolean;
};

// Données fictives pour les clubs
const mockClubs: Club[] = [
  {
    id: 1,
    name: "Club Oxygen",
    image: "/images/clubs/club1.jpg",
    location: "Antananarivo, Madagascar",
    capacity: 500,
    description: "Club emblématique au cœur de la capitale avec une piste de danse principale et plusieurs espaces VIP.",
    rating: 4.8,
    tableOptions: [
      { id: 1, name: "Table standard", capacity: 4, price: 50000, available: true },
      { id: 2, name: "Table VIP", capacity: 6, price: 100000, available: true },
      { id: 3, name: "Salon privé", capacity: 10, price: 250000, available: true },
    ]
  },
  {
    id: 2,
    name: "Le Bunker",
    image: "/images/clubs/club2.jpg",
    location: "Antananarivo, Madagascar",
    capacity: 300,
    description: "Club underground avec une ambiance intime et une excellente acoustique pour les sets électroniques.",
    rating: 4.5,
    tableOptions: [
      { id: 4, name: "Table standard", capacity: 4, price: 40000, available: true },
      { id: 5, name: "Table premium", capacity: 6, price: 80000, available: true },
    ]
  },
  {
    id: 3,
    name: "Sky Lounge",
    image: "/images/clubs/club3.jpg",
    location: "Antananarivo, Madagascar",
    capacity: 200,
    description: "Rooftop avec vue panoramique, parfait pour les événements de jour et les couchers de soleil.",
    rating: 4.9,
    tableOptions: [
      { id: 6, name: "Table terrasse", capacity: 4, price: 60000, available: true },
      { id: 7, name: "Salon VIP", capacity: 8, price: 150000, available: true },
    ]
  },
  {
    id: 4,
    name: "Jungle Room",
    image: "/images/clubs/club4.jpg",
    location: "Antananarivo, Madagascar",
    capacity: 350,
    description: "Club à thème avec une décoration exotique et un système sonore de haute qualité.",
    rating: 4.2,
    tableOptions: [
      { id: 8, name: "Table standard", capacity: 4, price: 45000, available: true },
      { id: 9, name: "Table VIP", capacity: 6, price: 90000, available: true },
    ]
  },
  {
    id: 5,
    name: "Club Nova",
    image: "/images/clubs/club5.jpg",
    location: "Antananarivo, Madagascar",
    capacity: 400,
    description: "Club moderne avec plusieurs ambiances et salles thématiques pour différents genres musicaux.",
    rating: 4.7,
    tableOptions: [
      { id: 10, name: "Table classique", capacity: 4, price: 55000, available: true },
      { id: 11, name: "Salon privé", capacity: 8, price: 200000, available: true },
    ]
  }
];

// Categories musicales
const musicCategories = [
  "Techno",
  "House",
  "Deep House",
  "EDM",
  "Hip-Hop",
  "RnB",
  "Afro",
  "Latin",
  "Pop",
  "Lounge",
  "Disco",
  "Funk",
  "Soul",
  "Reggae",
  "Dancehall"
];

// Schéma de validation pour le formulaire
const eventSchema = z.object({
  title: z.string().min(5, { message: "Le titre doit contenir au moins 5 caractères" }),
  description: z.string().min(20, { message: "La description doit contenir au moins 20 caractères" }),
  category: z.string({ required_error: "Veuillez sélectionner une catégorie" }),
  date: z.date({ required_error: "Veuillez sélectionner une date" }),
  startTime: z.string({ required_error: "Veuillez sélectionner une heure de début" }),
  endTime: z.string({ required_error: "Veuillez sélectionner une heure de fin" }),
  clubId: z.string({ required_error: "Veuillez sélectionner un club" }),
  entryFee: z.string().min(1, { message: "Veuillez entrer un prix d'entrée" }),
  capacity: z.string().min(1, { message: "Veuillez entrer une capacité" }),
  reserveTables: z.boolean().default(false),
  tableIds: z.array(z.string()).optional(),
});

export default function ArtistCreateEventPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Formulaire avec react-hook-form et zod
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      date: undefined,
      startTime: "21:00",
      endTime: "02:00",
      clubId: "",
      entryFee: "10000",
      capacity: "",
      reserveTables: false,
      tableIds: [],
    },
  });

  // Observer les changements de valeur pour le club sélectionné
  const watchClubId = form.watch("clubId");
  const watchReserveTables = form.watch("reserveTables");

  // Récupérer les données utilisateur du localStorage
  useEffect(() => {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setUser(userData);
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
      }
    }
  }, []);

  // Chargement des clubs
  useEffect(() => {
    // Chargement immédiat sans délai artificiel
    setClubs(mockClubs);
    setIsLoading(false);
  }, []);

  // Mettre à jour le club sélectionné lorsque l'ID du club change
  useEffect(() => {
    if (watchClubId) {
      const club = clubs.find(c => c.id === parseInt(watchClubId));
      setSelectedClub(club || null);
      
      // Réinitialiser les tables sélectionnées
      setSelectedTables([]);
      form.setValue("tableIds", []);
      
      // Mettre à jour la capacité avec celle du club
      if (club) {
        form.setValue("capacity", club.capacity.toString());
      }
    }
  }, [watchClubId, clubs, form]);

  // Gérer la soumission du formulaire
  const onSubmit = async (data: z.infer<typeof eventSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Ici, vous effectueriez un appel API pour créer l'événement
      console.log("Données de l'événement à créer:", data);
      
      // Marquer comme soumis avec succès - sans délai artificiel
      setIsSubmitted(true);
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la sélection des tables
  const handleTableSelection = (tableId: string) => {
    if (selectedTables.includes(tableId)) {
      // Retirer la table si déjà sélectionnée
      const updatedTables = selectedTables.filter(id => id !== tableId);
      setSelectedTables(updatedTables);
      form.setValue("tableIds", updatedTables);
    } else {
      // Ajouter la table si non sélectionnée
      const updatedTables = [...selectedTables, tableId];
      setSelectedTables(updatedTables);
      form.setValue("tableIds", updatedTables);
    }
  };

  // Calculer le total des tables sélectionnées
  const calculateTableTotal = () => {
    if (!selectedClub || !selectedTables.length) return 0;
    
    return selectedClub.tableOptions
      .filter(table => selectedTables.includes(table.id.toString()))
      .reduce((total, table) => total + table.price, 0);
  };

  // Contenu d'en-tête pour le layout
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Créer un événement</span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Nouvel événement</span>
        </Badge>
        
        {user && (
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.profileImage} alt={user.username} />
            <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );

  return (
    <ResponsiveLayout
      activeItem="événements"
      headerContent={headerContent}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : isSubmitted ? (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <CardTitle>Événement créé avec succès !</CardTitle>
            </div>
            <CardDescription>
              Votre événement a été soumis et est en attente de validation par le club.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="font-semibold text-lg">{form.getValues("title")}</h3>
              <p className="text-sm text-muted-foreground mt-1">{form.getValues("description")}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">
                    {form.getValues("date") 
                      ? format(form.getValues("date"), "EEEE d MMMM yyyy", { locale: fr }) 
                      : "Date non spécifiée"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{form.getValues("startTime")} - {form.getValues("endTime")}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{selectedClub?.name}</span>
                </div>
                <div className="flex items-center">
                  <Music className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{form.getValues("category")}</span>
                </div>
                <div className="flex items-center">
                  <Banknote className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{parseInt(form.getValues("entryFee")).toLocaleString()} Ar</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">Capacité: {parseInt(form.getValues("capacity")).toLocaleString()} personnes</span>
                </div>
              </div>
              
              {watchReserveTables && selectedTables.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Tables réservées:</h4>
                  <ul className="space-y-1">
                    {selectedClub?.tableOptions
                      .filter(table => selectedTables.includes(table.id.toString()))
                      .map(table => (
                        <li key={table.id} className="text-sm flex justify-between">
                          <span>{table.name} (Capacité: {table.capacity})</span>
                          <span>{table.price.toLocaleString()} Ar</span>
                        </li>
                      ))}
                  </ul>
                  <div className="flex justify-between mt-2 pt-2 border-t font-semibold">
                    <span>Total tables:</span>
                    <span>{calculateTableTotal().toLocaleString()} Ar</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                Créer un autre événement
              </Button>
              <Button>
                Voir mes événements
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Créer un nouvel événement</CardTitle>
              <CardDescription>
                Remplissez les informations ci-dessous pour créer un événement en collaboration avec un club.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informations de base</h3>
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre de l'événement</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Soirée Techno Underground" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Décrivez votre événement, le style musical, l'ambiance prévue..."
                              rows={4}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Catégorie musicale</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une catégorie" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {musicCategories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold">Date et horaires</h3>
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date de l'événement</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: fr })
                                  ) : (
                                    <span>Sélectionner une date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heure de début</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heure de fin</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold">Lieu et capacité</h3>
                    
                    <FormField
                      control={form.control}
                      name="clubId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Club</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un club" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clubs.map(club => (
                                <SelectItem key={club.id} value={club.id.toString()}>
                                  {club.name} - {club.location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {selectedClub && (
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="h-14 w-14 rounded-md overflow-hidden">
                            <img 
                              src={selectedClub.image} 
                              alt={selectedClub.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{selectedClub.name}</h4>
                            <p className="text-sm text-muted-foreground">{selectedClub.location}</p>
                            <p className="text-sm mt-1">Capacité maximale: {selectedClub.capacity} personnes</p>
                          </div>
                        </div>
                        <p className="text-sm mt-2">{selectedClub.description}</p>
                      </div>
                    )}
                    
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacité d'accueil</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Nombre de personnes maximum" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            La capacité maximale du club sélectionné est de {selectedClub?.capacity || "..."} personnes.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="entryFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix d'entrée (Ar)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Ex: 10000" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Prix d'entrée en Ariary. Entrez 0 pour un événement gratuit.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {selectedClub && selectedClub.tableOptions.length > 0 && (
                    <div className="space-y-4 pt-4 border-t">
                      <FormField
                        control={form.control}
                        name="reserveTables"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-md border">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Réserver des tables à l'avance</FormLabel>
                              <FormDescription>
                                Sélectionnez cette option pour réserver des tables pour votre équipe et vos invités.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      {watchReserveTables && (
                        <div className="space-y-3 mt-4">
                          <h4 className="font-medium">Tables disponibles:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {selectedClub.tableOptions.map(table => (
                              <div 
                                key={table.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                  selectedTables.includes(table.id.toString()) 
                                    ? "border-primary bg-primary/5" 
                                    : "hover:border-primary/50"
                                }`}
                                onClick={() => handleTableSelection(table.id.toString())}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium">{table.name}</div>
                                    <div className="text-sm text-muted-foreground">Capacité: {table.capacity} personnes</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold">{table.price.toLocaleString()} Ar</div>
                                    {selectedTables.includes(table.id.toString()) && (
                                      <Check className="h-4 w-4 text-primary ml-auto" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {selectedTables.length > 0 && (
                            <div className="p-3 rounded-lg bg-muted flex justify-between items-center">
                              <div>
                                <span className="font-medium">Total réservation des tables:</span>
                                <span className="text-sm text-muted-foreground ml-2">
                                  {selectedTables.length} table(s) sélectionnée(s)
                                </span>
                              </div>
                              <div className="font-semibold">{calculateTableTotal().toLocaleString()} Ar</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="pt-6 border-t">
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                      <Button variant="outline" type="button">
                        Annuler
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="min-w-[150px]"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                              </svg>
                            </span>
                            Création...
                          </>
                        ) : (
                          "Créer l'événement"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
    </ResponsiveLayout>
  );
}