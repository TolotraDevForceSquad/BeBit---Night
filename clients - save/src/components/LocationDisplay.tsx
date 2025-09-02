import { useEffect, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationDisplayProps {
  onCitySelect?: (city: string) => void;
  className?: string;
  displayMode?: "icon" | "badge" | "text" | "full";
  showSelector?: boolean;
}

// Liste des principales villes françaises
const POPULAR_CITIES = [
  "Paris",
  "Marseille",
  "Lyon",
  "Toulouse",
  "Nice",
  "Nantes",
  "Strasbourg",
  "Montpellier",
  "Bordeaux",
  "Lille",
  "Rennes",
  "Reims",
];

export default function LocationDisplay({
  onCitySelect,
  className = "",
  displayMode = "badge",
  showSelector = true,
}: LocationDisplayProps) {
  const { latitude, longitude, city, country, loading, error } = useGeolocation();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    if (city && !selectedCity) {
      setSelectedCity(city);
      if (onCitySelect) onCitySelect(city);
    }
  }, [city, onCitySelect, selectedCity]);

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    if (onCitySelect) onCitySelect(value);
  };

  // Afficher uniquement l'icône
  if (displayMode === "icon") {
    return (
      <div className={`text-primary ${className}`}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
      </div>
    );
  }

  // Afficher sous forme de badge
  if (displayMode === "badge") {
    return (
      <Badge variant="secondary" className={`flex items-center gap-1 ${className}`}>
        {loading ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-xs">Localisation...</span>
          </>
        ) : error ? (
          <>
            <MapPin className="h-3 w-3" />
            <span className="text-xs">Lieu inconnu</span>
          </>
        ) : (
          <>
            <MapPin className="h-3 w-3" />
            <span className="text-xs">{selectedCity || city || "Lieu inconnu"}</span>
          </>
        )}
      </Badge>
    );
  }

  // Afficher texte uniquement
  if (displayMode === "text") {
    return (
      <div className={`text-sm text-muted-foreground ${className}`}>
        {loading ? (
          "Localisation en cours..."
        ) : error ? (
          "Lieu inconnu"
        ) : (
          selectedCity || city || "Lieu inconnu"
        )}
      </div>
    );
  }

  // Affichage complet avec sélecteur
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary mr-1" />
        ) : (
          <MapPin className="h-4 w-4 text-primary mr-1" />
        )}
        <span className="text-sm font-medium">
          {selectedCity || city || "Lieu inconnu"}
        </span>
      </div>

      {showSelector && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2">
              Changer
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Sélectionner une ville</h4>
              <Select value={selectedCity || ""} onValueChange={handleCityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une ville" />
                </SelectTrigger>
                <SelectContent>
                  {city && !POPULAR_CITIES.includes(city) && (
                    <SelectItem value={city}>{city} (votre position)</SelectItem>
                  )}
                  {POPULAR_CITIES.map((cityName) => (
                    <SelectItem key={cityName} value={cityName}>
                      {cityName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Les événements à proximité seront affichés en priorité
              </p>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}