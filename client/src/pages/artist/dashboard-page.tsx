import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Users, Mail, Star, Wallet, QrCode } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function ArtistDashboardPage() {
  const { user } = useAuth();

  // Fetch upcoming events
  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/artists/events/upcoming", user?.id],
  });

  // Fetch pending invitations
  const { data: invitations, isLoading: invitationsLoading } = useQuery({
    queryKey: ["/api/artists/invitations", user?.id],
  });

  // Fetch recent feedback
  const { data: feedback, isLoading: feedbackLoading } = useQuery({
    queryKey: ["/api/artists/feedback", user?.id],
  });

  return (
    <DashboardLayout activeItem="dashboard">
      <div className="p-4 md:p-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Tableau de Bord Artiste</h1>
            <p className="text-muted-foreground">Bienvenue, {user?.username}!</p>
          </div>
          
          <Button className="mt-4 md:mt-0 bg-primary hover:bg-primary/90">
            <QrCode className="mr-2 h-4 w-4" />
            Mon QR Code
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
                  <p className="text-2xl font-bold">{upcomingEvents?.length || 0}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-secondary/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Mail className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invitations</p>
                {invitationsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{invitations?.length || 0}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-[#7c3aed]/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Star className="h-6 w-6 text-[#7c3aed]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
                {feedbackLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">4.8/5</p>
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
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Événements à venir</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="feedback">Feedbacks récents</TabsTrigger>
          </TabsList>
          
          {/* Upcoming Events Tab */}
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Vos prochains événements</CardTitle>
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
                ) : upcomingEvents && upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
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
                            {new Date(event.date).toLocaleDateString('fr-FR')} • {event.venueName}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Voir les détails
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun événement à venir.</p>
                    <Button variant="outline" className="mt-4">Trouver des opportunités</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Invitations Tab */}
          <TabsContent value="invitations">
            <Card>
              <CardHeader>
                <CardTitle>Invitations de clubs</CardTitle>
              </CardHeader>
              <CardContent>
                {invitationsLoading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center mb-3">
                          <Skeleton className="w-10 h-10 rounded-full mr-3" />
                          <div>
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-full mb-4" />
                        <div className="flex justify-end space-x-2">
                          <Skeleton className="w-24 h-10 rounded-lg" />
                          <Skeleton className="w-24 h-10 rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : invitations && invitations.length > 0 ? (
                  <div className="space-y-4">
                    {invitations.map((invitation) => (
                      <div key={invitation.id} className="p-4 border border-border hover:border-primary rounded-lg transition-colors">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full mr-3 overflow-hidden">
                            <img 
                              src={invitation.club.profileImage} 
                              alt={invitation.club.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{invitation.club.name}</h4>
                            <p className="text-xs text-muted-foreground">{invitation.club.city}, {invitation.club.country}</p>
                          </div>
                        </div>
                        <p className="text-sm mb-4">{invitation.message}</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-muted-foreground">Rémunération proposée:</span>
                            <span className="ml-2 font-medium text-primary">{invitation.fee}€</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Refuser</Button>
                            <Button size="sm">Accepter</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucune invitation pour le moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Feedbacks reçus</CardTitle>
              </CardHeader>
              <CardContent>
                {feedbackLoading ? (
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
                ) : feedback && feedback.length > 0 ? (
                  <div className="space-y-4">
                    {feedback.map((item) => (
                      <div key={item.id} className="p-4 border border-border hover:border-primary rounded-lg transition-colors">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full mr-2 overflow-hidden">
                              <img 
                                src={item.user.profileImage} 
                                alt={item.user.username} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <span className="font-medium text-sm">{item.user.username}</span>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={`fas fa-star text-xs ${i < item.rating ? 'text-yellow-500' : 'text-gray-500'}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">{item.comment}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Pour: {item.event.title} • {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun feedback pour le moment.</p>
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
