// Utilitaire pour gérer les couleurs et effets basés sur l'humeur/ambiance des événements

// Type pour les différentes ambiances possibles
export type EventMood = 'energetic' | 'chill' | 'romantic' | 'dark' | 'festive' | undefined;

// Interface pour les propriétés de style d'une ambiance
export interface MoodStyle {
  background: string;           // Dégradé ou couleur de fond
  textColor: string;            // Couleur du texte principal
  secondaryTextColor: string;   // Couleur du texte secondaire
  accentColor: string;          // Couleur d'accent pour les boutons, icônes, etc.
  overlayOpacity: number;       // Opacité de la superposition
  animation?: string;           // Animation CSS optionnelle
  filterEffect?: string;        // Effets de filtre CSS optionnels
}

// Mapping des styles pour chaque ambiance
export const moodStyles: Record<NonNullable<EventMood>, MoodStyle> = {
  energetic: {
    background: 'linear-gradient(135deg, #FF4D4D 0%, #F9CB28 100%)',
    textColor: '#FFFFFF',
    secondaryTextColor: 'rgba(255, 255, 255, 0.8)',
    accentColor: '#00FFFF',
    overlayOpacity: 0.15,
    animation: 'pulse 3s infinite',
    filterEffect: 'saturate(1.2)'
  },
  chill: {
    background: 'linear-gradient(135deg, #5E95E2 0%, #41B3A3 100%)',
    textColor: '#FFFFFF',
    secondaryTextColor: 'rgba(255, 255, 255, 0.8)',
    accentColor: '#E8D26B',
    overlayOpacity: 0.2,
    filterEffect: 'saturate(0.9)'
  },
  romantic: {
    background: 'linear-gradient(135deg, #FF758C 0%, #FF7EB3 100%)',
    textColor: '#FFFFFF',
    secondaryTextColor: 'rgba(255, 255, 255, 0.9)',
    accentColor: '#FFC2D1',
    overlayOpacity: 0.25,
    filterEffect: 'contrast(0.95) brightness(1.05)'
  },
  dark: {
    background: 'linear-gradient(135deg, #2C3E50 0%, #1A1A2E 100%)',
    textColor: '#FFFFFF',
    secondaryTextColor: 'rgba(255, 255, 255, 0.7)',
    accentColor: '#FF5E3A',
    overlayOpacity: 0.3,
    filterEffect: 'contrast(1.1) brightness(0.9)'
  },
  festive: {
    background: 'linear-gradient(135deg, #6A3093 0%, #A044FF 100%)',
    textColor: '#FFFFFF',
    secondaryTextColor: 'rgba(255, 255, 255, 0.8)',
    accentColor: '#FFD700',
    overlayOpacity: 0.2,
    animation: 'colorShift 10s infinite alternate',
    filterEffect: 'saturate(1.3)'
  }
};

// Fonction pour obtenir le style d'une ambiance
export function getMoodStyle(mood: EventMood): MoodStyle {
  // Si l'ambiance n'est pas définie, utiliser une ambiance par défaut (energetic)
  return mood ? moodStyles[mood] : moodStyles.energetic;
}

// Fonction pour générer les styles CSS pour un élément basé sur l'ambiance
export function getMoodStyleObject(mood: EventMood): React.CSSProperties {
  const style = getMoodStyle(mood);
  
  return {
    background: style.background,
    color: style.textColor,
    animationName: style.animation ? style.animation.split(' ')[0] : undefined,
    // Les autres propriétés d'animation seraient définies dans les classes CSS
  };
}

// Fonction pour générer une classe CSS basée sur l'ambiance
export function getMoodClassName(mood: EventMood): string {
  return mood ? `mood-${mood}` : 'mood-energetic';
}

// Fonction pour obtenir une couleur d'arrière-plan simplifiée pour des éléments plus petits
export function getMoodBackgroundColor(mood: EventMood): string {
  switch (mood) {
    case 'energetic': return '#FF4D4D';
    case 'chill': return '#5E95E2';
    case 'romantic': return '#FF758C';
    case 'dark': return '#2C3E50';
    case 'festive': return '#6A3093';
    default: return '#FF4D4D';
  }
}