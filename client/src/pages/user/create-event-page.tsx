import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Loader2 } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
};

// Schéma de validation pour le formulaire de création d'événement
const createEventSchema = z.object({
  title: z.string().min(5, { message: "Le titre doit contenir au moins 5 caractères" }),
  description: z.string().min(20, { message: "La description doit contenir au moins 20 caractères" }),
  date: z.date({ required_error: "Veuillez sélectionner une date" }),
  time: z.string({ required_error: "Veuillez sélectionner une heure" }),
  category: z.string({ required_error: "Veuillez sélectionner une catégorie" }),
  price: z.coerce.number().min(0, { message: "Le prix doit être positif ou zéro" }),
  venueType: z.enum(["club", "other"], { required_error: "Veuillez sélectionner un type de lieu" }),
  venueName: z.string().min(3, { message: "Le nom du lieu doit contenir au moins 3 caractères" }),
  useCurrentLocation: z.boolean().default(true),
  address: z.string().optional(),
  city: z.string().optional(),
  customLocation: z.boolean().default(false),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
}).refine(data => {
  // Si le type de lieu est "other", le nom du lieu est obligatoire
  if (data.venueType === "other" && (!data.venueName || data.venueName.length < 3)) {
    return false;
  }
  // Si useCurrentLocation est false, address et city sont obligatoires
  if (!data.useCurrentLocation && (!data.address || !data.city)) {
    return false;
  }
  return true;
}, {
  message: "Veuillez remplir tous les champs obligatoires",
  path: ["venueName"], // Le champ qui recevra l'erreur
});

type CreateEventFormValues = z.infer<typeof createEventSchema>;

export default function CreateEventPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clubs, setClubs] = useState<{ id: number, name: string }[]>([]);
  const [selectedVenueType, setSelectedVenueType] = useState<"club" | "other">("other");
  
  // Récupérer la géolocalisation de l'utilisateur
  const { latitude, longitude, city, loading: geoLoading } = useGeolocation();
  
  // Récupérer les données utilisateur du localStorage
  useEffect(() => {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setUser(userData);
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
        setLocation("/auth");
      }
    } else {
      setLocation("/auth");
    }
    
    // Charger les clubs disponibles (mock data pour cet exemple)
    setClubs([
      { id: 1, name: "Club Oxygen" },
      { id: 2, name: "Loft 21" },
      { id: 3, name: "Blue Note" },
      { id: 4, name: "Le Bunker" },
      { id: 5, name: "Warehouse" },
    ]);
  }, [setLocation]);
  
  // Définir les catégories d'événements
  const categories = ["House", "Techno", "Hip-Hop", "Jazz", "Funk", "EDM", "Autre"];
  
  // Initialiser le formulaire
  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 0,
      venueType: "other",
      venueName: "",
      useCurrentLocation: true,
      customLocation: false,
    },
  });
  
  // Mettre à jour les données de géolocalisation dans le formulaire
  useEffect(() => {
    if (latitude && longitude && city && form.getValues("useCurrentLocation")) {
      form.setValue("latitude", latitude);
      form.setValue("longitude", longitude);
      form.setValue("city", city);
    }
  }, [latitude, longitude, city, form]);
  
  // Suivre le changement de type de lieu
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "venueType") {
        setSelectedVenueType(value.venueType as "club" | "other");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);
  
  const onSubmit = async (data: CreateEventFormValues) => {
    setIsSubmitting(true);
    
    // Construire le timestamp complet pour la date et l'heure
    const dateTime = new Date(data.date);
    const [hours, minutes] = data.time.split(':').map(Number);
    dateTime.setHours(hours, minutes);
    
    // Construire l'objet d'événement à envoyer
    const eventData = {
      ...data,
      date: dateTime.toISOString(),
      // Ajoutez d'autres champs si nécessaire
    };
    
    console.log("Données de l'événement à envoyer:", eventData);
    
    // Simuler l'envoi au serveur avec un délai
    setTimeout(() => {
      setIsSubmitting(false);
      // Rediriger vers la page des événements avec un message de succès
      alert("Événement créé avec succès!");
      setLocation("/user/explorer");
    }, 1500);
  };
  
  return (
    <ResponsiveLayout activeItem="create_event">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Créer un événement</h1>
        <p className="text-muted-foreground">
          Organisez votre propre sortie ou événement et invitez vos amis
        </p>
      </div>
      
      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Titre et description */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre de l'événement</FormLabel>
                    <FormControl>
                      <Input placeholder="Soirée au club" {...field} />
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
                    <FormLabel>Catégorie</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez votre événement en détail" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Date et heure */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Prix */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix d'entrée (en Ariary)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="1000"
                      placeholder="0 pour gratuit" 
                      {...field} 
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "0" : value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Type de lieu */}
            <FormField
              control={form.control}
              name="venueType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de lieu</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedVenueType(value as "club" | "other");
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type de lieu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="club">Club existant</SelectItem>
                      <SelectItem value="other">Autre endroit</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Nom du lieu (conditionnel selon le type) */}
            {selectedVenueType === "club" ? (
              <FormField
                control={form.control}
                name="venueName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sélectionner un club</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un club" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clubs.map((club) => (
                          <SelectItem key={club.id} value={club.name}>
                            {club.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="venueName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du lieu</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Chez moi, Plage de ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {/* Localisation */}
            <FormField
              control={form.control}
              name="useCurrentLocation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Utiliser ma position actuelle</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {city ? `Position détectée: ${city}` : "Détection de votre position..."}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={geoLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {/* Afficher les champs d'adresse si l'utilisateur ne veut pas utiliser sa position actuelle */}
            {!form.watch("useCurrentLocation") && (
              <>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="21 rue de la Paix" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="city"
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
              </>
            )}
            
            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setLocation("/user/explorer")}>
                Annuler
              </Button>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  "Créer l'événement"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ResponsiveLayout>
  );
}