import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: GeolocationState = {
  latitude: null,
  longitude: null,
  city: null,
  country: null,
  loading: true,
  error: null,
};

// Liste des villes avec leurs coordonnées (pour le reverse geocoding simplifié)
const CITIES = [
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'Lyon', country: 'France', lat: 45.7640, lng: 4.8357 },
  { name: 'Marseille', country: 'France', lat: 43.2965, lng: 5.3698 },
  { name: 'Bordeaux', country: 'France', lat: 44.8378, lng: -0.5792 },
  { name: 'Lille', country: 'France', lat: 50.6329, lng: 3.0581 },
  { name: 'Toulouse', country: 'France', lat: 43.6047, lng: 1.4442 },
  { name: 'Nice', country: 'France', lat: 43.7102, lng: 7.2620 },
  { name: 'Nantes', country: 'France', lat: 47.2184, lng: -1.5536 },
  { name: 'Strasbourg', country: 'France', lat: 48.5734, lng: 7.7521 },
  { name: 'Rennes', country: 'France', lat: 48.1173, lng: -1.6778 },
  { name: 'Reims', country: 'France', lat: 49.2583, lng: 4.0318 },
  { name: 'Montpellier', country: 'France', lat: 43.6119, lng: 3.8772 },
];

// Fonction utilitaire pour calculer la distance entre deux points
function getDistanceFromLatLon(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Fonction qui trouve la ville la plus proche des coordonnées données
function findNearestCity(lat: number, lng: number): { city: string; country: string } {
  let minDistance = Number.MAX_VALUE;
  let nearestCity = CITIES[0];

  for (const city of CITIES) {
    const distance = getDistanceFromLatLon(lat, lng, city.lat, city.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  }

  return { city: nearestCity.name, country: nearestCity.country };
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(initialState);

  // Détection de la ville à partir de l'API de géolocalisation du navigateur
  useEffect(() => {
    // Vérifier si la géolocalisation est disponible
    if (!navigator.geolocation) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: 'La géolocalisation n\'est pas supportée par votre navigateur',
      }));
      return;
    }

    // Récupérer les coordonnées de l'utilisateur
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const { city, country } = findNearestCity(latitude, longitude);

        setState({
          latitude,
          longitude,
          city,
          country,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error: `Erreur de géolocalisation: ${error.message}`,
        }));
        
        // En cas d'erreur, utiliser une position par défaut (Paris)
        const defaultLocation = CITIES[0];
        setState({
          latitude: defaultLocation.lat,
          longitude: defaultLocation.lng,
          city: defaultLocation.name,
          country: defaultLocation.country,
          loading: false,
          error: null,
        });
      },
      {
        enableHighAccuracy: false, // Haute précision non nécessaire
        timeout: 5000, // Timeout après 5 secondes
        maximumAge: 0, // Ne pas utiliser de cache
      }
    );
  }, []);

  return state;
}