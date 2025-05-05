import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMobile } from "@/hooks/use-mobile";
import { Event } from "@shared/schema";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import MobileEventCard from "@/components/MobileEventCard";
import EventCard from "@/components/EventCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Filter, Bell, Ticket } from "lucide-react";
import { useLocation } from "wouter";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
};

export default function UserExplorerPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [location, navigate] = useLocation();
  
  // Récupérer les données utilisateur du localStorage
  useEffect(() => {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setUser(userData);
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
        navigate('/auth');
      }
    } else {
      navigate('/auth');
    }
  }, [navigate]);
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState("découvrir");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", activeCategory, searchQuery],
    queryFn: async () => {
      const url = new URL("/api/events", window.location.origin);
      
      if (activeCategory && activeCategory !== "all") {
        url.searchParams.append("category", activeCategory);
      }
      
      if (searchQuery) {
        url.searchParams.append("search", searchQuery);
      }
      
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Erreur lors de la récupération des événements");
      return await res.json();
    },
  });

  // Dummy categories for now
  const categories = ["all", "House", "Techno", "Hip-Hop", "Jazz", "Funk", "EDM"];

  // Header content for the layout
  const headerContent = (
    <div className="w-full flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg text-white">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
      </h1>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
            3
          </Badge>
        </Button>
        
        <Button variant="ghost" size="icon">
          <Ticket className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  // Sidebar content for desktop
  const sidebarContent = (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-medium mb-3">Catégories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              className="mr-2 mb-2"
              onClick={() => setActiveCategory(category)}
            >
              {category === "all" ? "Tous" : category}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-medium mb-3">Artistes Tendance</h3>
        <div className="space-y-3">
          {["DJ Elektra", "MC Blaze", "Luna Ray"].map((artist) => (
            <div key={artist} className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                {artist.charAt(0)}
              </div>
              <span>{artist}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveLayout
      activeItem="home"
      headerContent={headerContent}
      sidebarContent={sidebarContent}
    >
      {/* Mobile search and filters */}
      {isMobile && (
        <div className="mb-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher des événements..."
              className="pl-9 bg-muted border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <CategoryFilter
              categories={categories.map(c => c === 'all' ? 'Tous' : c)}
              activeCategory={activeCategory === 'all' ? 'Tous' : activeCategory}
              onChange={(category) => setActiveCategory(category === 'Tous' ? 'all' : category)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="découvrir" className="flex-1">Découvrir</TabsTrigger>
              <TabsTrigger value="tendances" className="flex-1">Tendances</TabsTrigger>
              <TabsTrigger value="nearby" className="flex-1">À proximité</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
      
      {/* Desktop search and title */}
      {!isMobile && (
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Explorez les événements</h1>
            <p className="text-muted-foreground">
              Découvrez les meilleurs événements et artistes près de chez vous
            </p>
          </div>
          
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher des événements..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {/* Empty state */}
      {events && events.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">
            Aucun événement trouvé
          </h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos filtres ou votre recherche
          </p>
        </div>
      )}
      
      {/* Mobile event cards (TikTok style) */}
      {isMobile && events && events.length > 0 && (
        <div className="space-y-4">
          {activeTab === "découvrir" && (
            <MobileEventCard event={events[0]} />
          )}
          {activeTab === "tendances" && events.length > 1 && (
            <MobileEventCard event={events[1]} />
          )}
          {activeTab === "nearby" && events.length > 2 && (
            <MobileEventCard event={events[2]} />
          )}
        </div>
      )}
      
      {/* Desktop event grid */}
      {!isMobile && events && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </ResponsiveLayout>
  );
}