import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Users, ChevronLeft, Save, Camera, Link as LinkIcon,
  Instagram, Facebook, Twitter, MapPin, Music
} from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Type pour les informations de l'artiste
type ArtistSettings = {
  id: number;
  name: string;
  username: string;
  email: string;
  bio: string;
  genres: string[];
  location: string;
  profileImage: string;
  coverImage: string;
  socialLinks: {
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
};

// Données fictives pour initialiser le formulaire
const mockArtistSettings: ArtistSettings = {
  id: 1,
  name: "DJ Elektra",
  username: "dj_elektra",
  email: "contact@dj-elektra.com",
  bio: "DJ Elektra est une artiste de musique électronique spécialisée dans la techno et la house. Avec plus de 10 ans d'expérience, elle a joué dans les plus grands clubs d'Europe et a sorti plusieurs EP sur des labels renommés. Son style unique mêle des beats profonds et des mélodies hypnotiques pour créer une expérience immersive sur le dancefloor.",
  genres: ["Techno", "House", "Électro"],
  location: "Paris, France",
  profileImage: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=300&h=300&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=1200&h=400&fit=crop",
  socialLinks: {
    website: "https://dj-elektra.com",
    instagram: "dj_elektra",
    facebook: "dj.elektra",
    twitter: "dj_elektra"
  }
};

// Composant principal
export default function ArtistSettingsPage() {
  const [, setLocation] = useLocation();
  const [settings, setSettings] = useState<ArtistSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [genreInput, setGenreInput] = useState("");
  
  // Charger les données initiales
  useEffect(() => {
    // Chargement immédiat sans délai
    setSettings(mockArtistSettings);
    setIsLoading(false);
  }, []);
  
  // Si les données sont en cours de chargement
  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Gérer les modifications des champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Pour les champs imbriqués comme socialLinks.website
      const [parent, child] = name.split('.');
      if (parent === 'socialLinks') {
        setSettings({
          ...settings,
          socialLinks: {
            ...settings.socialLinks,
            [child]: value
          }
        });
      }
    } else {
      // Pour les champs simples
      setSettings({
        ...settings,
        [name]: value
      });
    }
  };
  
  // Gérer l'ajout d'un genre
  const handleAddGenre = () => {
    if (genreInput.trim() && !settings.genres.includes(genreInput.trim())) {
      setSettings({
        ...settings,
        genres: [...settings.genres, genreInput.trim()]
      });
      setGenreInput("");
    }
  };
  
  // Gérer la suppression d'un genre
  const handleRemoveGenre = (genre: string) => {
    setSettings({
      ...settings,
      genres: settings.genres.filter(g => g !== genre)
    });
  };
  
  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simuler une requête API
    setTimeout(() => {
      console.log("Données enregistrées:", settings);
      setIsSaving(false);
      // Rediriger vers le profil après enregistrement
      setLocation("/artist/profile");
    }, 500);
  };
  
  // Contenu de l'en-tête
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Paramètres du profil</span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <Users className="h-3 w-3 mr-1" />
          <span>Paramètres</span>
        </Badge>
        
        <Avatar className="h-9 w-9">
          <AvatarImage src={settings.profileImage} alt={settings.name} />
          <AvatarFallback>{settings.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
  
  return (
    <ResponsiveLayout 
      activeItem="profile"
      headerContent={headerContent}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/artist/profile")}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Modifier votre profil</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images de profil et de couverture */}
          <Card>
            <CardHeader>
              <CardTitle>Photos de profil</CardTitle>
              <CardDescription>
                Personnalisez votre image de profil et votre bannière
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <div 
                  className="h-48 w-full bg-cover bg-center rounded-lg mb-8"
                  style={{ backgroundImage: `url(${settings.coverImage})` }}
                >
                  <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="outline" className="bg-background/80">
                      <Camera className="h-4 w-4 mr-2" />
                      Changer la bannière
                    </Button>
                  </div>
                </div>
                
                <div className="absolute left-4 bottom-0 transform translate-y-1/2">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-background">
                      <AvatarImage src={settings.profileImage} alt={settings.name} />
                      <AvatarFallback>{settings.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Button 
                      size="icon" 
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Modifiez vos informations de base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom d'artiste</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={settings.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input 
                    id="username" 
                    name="username" 
                    value={settings.username} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    value={settings.email} 
                    onChange={handleChange} 
                    type="email" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="location" 
                      name="location" 
                      value={settings.location} 
                      onChange={handleChange} 
                      className="pl-10" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={settings.bio} 
                  onChange={handleChange} 
                  rows={5} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="genres">Genres musicaux</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {settings.genres.map(genre => (
                    <Badge key={genre} variant="secondary" className="flex items-center gap-1">
                      <Music className="h-3 w-3" />
                      {genre}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveGenre(genre)}
                        className="ml-1 hover:text-destructive"
                      >
                        ✕
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    id="genreInput" 
                    value={genreInput} 
                    onChange={e => setGenreInput(e.target.value)} 
                    placeholder="Ajouter un genre"
                  />
                  <Button type="button" onClick={handleAddGenre}>Ajouter</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Réseaux sociaux */}
          <Card>
            <CardHeader>
              <CardTitle>Réseaux sociaux</CardTitle>
              <CardDescription>
                Liez vos profils sur les réseaux sociaux
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="website" 
                    name="socialLinks.website" 
                    value={settings.socialLinks.website || ""} 
                    onChange={handleChange} 
                    placeholder="Votre site web" 
                    className="pl-10" 
                  />
                </div>
                
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="instagram" 
                    name="socialLinks.instagram" 
                    value={settings.socialLinks.instagram || ""} 
                    onChange={handleChange} 
                    placeholder="Nom d'utilisateur Instagram" 
                    className="pl-10" 
                  />
                </div>
                
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="facebook" 
                    name="socialLinks.facebook" 
                    value={settings.socialLinks.facebook || ""} 
                    onChange={handleChange} 
                    placeholder="Nom d'utilisateur Facebook" 
                    className="pl-10" 
                  />
                </div>
                
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="twitter" 
                    name="socialLinks.twitter" 
                    value={settings.socialLinks.twitter || ""} 
                    onChange={handleChange} 
                    placeholder="Nom d'utilisateur Twitter" 
                    className="pl-10" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Boutons d'action */}
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setLocation("/artist/profile")}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-background mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </ResponsiveLayout>
  );
}