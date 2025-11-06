import { Artist } from "@shared/schema";
import { Play } from "lucide-react";

interface ArtistCardProps {
  artist: Artist;
  featured?: boolean;
}

export default function ArtistCard({ artist, featured = false }: ArtistCardProps) {
  return (
    <div className="flex-shrink-0 w-36 text-center">
      <div className={`w-24 h-24 mx-auto rounded-full border-2 ${featured ? 'border-primary' : featured === false ? 'border-secondary' : 'border-border'} p-1 mb-2 group relative`}>
        <img 
          src={artist.profileImage} 
          alt={artist.username} 
          className="rounded-full w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 to-secondary/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="font-medium">{artist.displayName}</div>
      <div className="text-xs text-muted-foreground">{artist.genre}</div>
    </div>
  );
}
