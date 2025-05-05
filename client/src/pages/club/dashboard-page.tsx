import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Users, Music, BarChart2, Wallet, QrCode } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { AreaChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, BarChart } from "recharts";

export default function ClubDashboardPage() {
  const { user } = useAuth();

  // Fetch upcoming events
  const { data: clubEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/clubs/events/upcoming", user?.id],
  });

  // Fetch artists
  const { data: artists, isLoading: artistsLoading } = useQuery({
    queryKey: ["/api/artists"],
  });

  // Fetch statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/clubs/statistics", user?.id],
  });

  return (
    <DashboardLayout activeItem="dashboard">
      <div className="p-4 md:p-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Tableau de Bord Club</h1>
            <p className="text-muted-foreground">Bienvenue, {user?.username}!</p>
          </div>
          
          <Button className="mt-4 md:mt-0 bg-primary hover:bg-primary/90">
            <QrCode className="mr-2 h-4 w-4" />
            Scanner QR Code
          </Button>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Événements à venir</p>
                {eventsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{clubEvents?.length || 0}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-secondary/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total participants</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.totalParticipants || 0}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-[#7c3aed]/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <BarChart2 className="h-6 w-6 text-[#7c3aed]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.averageRating || "N/A"}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-[#f59e0b]/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Wallet className="h-6 w-6 text-[#f59e0b]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Portefeuille</p>
                <p className="text-2xl font-bold">{user?.walletBalance || 0}€</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Content Tabs */}
        <Tabs defaultValue="events">
          <TabsList className="mb-6">
            <TabsTrigger value="events">Événements</TabsTrigger>
            <TabsTrigger value="artists">Artistes</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          </TabsList>
          
          {/* Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Vos événements</CardTitle>
                <Button size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Créer un événement
                </Button>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 border border-border rounded-lg flex items-center">
                        <Skeleton className="w-12 h-12 rounded-lg mr-4" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-48 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="w-24 h-10 rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : clubEvents && clubEvents.length > 0 ? (
                  <div className="space-y-4">
                    {clubEvents.map((event) => (
                      <div key={event.id} className="p-4 border border-border hover:border-primary rounded-lg flex items-center transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mr-4 overflow-hidden">
                          <img 
                            src={event.coverImage} 
                            alt={event.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('fr-FR')} • {event.startTime} - {event.endTime}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="text-sm mr-4">
                            <span className="text-muted-foreground">Participants:</span>
                            <span className="ml-1 font-medium">{event.participantCount}/{event.capacity}</span>
                          </div>
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun événement programmé.</p>
                    <Button className="mt-4">Créer votre premier événement</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Artists Tab */}
          <TabsContent value="artists">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Artistes disponibles</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Music className="mr-2 h-4 w-4" />
                    Par genre
                  </Button>
                  <Button size="sm">
                    Inviter un artiste
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {artistsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center mb-3">
                          <Skeleton className="w-12 h-12 rounded-full mr-3" />
                          <div>
                            <Skeleton className="h-5 w-28 mb-1" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-full mb-2" />
                        <div className="flex justify-between mt-3">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="w-24 h-8 rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : artists && artists.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {artists.map((artist) => (
                      <div key={artist.id} className="p-4 border border-border hover:border-primary rounded-lg transition-colors">
                        <div className="flex items-center mb-3">
                          <div className="w-12 h-12 rounded-full bg-muted mr-3 overflow-hidden">
                            <img 
                              src={artist.profileImage} 
                              alt={artist.displayName} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{artist.displayName}</h4>
                            <p className="text-xs text-muted-foreground">{artist.genre}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {artist.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Tarif:</span>
                            <span className="ml-1 font-medium">{artist.rate}€/h</span>
                          </div>
                          <Button size="sm">Inviter</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun artiste disponible pour le moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fréquentation</CardTitle>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="w-full h-80 flex items-center justify-center">
                      <Skeleton className="w-full h-full" />
                    </div>
                  ) : stats?.attendanceData ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={stats.attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                        <XAxis dataKey="date" stroke="#5C5C5C" />
                        <YAxis stroke="#5C5C5C" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1A1A1A', 
                            borderColor: '#2D2D2D',
                            color: '#FFFFFF'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#FE2C55" 
                          fill="#FE2C55" 
                          fillOpacity={0.2} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-80">
                      <p className="text-muted-foreground">Données insuffisantes</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Genres populaires</CardTitle>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="w-full h-80 flex items-center justify-center">
                      <Skeleton className="w-full h-full" />
                    </div>
                  ) : stats?.genreData ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.genreData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                        <XAxis dataKey="name" stroke="#5C5C5C" />
                        <YAxis stroke="#5C5C5C" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1A1A1A', 
                            borderColor: '#2D2D2D',
                            color: '#FFFFFF'
                          }} 
                        />
                        <Bar dataKey="value" fill="#25F4EE" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-80">
                      <p className="text-muted-foreground">Données insuffisantes</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Avis récents</CardTitle>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-4 border border-border rounded-lg">
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center">
                              <Skeleton className="w-8 h-8 rounded-full mr-2" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ))}
                    </div>
                  ) : stats?.reviews && stats.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {stats.reviews.map((review) => (
                        <div key={review.id} className="p-4 border border-border hover:border-primary rounded-lg transition-colors">
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full mr-2 overflow-hidden">
                                <img 
                                  src={review.user.profileImage} 
                                  alt={review.user.username} 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <span className="font-medium text-sm">{review.user.username}</span>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <i 
                                  key={i} 
                                  className={`fas fa-star text-xs ${i < review.rating ? 'text-yellow-500' : 'text-gray-500'}`}
                                ></i>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm">{review.comment}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Pour: {review.event.title} • {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Aucun avis pour le moment.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
