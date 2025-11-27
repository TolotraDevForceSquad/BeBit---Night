import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  ChevronLeft, Music, Save, Loader2, X, Plus, 
  MapPin, Link, Globe, Upload
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

// Schéma de validation pour le formulaire d'artiste
const artistFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  bio: z.string().min(20, "La biographie doit contenir au moins 20 caractères"),
  genres: z.array(z.string()).min(1, "Sélectionnez au moins un genre"),
  location: z.string().min(2, "La localisation est requise"),
  socialLinks: z.object({
    website: z.string().url("URL invalide").optional().or(z.literal("")),
    instagram: z.string().optional().or(z.literal("")),
    facebook: z.string().optional().or(z.literal("")),
    twitter: z.string().optional().or(z.literal(""))
  }),
  isVerified: z.boolean().default(false),
  userId: z.number().optional()
});

type ArtistFormValues = z.infer<typeof artistFormSchema>;

// Liste des genres musicaux disponibles
const availableGenres = [
  "Techno", "House", "Deep House", "Tech House", "Progressive House", 
  "Trance", "Progressive Trance", "Psytrance", "Drum & Bass", "Jungle",
  "Dubstep", "Hip-Hop", "Rap", "R&B", "Soul", "Funk", "Disco", 
  "Electro", "Ambient", "Chill", "Lounge", "Jazz", "Rock", "Metal",
  "Pop", "Reggae", "Dancehall", "Afrobeat", "Latin", "World"
];

// Composant principal
export default function ArtistFormPage() {
  const [, setLocation] = useLocation();
  const [isCreating, setIsCreating] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Initialiser le formulaire
  const form = useForm<ArtistFormValues>({
    resolver: zodResolver(artistFormSchema),
    defaultValues: {
      name: "",
      bio: "",
      genres: [],
      location: "",
      socialLinks: {
        website: "",
        instagram: "",
        facebook: "",
        twitter: ""
      },
      isVerified: false
    }
  });

  // Si nous sommes en mode édition, chargez les données de l'artiste
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const artistId = searchParams.get("id");
    
    if (artistId) {
      setIsCreating(false);
      setIsLoading(true);
      
      // Simuler un chargement des données depuis l'API
      setTimeout(() => {
        // Données fictives pour un artiste existant
        const mockArtist = {
          id: parseInt(artistId),
          name: "DJ Elektra",
          bio: "DJ Elektra est une artiste de musique électronique spécialisée dans la techno et la house. Avec plus de 10 ans d'expérience, elle a joué dans les plus grands clubs d'Europe et a sorti plusieurs EP sur des labels renommés.",
          genres: ["Techno", "House"],
          location: "Paris, France",
          socialLinks: {
            website: "https://dj-elektra.com",
            instagram: "dj_elektra",
            facebook: "dj.elektra",
            twitter: "dj_elektra"
          },
          isVerified: true,
          profileImage: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=300&h=300&fit=crop",
          coverImage: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=1200&h=400&fit=crop"
        };
        
        form.reset({
          name: mockArtist.name,
          bio: mockArtist.bio,
          genres: mockArtist.genres,
          location: mockArtist.location,
          socialLinks: mockArtist.socialLinks,
          isVerified: mockArtist.isVerified
        });
        
        setSelectedGenres(mockArtist.genres);
        setProfileImage(mockArtist.profileImage);
        setCoverImage(mockArtist.coverImage);
        setIsLoading(false);
      }, 1000);
    }
  }, [form]);

  // Gérer la soumission du formulaire
  const onSubmit = (values: ArtistFormValues) => {
    setIsSaving(true);
    
    // Ajouter les genres sélectionnés aux valeurs
    values.genres = selectedGenres;
    
    // Simuler une sauvegarde dans l'API
    setTimeout(() => {
      console.log("Données soumises:", values);
      console.log("Image de profil:", profileImage);
      console.log("Image de couverture:", coverImage);
      
      setIsSaving(false);
      
      // Rediriger vers la liste des artistes après la sauvegarde
      setLocation("/admin/artists");
    }, 1500);
  };

  // Gérer l'ajout/suppression d'un genre
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(prev => prev.filter(g => g !== genre));
    } else {
      setSelectedGenres(prev => [...prev, genre]);
    }
  };

  // Simuler le téléchargement d'une image
  const handleImageUpload = (type: 'profile' | 'cover') => {
    // Dans un cas réel, vous utiliseriez input[type=file] et FormData pour télécharger l'image
    
    // Simuler des URLs d'images pour la démonstration
    if (type === 'profile') {
      setProfileImage("https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=300&h=300&fit=crop");
    } else {
      setCoverImage("https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=1200&h=400&fit=crop");
    }
  };

  // Contenu de l'en-tête
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">
          {isCreating ? "Créer un nouvel artiste" : "Modifier l'artiste"}
        </span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => setLocation("/admin/artists")}
        >
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <ResponsiveLayout headerContent={headerContent} activeItem="artistes">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout headerContent={headerContent} activeItem="artistes">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Informations de base</TabsTrigger>
              <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
              <TabsTrigger value="media">Médias</TabsTrigger>
            </TabsList>
            
            {/* Tab Informations de base */}
            <TabsContent value="basic" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom de l'artiste */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'artiste</FormLabel>
                      <FormControl>
                        <Input placeholder="DJ Example" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Localisation */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localisation</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input placeholder="Paris, France" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Biographie */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biographie</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez l'artiste, son style musical, son expérience..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Genres musicaux */}
              <div>
                <Label htmlFor="genres">Genres musicaux</Label>
                <div className="mt-2 mb-1.5">
                  {selectedGenres.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucun genre sélectionné</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedGenres.map(genre => (
                        <Badge 
                          key={genre} 
                          variant="secondary"
                          className="flex items-center gap-1 px-2 py-1"
                        >
                          <span>{genre}</span>
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => toggleGenre(genre)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {form.formState.errors.genres && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.genres.message}
                  </p>
                )}
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Ajouter des genres:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {availableGenres
                      .filter(genre => !selectedGenres.includes(genre))
                      .map(genre => (
                        <Badge 
                          key={genre}
                          variant="outline" 
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => toggleGenre(genre)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {genre}
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
                      <FormLabel className="text-base">Artiste vérifié</FormLabel>
                      <FormDescription>
                        Les artistes vérifiés apparaissent en priorité dans les recherches
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
            
            {/* Tab Réseaux sociaux */}
            <TabsContent value="social" className="space-y-6 mt-6">
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle>Réseaux sociaux</CardTitle>
                  <CardDescription>
                    Ajoutez les liens vers les profils sociaux de l'artiste
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
                    Téléchargez les images de profil et de couverture de l'artiste
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
                              <Music className="h-12 w-12 text-muted-foreground" />
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
                              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
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
              onClick={() => setLocation("/admin/artists")}
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