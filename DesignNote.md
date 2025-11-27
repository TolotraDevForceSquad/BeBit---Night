### Palette officielle à réutiliser partout
## Design Color

| Usage                          | Code Hex       | Niveau d’usage       |
|--------------------------------|----------------|----------------------|
| Couleur primaire (boutons principaux, accents) | #fe2f58       | Principal / Call-to-action |
| Couleur primaire hover/active  | #e02e50        | Survol / état actif  |
| Fond de page principal         | #18181b        | Fond global          |
| Fond des cartes / surfaces     | #18181b       | Cartes, modales      |
| Fond "muted" (zones secondaires) | #1f1f23     | Sections calmes      |
| Texte principal (titres, noms) | #ffffff        | Blanc                |
| Texte secondaire / labels     | #d1d5db        | Gris clair           |
| Texte désactivé / très léger   | #9ca3af        | Gris moyen           |
| Disponible                     | #22c55e        | Vert succès          |
| Indisponible                   | #dc2626        | Rouge danger         |
| Badge "Vérifié" (contour & texte) | #3B82F6    | Bleu vérification    |
| Étoiles de notation            | #fbbf24        | Jaune doré           |
| Bordures légères / séparateurs | #374151        | Gris foncé           |
| Ombre des cartes (soft shadow) | rgba(0, 0, 0, 0.3) | Ombre foncée     |


## UI :
client\src\components\ui
client\src\components\ui\accordion.tsx
client\src\components\ui\alert-dialog.tsx
client\src\components\ui\alert.tsx
client\src\components\ui\aspect-ratio.tsx
client\src\components\ui\avatar.tsx
client\src\components\ui\badge.tsx
client\src\components\ui\breadcrumb.tsx
client\src\components\ui\button.tsx
client\src\components\ui\calendar.tsx
client\src\components\ui\card.tsx
client\src\components\ui\carousel.tsx
client\src\components\ui\chart.tsx
client\src\components\ui\checkbox.tsx
client\src\components\ui\collapsible.tsx
client\src\components\ui\command.tsx
client\src\components\ui\context-menu.tsx
client\src\components\ui\date-picker.tsx
client\src\components\ui\dialog.tsx
client\src\components\ui\drawer.tsx
client\src\components\ui\dropdown-menu.tsx
client\src\components\ui\form.tsx
client\src\components\ui\hover-card.tsx
client\src\components\ui\input-otp.tsx
client\src\components\ui\input.tsx
client\src\components\ui\label.tsx
client\src\components\ui\menubar.tsx
client\src\components\ui\navigation-menu.tsx
client\src\components\ui\pagination.tsx
client\src\components\ui\popover.tsx
client\src\components\ui\progress.tsx
client\src\components\ui\radio-group.tsx
client\src\components\ui\resizable.tsx
client\src\components\ui\scroll-area.tsx
client\src\components\ui\select.tsx
client\src\components\ui\separator.tsx
client\src\components\ui\sheet.tsx
client\src\components\ui\sidebar.tsx
client\src\components\ui\skeleton.tsx
client\src\components\ui\slider.tsx
client\src\components\ui\switch.tsx
client\src\components\ui\table.tsx
client\src\components\ui\tabs.tsx
client\src\components\ui\textarea.tsx
client\src\components\ui\toast.tsx
client\src\components\ui\toaster.tsx
client\src\components\ui\toggle-group.tsx
client\src\components\ui\toggle.tsx
client\src\components\ui\tooltip.tsx

## Composant
Utilisation de ScrollArea pour tous les scrolls
import { toast } from '@/hooks/use-toast';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});