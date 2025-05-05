import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Calendar, MapPin, Clock, Users, Euro, Save, Plus, Image } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
};

// Type pour les options de clubs
type ClubOption = {
  id: number;
  name: string;
  location: string;
  image?: string;
};

// Données fictives des clubs
const mockClubs: ClubOption[] = [
  {
    id: 101,
    name: "Club Oxygen",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000"
  },
  {
    id: 102,
    name: "Le Loft",
    location: "Lyon, France",
    image: "https://images.unsplash.com/photo-1578760427650-9645a33f4e1b?q=80&w=1000"
  },
  {
    id: 103,
    name: "Warehouse",
    location: "Marseille, France",
    image: "https://images.unsplash.com/photo-1577201561968-fd58f12e8dcd?q=80&w=1000"
  },
  {
    id: 104,
    name: "Blue Note",
    location: "Bordeaux, France",
    image: "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?q=80&w=1000"
  }
];

export default function CreateEventPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [clubs, setClubs] = useState<ClubOption[]>([]);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // États du formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("20:00");
  const [selectedClub, setSelectedClub] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [contribution, setContribution] = useState(0);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    // Simuler un chargement des clubs
    setClubs(mockClubs);
  }, []);

  // Formater les heures pour l'input time
  const formatTimeOptions = () => {
    const options = [];
    for (let hour = 18; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    for (let hour = 0; hour <= 6; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  // Soumettre le formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !date || !time || !selectedClub) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simuler l'envoi des données
    setTimeout(() => {
      // Ici, on enverrait normalement les données au serveur
      
      toast({
        title: "Événement créé !",
        description: "Votre sortie a été créée avec succès.",
        variant: "default",
      });
      
      setIsSubmitting(false);
      navigate("/user/events");
    }, 1500);
  };

  // Header content pour la mise en page
  const headerContent = (
    <div className="w-full flex items-center">
      <Link to="/">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      
      <h1 className="font-semibold text-lg">Créer une sortie</h1>
    </div>
  );

  return (
    <ResponsiveLayout activeItem="explore" headerContent={headerContent}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Créer une sortie</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Détails de la sortie</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titre et Description */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de la sortie *</Label>
                  <Input
                    id="title"
                    placeholder="ex: Soirée techno entre amis"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre sortie en quelques mots..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </div>
              
              {/* Date et Heure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <DatePicker date={date} setDate={setDate} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Heure *</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une heure" />
                    </SelectTrigger>
                    <SelectContent>
                      {formatTimeOptions().map((timeOption) => (
                        <SelectItem key={timeOption} value={timeOption}>
                          {timeOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Club */}
              <div className="space-y-2">
                <Label>Club / Lieu *</Label>
                <Select value={selectedClub} onValueChange={setSelectedClub}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un club" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubs.map((club) => (
                      <SelectItem key={club.id} value={club.id.toString()}>
                        {club.name} - {club.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Image */}
              <div className="space-y-2">
                <Label htmlFor="image">Image de couverture (optionnelle)</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    placeholder="URL de l'image"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" className="flex-shrink-0">
                    <Image className="h-4 w-4 mr-2" />
                    Parcourir
                  </Button>
                </div>
                {imageUrl && (
                  <div className="mt-2 relative aspect-video rounded-md overflow-hidden">
                    <img 
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/600x400?text=Image+invalide";
                      }}
                    />
                  </div>
                )}
              </div>
              
              {/* Nombre max de participants */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="max-participants">Nombre maximum de participants</Label>
                  <span className="text-sm font-medium">{maxParticipants}</span>
                </div>
                <Slider
                  id="max-participants"
                  min={2}
                  max={50}
                  step={1}
                  value={[maxParticipants]}
                  onValueChange={(values) => setMaxParticipants(values[0])}
                />
              </div>
              
              {/* Contribution */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="contribution">Contribution par personne</Label>
                  <span className="text-sm font-medium">{contribution > 0 ? `${contribution} €` : "Gratuit"}</span>
                </div>
                <Slider
                  id="contribution"
                  min={0}
                  max={100}
                  step={5}
                  value={[contribution]}
                  onValueChange={(values) => setContribution(values[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Cette somme sera collectée auprès des participants pour couvrir les frais (entrée, consommations, etc.)
                </p>
              </div>
              
              {/* Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="private">Événement privé</Label>
                    <p className="text-xs text-muted-foreground">
                      Seules les personnes invitées pourront voir et rejoindre cet événement
                    </p>
                  </div>
                  <Switch
                    id="private"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                </div>
              </div>
              
              {/* Boutons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={() => navigate("/")}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Créer la sortie
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
}