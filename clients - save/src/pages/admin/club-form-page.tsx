import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  ChevronLeft, Building, Save, Loader2, X, Plus, 
  MapPin, Link, Globe, Upload, Phone, Mail, Clock, Users
} from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Form, FormControl, FormDescription, FormField, 
  FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schéma de validation pour le formulaire de club
const clubFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().min(20, "La description doit contenir au moins 20 caractères"),
  category: z.string().min(1, "La catégorie est requise"),
  location: z.object({
    address: z.string().min(5, "L'adresse est requise"),
    city: z.string().min(2, "La ville est requise"),
    country: z.string().min(2, "Le pays est requis"),
    coordinates: z.object({
      lat: z.number().optional(),
      lng: z.number().optional()
    }).optional()
  }),
  contactInfo: z.object({
    phone: z.string().optional().or(z.literal("")),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    website: z.string().url("URL invalide").optional().or(z.literal(""))
  }),
  openingHours: z.object({
    monday: z.string(),
    tuesday: z.string(),
    wednesday: z.string(),
    thursday: z.string(),
    friday: z.string(),
    saturday: z.string(),
    sunday: z.string()
  }),
  socialLinks: z.object({
    website: z.string().url("URL invalide").optional().or(z.literal("")),
    instagram: z.string().optional().or(z.literal("")),
    facebook: z.string().optional().or(z.literal("")),
    twitter: z.string().optional().or(z.literal(""))
  }),
  features: z.array(z.string()).min(1, "Sélectionnez au moins une caractéristique"),
  capacity: z.number().min(1, "La capacité doit être au moins de 1 personne"),
  isVerified: z.boolean().default(false),
  userId: z.number().optional()
});

type ClubFormValues = z.infer<typeof clubFormSchema>;

// Liste des catégories de clubs disponibles
const availableCategories = [
  "Club de Nuit", "Club Techno", "Club Électro", "Club House",
  "Lounge Bar", "Club Alternatif", "Club Jazz", "Club Généraliste",
  "Cabaret", "Boîte de Nuit", "Discothèque", "Bar Musical",
  "Club Hip-Hop", "Club Rock", "Salle de Concert"
];

// Liste des caractéristiques disponibles
const availableFeatures = [
  "Bar VIP", "Terrasse", "Système Son Haute Qualité", "Vestiaire",
  "DJ Résidents", "Salle Fumeurs", "Espace Extérieur", "Bar à Cocktails",
  "Restaurant", "Billard", "Karaoké", "Piste de Danse",
  "Effets Lumineux", "Espace Lounge", "Système de Réservation", "Parking",
  "Sécurité 24/7", "Accessible PMR", "Climatisation", "Wi-Fi Gratuit"
];

