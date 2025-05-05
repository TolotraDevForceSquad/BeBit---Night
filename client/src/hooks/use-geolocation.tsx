import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    city: null,
    country: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Vérifier si la géolocalisation est stockée en localStorage
    const savedGeolocation = localStorage.getItem('user_geolocation');
    if (savedGeolocation) {
      try {
        const parsedGeo = JSON.parse(savedGeolocation);
        // Si les données sont récentes (moins de 24h), les utiliser
        const timestamp = localStorage.getItem('geolocation_timestamp');
        if (timestamp && Date.now() - parseInt(timestamp) < 86400000) { // 24h
          setGeolocation({
            ...parsedGeo,
            loading: false,
          });
          return;
        }
      } catch (error) {
        console.error("Erreur lors de la lecture des données de géolocalisation:", error);
      }
    }

    // Fonction pour obtenir la position de l'utilisateur
    const getPosition = () => {
      if (!navigator.geolocation) {
        setGeolocation({
          ...geolocation,
          loading: false,
          error: "La géolocalisation n'est pas prise en charge par votre navigateur"
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Utiliser le service Nominatim d'OpenStreetMap pour le reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fr`
            );
            const data = await response.json();
            
            const city = data.address.city || 
                         data.address.town || 
                         data.address.village || 
                         data.address.hamlet || 
                         "Ville inconnue";
            const country = data.address.country || "Pays inconnu";
            
            const locationData = {
              latitude,
              longitude,
              city,
              country,
              loading: false,
              error: null
            };
            
            // Sauvegarder dans localStorage
            localStorage.setItem('user_geolocation', JSON.stringify(locationData));
            localStorage.setItem('geolocation_timestamp', Date.now().toString());
            
            setGeolocation(locationData);
          } catch (error) {
            console.error("Erreur lors de la géolocalisation inversée:", error);
            setGeolocation({
              latitude,
              longitude,
              city: null,
              country: null,
              loading: false,
              error: "Impossible de déterminer votre emplacement précis"
            });
          }
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          let errorMessage = "Erreur lors de la récupération de votre position";
          
          if (error.code === 1) {
            errorMessage = "Vous avez refusé l'accès à votre position";
          } else if (error.code === 2) {
            errorMessage = "Votre position n'est pas disponible";
          } else if (error.code === 3) {
            errorMessage = "La requête a expiré";
          }
          
          setGeolocation({
            ...geolocation,
            loading: false,
            error: errorMessage
          });
          
          // En cas d'erreur, définir Paris comme emplacement par défaut pour la France
          const defaultLocation = {
            latitude: 48.8566,
            longitude: 2.3522,
            city: "Paris",
            country: "France",
            loading: false,
            error: errorMessage
          };
          
          localStorage.setItem('user_geolocation', JSON.stringify(defaultLocation));
          localStorage.setItem('geolocation_timestamp', Date.now().toString());
        },
        { 
          enableHighAccuracy: false, 
          timeout: 10000, 
          maximumAge: 86400000 // 24h
        }
      );
    };

    getPosition();
  }, []);

  return geolocation;
}