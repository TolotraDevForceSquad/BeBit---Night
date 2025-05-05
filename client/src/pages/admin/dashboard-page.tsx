import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Users, Music, Building2, Ban, PieChart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { AreaChart, BarChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Fetch platform statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  // Fetch latest events
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/admin/events/latest"],
  });

  // Fetch users requiring moderation
  const { data: moderationUsers, isLoading: moderationLoading } = useQuery({
    queryKey: ["/api/admin/moderation/users"],
  });

  return (
    <DashboardLayout activeItem="dashboard">
      <div className="p-4 md:p-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Administration</h1>
            <p className="text-muted-foreground">Vue d'ensemble de la plateforme</p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Période
            </Button>
            <Button>
              Exporter
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Utilisateurs</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.userCount || 0}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-secondary/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Music className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Artistes</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.artistCount || 0}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-[#7c3aed]/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Building2 className="h-6 w-6 text-[#7c3aed]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clubs</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.clubCount || 0}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-[#f59e0b]/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-[#f59e0b]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Événements</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.eventCount || 0}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs inscrits</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="w-full h-80 flex items-center justify-center">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : stats?.userGrowthData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stats.userGrowthData}>
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
                      dataKey="count" 
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
              <CardTitle>Revenus par type d'événement</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="w-full h-80 flex items-center justify-center">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : stats?.revenueByGenre ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.revenueByGenre}>
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
        </div>
        
        {/* Content Tabs */}
        <Tabs defaultValue="events">
          <TabsList className="mb-6">
            <TabsTrigger value="events">Événements à modérer</TabsTrigger>
            <TabsTrigger value="accounts">Comptes à vérifier</TabsTrigger>
          </TabsList>
          
          {/* Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Événements en attente de modération</CardTitle>
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
                        <div className="flex space-x-2">
                          <Skeleton className="w-24 h-10 rounded-lg" />
                          <Skeleton className="w-24 h-10 rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : events && events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event) => (
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
                            {new Date(event.date).toLocaleDateString('fr-FR')} • {event.venueName}, {event.location}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="destructive" size="sm">
                            <Ban className="mr-2 h-4 w-4" />
                            Rejeter
                          </Button>
                          <Button size="sm">
                            Approuver
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun événement à modérer.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Accounts Tab */}
          <TabsContent value="accounts">
            <Card>
              <CardHeader>
                <CardTitle>Comptes en attente de vérification</CardTitle>
              </CardHeader>
              <CardContent>
                {moderationLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 border border-border rounded-lg flex items-center">
                        <Skeleton className="w-12 h-12 rounded-full mr-4" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-32 mb-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex space-x-2">
                          <Skeleton className="w-24 h-10 rounded-lg" />
                          <Skeleton className="w-24 h-10 rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : moderationUsers && moderationUsers.length > 0 ? (
                  <div className="space-y-4">
                    {moderationUsers.map((user) => (
                      <div key={user.id} className="p-4 border border-border hover:border-primary rounded-lg flex items-center transition-colors">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4 overflow-hidden">
                          {user.profileImage ? (
                            <img 
                              src={user.profileImage} 
                              alt={user.username} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <span className="text-lg font-bold">{user.username.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{user.username}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {user.role} • Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="destructive" size="sm">
                            Bannir
                          </Button>
                          <Button size="sm">
                            Vérifier
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun compte à vérifier.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
