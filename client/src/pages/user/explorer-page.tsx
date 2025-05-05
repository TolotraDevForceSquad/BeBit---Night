import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/layouts/DashboardLayout";
import EventCard from "@/components/EventCard";
import ArtistCard from "@/components/ArtistCard";
import ClubCard from "@/components/ClubCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Search, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UserExplorerPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  // Categories for filtering
  const eventCategories = ["Tous", "House", "Techno", "Hip-Hop", "Jazz", "Live Music", "EDM", "R&B"];

  // Fetch events
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/events", activeCategory !== "Tous" ? activeCategory : null],
  });

  // Fetch trending artists
  const { data: artists, isLoading: artistsLoading } = useQuery({
    queryKey: ["/api/artists/trending"],
  });

  // Fetch popular clubs
  const { data: clubs, isLoading: clubsLoading } = useQuery({
    queryKey: ["/api/clubs/popular"],
  });

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <DashboardLayout activeItem="explorer">
      <div className="p-4 md:p-8 animate-fade-in">
        {/* Header with search and filters */}
        <div className="md:flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold mb-4 md:mb-0">Explorer les événements</h2>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full md:w-64 bg-card border border-border rounded-full px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
            
            <Button variant="outline" className="bg-card hover:bg-muted border border-border rounded-full px-4 py-2 text-sm flex items-center">
              <Filter className="mr-2 h-4 w-4 text-secondary" />
              <span>Filtres</span>
            </Button>
          </div>
        </div>
        
        {/* Category filter */}
        <CategoryFilter 
          categories={eventCategories} 
          activeCategory={activeCategory} 
          onChange={handleCategoryChange} 
        />
        
        {/* Events grid */}
        {eventsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-card rounded-2xl overflow-hidden border border-border">
                <Skeleton className="w-full h-48" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-3" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Aucun événement trouvé.</p>
          </div>
        )}
        
        {/* Trending Artists Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-heading font-bold mb-6 flex items-center">
            <i className="fas fa-star text-secondary mr-2"></i>
            <span>Artistes en Tendance</span>
          </h2>
          
          {artistsLoading ? (
            <div className="flex space-x-4 py-2 overflow-x-auto scrollbar-hide">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex-shrink-0 w-36 text-center">
                  <Skeleton className="w-24 h-24 mx-auto rounded-full mb-2" />
                  <Skeleton className="h-4 w-20 mx-auto mb-1" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
              ))}
            </div>
          ) : artists && artists.length > 0 ? (
            <ScrollArea className="w-full">
              <div className="flex space-x-4 py-2">
                {artists.map((artist, index) => (
                  <ArtistCard 
                    key={artist.id} 
                    artist={artist} 
                    featured={index < 2} 
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Aucun artiste trouvé.</p>
            </div>
          )}
        </div>
        
        {/* Popular Clubs */}
        <div className="mt-10">
          <h2 className="text-2xl font-heading font-bold mb-6 flex items-center">
            <i className="fas fa-building text-primary mr-2"></i>
            <span>Clubs Populaires</span>
          </h2>
          
          {clubsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-card rounded-xl overflow-hidden p-4">
                  <div className="flex items-center">
                    <Skeleton className="w-16 h-16 rounded-xl mr-4" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-3 w-24 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="w-10 h-10 rounded-full ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : clubs && clubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Aucun club trouvé.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