// Composant principal
export default function ClubFormPage() {
  const [, setLocation] = useLocation();
  const [isCreating, setIsCreating] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Initialiser le formulaire
  const form = useForm<ClubFormValues>({
    resolver: zodResolver(clubFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      location: {
        address: "",
        city: "",
        country: "France"
      },
      contactInfo: {
        phone: "",
        email: "",
        website: ""
      },
      openingHours: {
        monday: "Fermé",
        tuesday: "Fermé",
        wednesday: "22:00 - 05:00",
        thursday: "22:00 - 05:00",
        friday: "22:00 - 06:00",
        saturday: "22:00 - 06:00",
        sunday: "22:00 - 04:00"
      },
      socialLinks: {
        website: "",
        instagram: "",
        facebook: "",
        twitter: ""
      },
      features: [],
      capacity: 100,
      isVerified: false
    }
  });

  // Si nous sommes en mode édition, chargez les données du club
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const clubId = searchParams.get("id");
    
    if (clubId) {
      setIsCreating(false);
      setIsLoading(true);
      
      // Simuler un chargement des données depuis l'API
      setTimeout(() => {
        // Données fictives pour un club existant
        const mockClub = {
          id: parseInt(clubId),
          name: "Club Oxygen",
          description: "Le Club Oxygen est l'un des meilleurs clubs de Paris pour la musique électronique. Avec un système de son dernier cri et des lumières spectaculaires, le club vous offre une expérience nocturne inoubliable.",
          category: "Club de Nuit",
          location: {
            address: "15 rue de la Nuit",
            city: "Paris",
            country: "France"
          },
          contactInfo: {
            phone: "+33 1 23 45 67 89",
            email: "contact@cluboxygen.com",
            website: "https://cluboxygen.com"
          },
          openingHours: {
            monday: "Fermé",
            tuesday: "Fermé",
            wednesday: "22:00 - 05:00",
            thursday: "22:00 - 05:00",
            friday: "22:00 - 06:00",
            saturday: "22:00 - 06:00",
            sunday: "22:00 - 04:00"
          },
          socialLinks: {
            website: "https://cluboxygen.com",
            instagram: "club_oxygen",
            facebook: "cluboxygen",
            twitter: "club_oxygen"
          },
          features: ["Bar VIP", "Terrasse", "Système Son Haute Qualité", "Vestiaire", "DJ Résidents", "Salle Fumeurs"],
          capacity: 800,
          isVerified: true,
          profileImage: "https://images.unsplash.com/photo-1572023459154-81ce732278ec?w=300&h=300&fit=crop",
          coverImage: "https://images.unsplash.com/photo-1572023459154-81ce732278ec?w=1200&h=400&fit=crop"
        };
        
        form.reset({
          name: mockClub.name,
          description: mockClub.description,
          category: mockClub.category,
          location: mockClub.location,
          contactInfo: mockClub.contactInfo,
          openingHours: mockClub.openingHours,
          socialLinks: mockClub.socialLinks,
          features: mockClub.features,
          capacity: mockClub.capacity,
          isVerified: mockClub.isVerified
        });
        
        setSelectedFeatures(mockClub.features);
        setProfileImage(mockClub.profileImage);
        setCoverImage(mockClub.coverImage);
        setIsLoading(false);
      }, 1000);
    }
  }, [form]);

  // Gérer la soumission du formulaire
  const onSubmit = (values: ClubFormValues) => {
    setIsSaving(true);
    
    // Ajouter les caractéristiques sélectionnées aux valeurs
    values.features = selectedFeatures;
    
    // Simuler une sauvegarde dans l'API
    setTimeout(() => {
      console.log("Données soumises:", values);
      console.log("Image de profil:", profileImage);
      console.log("Image de couverture:", coverImage);
      
      setIsSaving(false);
      
      // Rediriger vers la liste des clubs après la sauvegarde
      setLocation("/admin/clubs");
    }, 1500);
  };

  // Gérer l'ajout/suppression d'une caractéristique
  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(prev => prev.filter(f => f !== feature));
    } else {
      setSelectedFeatures(prev => [...prev, feature]);
    }
  };

  // Simuler le téléchargement d'une image
  const handleImageUpload = (type: 'profile' | 'cover') => {
    // Dans un cas réel, vous utiliseriez input[type=file] et FormData pour télécharger l'image
    
    // Simuler des URLs d'images pour la démonstration
    if (type === 'profile') {
      setProfileImage("https://images.unsplash.com/photo-1572023459154-81ce732278ec?w=300&h=300&fit=crop");
    } else {
      setCoverImage("https://images.unsplash.com/photo-1572023459154-81ce732278ec?w=1200&h=400&fit=crop");
    }
  };

  // Contenu de l'en-tête
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">
          {isCreating ? "Créer un nouveau club" : "Modifier le club"}
        </span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => setLocation("/admin/clubs")}
        >
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <ResponsiveLayout headerContent={headerContent} activeItem="clubs">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout headerContent={headerContent} activeItem="clubs">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Informations de base</TabsTrigger>
              <TabsTrigger value="contact">Contact & Horaires</TabsTrigger>
              <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
              <TabsTrigger value="media">Médias</TabsTrigger>
            </TabsList>
            
            {/* Tab Informations de base */}
            <TabsContent value="basic" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom du club */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du club</FormLabel>
                      <FormControl>
                        <Input placeholder="Club Example" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Catégorie */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="" disabled>Sélectionnez une catégorie</option>
                          {availableCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez le club, son ambiance, ses particularités..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Adresse */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Adresse</h3>
                
                <FormField
                  control={form.control}
                  name="location.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input placeholder="15 rue de la Nuit" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input placeholder="Paris" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pays</FormLabel>
                        <FormControl>
                          <Input placeholder="France" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Capacité */}
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacité (personnes)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          type="number" 
                          placeholder="500" 
                          className="pl-9" 
                          min={1}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          value={field.value}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Caractéristiques */}
              <div>
                <Label htmlFor="features">Caractéristiques</Label>
                <div className="mt-2 mb-1.5">
                  {selectedFeatures.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucune caractéristique sélectionnée</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedFeatures.map(feature => (
                        <Badge 
                          key={feature} 
                          variant="secondary"
                          className="flex items-center gap-1 px-2 py-1"
                        >
                          <span>{feature}</span>
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => toggleFeature(feature)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {form.formState.errors.features && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.features.message}
                  </p>
                )}
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Ajouter des caractéristiques:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {availableFeatures
                      .filter(feature => !selectedFeatures.includes(feature))
                      .map(feature => (
                        <Badge 
                          key={feature}
                          variant="outline" 
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => toggleFeature(feature)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
              
              {/* Statut de vérification */}
              <FormField
                control={form.control}
                name="isVerified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                    <div className="space-y-1">
                      <FormLabel className="text-base">Club vérifié</FormLabel>
                      <FormDescription>
                        Les clubs vérifiés apparaissent en priorité dans les recherches
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </TabsContent>
            
            {/* Tab Contact & Horaires */}
            <TabsContent value="contact" className="space-y-6 mt-6">
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle>Informations de contact</CardTitle>
                  <CardDescription>
                    Ajoutez les coordonnées de contact du club
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Téléphone */}
                  <FormField
                    control={form.control}
                    name="contactInfo.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input placeholder="+33 1 XX XX XX XX" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="contactInfo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input placeholder="contact@exemple.com" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Site Web */}
                  <FormField
                    control={form.control}
                    name="contactInfo.website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Web</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input placeholder="https://www.clubexemple.com" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle>Horaires d'ouverture</CardTitle>
                  <CardDescription>
                    Spécifiez les horaires d'ouverture du club pour chaque jour
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Horaires du Lundi */}
                  <FormField
                    control={form.control}
                    name="openingHours.monday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <FormLabel className="text-right">Lundi</FormLabel>
                          <FormControl className="col-span-2">
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input placeholder="Fermé / 22:00 - 04:00" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Horaires du Mardi */}
                  <FormField
                    control={form.control}
                    name="openingHours.tuesday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <FormLabel className="text-right">Mardi</FormLabel>
                          <FormControl className="col-span-2">
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input placeholder="Fermé / 22:00 - 04:00" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Horaires du Mercredi */}
                  <FormField
                    control={form.control}
                    name="openingHours.wednesday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <FormLabel className="text-right">Mercredi</FormLabel>
                          <FormControl className="col-span-2">
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input placeholder="22:00 - 04:00" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Horaires du Jeudi */}
                  <FormField
                    control={form.control}
                    name="openingHours.thursday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <FormLabel className="text-right">Jeudi</FormLabel>
                          <FormControl className="col-span-2">
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input placeholder="22:00 - 04:00" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Horaires du Vendredi */}
                  <FormField
                    control={form.control}
                    name="openingHours.friday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <FormLabel className="text-right">Vendredi</FormLabel>
                          <FormControl className="col-span-2">
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input placeholder="22:00 - 06:00" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Horaires du Samedi */}
                  <FormField
                    control={form.control}
                    name="openingHours.saturday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <FormLabel className="text-right">Samedi</FormLabel>
                          <FormControl className="col-span-2">
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input placeholder="22:00 - 06:00" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Horaires du Dimanche */}
                  <FormField
                    control={form.control}
                    name="openingHours.sunday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <FormLabel className="text-right">Dimanche</FormLabel>
                          <FormControl className="col-span-2">
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input placeholder="22:00 - 04:00" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tab Réseaux sociaux */}
            <TabsContent value="social" className="space-y-6 mt-6">
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle>Réseaux sociaux</CardTitle>
                  <CardDescription>
                    Ajoutez les liens vers les profils sociaux du club
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Website */}
                  <FormField
                    control={form.control}
                    name="socialLinks.website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Web</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input placeholder="https://www.exemple.com" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Instagram */}
                  <FormField
                    control={form.control}
                    name="socialLinks.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">@</div>
                            <Input placeholder="nomutilisateur" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Facebook */}
                  <FormField
                    control={form.control}
                    name="socialLinks.facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">facebook.com/</div>
                            <Input placeholder="nomutilisateur" className="pl-[110px]" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Twitter */}
                  <FormField
                    control={form.control}
                    name="socialLinks.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">@</div>
                            <Input placeholder="nomutilisateur" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tab Médias */}
            <TabsContent value="media" className="space-y-6 mt-6">
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <CardDescription>
                    Téléchargez les images de profil et de couverture du club
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image de profil */}
                  <div className="space-y-3">
                    <Label>Image de profil</Label>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start">
                      <div className="relative">
                        <Avatar className="h-32 w-32 rounded-full">
                          {profileImage ? (
                            <AvatarImage src={profileImage} alt="Preview" />
                          ) : (
                            <AvatarFallback className="bg-muted text-3xl">
                              <Building className="h-12 w-12 text-muted-foreground" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {profileImage && (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={() => setProfileImage(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="gap-1.5"
                          onClick={() => handleImageUpload('profile')}
                        >
                          <Upload className="h-4 w-4" />
                          Télécharger une image
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Format recommandé: JPG, PNG. Taille max: 2 MB
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Dimensions idéales: 300x300px
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Image de couverture */}
                  <div className="space-y-3">
                    <Label>Image de couverture</Label>
                    <div className="flex flex-col gap-4">
                      <div className="relative w-full rounded-md overflow-hidden">
                        {coverImage ? (
                          <div>
                            <img 
                              src={coverImage} 
                              alt="Preview" 
                              className="h-48 w-full object-cover rounded-md"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 rounded-full"
                              onClick={() => setCoverImage(null)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="h-48 w-full bg-muted rounded-md flex items-center justify-center">
                            <div className="text-center">
                              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Aucune image de couverture
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="gap-1.5 w-fit"
                          onClick={() => handleImageUpload('cover')}
                        >
                          <Upload className="h-4 w-4" />
                          Télécharger une image
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Format recommandé: JPG, PNG. Taille max: 5 MB
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Dimensions idéales: 1200x400px
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setLocation("/admin/clubs")}
            >
              Annuler
            </Button>
            
            <Button 
              type="submit" 
              disabled={isSaving}
              className="gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveLayout>
  );
}