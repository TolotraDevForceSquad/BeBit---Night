/**
 * Calcule la distance (en km) entre deux points géographiques en utilisant la formule haversine
 * @param lat1 Latitude du premier point
 * @param lon1 Longitude du premier point
 * @param lat2 Latitude du deuxième point
 * @param lon2 Longitude du deuxième point
 * @returns La distance en kilomètres
 */
export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance en km
  return distance;
}

/**
 * Convertit les degrés en radians
 * @param deg Angle en degrés
 * @returns Angle en radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Formate une distance en km en texte lisible
 * @param distance Distance en km
 * @returns Texte formaté
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)} km`;
  } else {
    return `${Math.round(distance)} km`;
  }
}

/**
 * Trie un tableau d'événements par distance par rapport à un point géographique
 * @param events Tableau d'événements avec latitude et longitude
 * @param userLat Latitude de l'utilisateur
 * @param userLon Longitude de l'utilisateur
 * @returns Tableau d'événements trié par distance croissante
 */
export function sortEventsByDistance<T extends { latitude?: number | null; longitude?: number | null }>(
  events: T[],
  userLat?: number | null,
  userLon?: number | null
): T[] {
  // Si les coordonnées de l'utilisateur ne sont pas disponibles, retourner le tableau non trié
  if (!userLat || !userLon) return events;
  
  return [...events].sort((a, b) => {
    // Si un événement n'a pas de coordonnées, le placer à la fin
    if (!a.latitude || !a.longitude) return 1;
    if (!b.latitude || !b.longitude) return -1;
    
    const distanceA = getDistanceFromLatLonInKm(userLat, userLon, a.latitude, a.longitude);
    const distanceB = getDistanceFromLatLonInKm(userLat, userLon, b.latitude, b.longitude);
    
    return distanceA - distanceB;
  });
}

/**
 * Filtrer les événements par ville
 * @param events Tableau d'événements avec une propriété city
 * @param city Ville à rechercher
 * @returns Tableau d'événements filtrés
 */
export function filterEventsByCity<T extends { city?: string | null }>(
  events: T[],
  city?: string | null
): T[] {
  if (!city) return events;
  
  return events.filter((event) => 
    event.city && event.city.toLowerCase() === city.toLowerCase()
  );
}

/**
 * Trie les événements en plaçant ceux de la ville spécifiée en premier
 * @param events Tableau d'événements avec une propriété city
 * @param city Ville à prioriser
 * @returns Tableau d'événements trié
 */
export function prioritizeEventsByCity<T extends { city?: string | null }>(
  events: T[],
  city?: string | null
): T[] {
  if (!city) return events;
  
  return [...events].sort((a, b) => {
    const aInCity = a.city && a.city.toLowerCase() === city.toLowerCase();
    const bInCity = b.city && b.city.toLowerCase() === city.toLowerCase();
    
    if (aInCity && !bInCity) return -1;
    if (!aInCity && bInCity) return 1;
    return 0;
  });
}