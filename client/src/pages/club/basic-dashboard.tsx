import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BasicClubDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simple timer to simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Simple auth check
  useEffect(() => {
    const user = localStorage.getItem('auth_user');
    if (!user) {
      window.location.href = "/auth";
    } else {
      try {
        const userData = JSON.parse(user);
        if (userData.role !== 'club') {
          window.location.href = "/auth";
        }
      } catch (error) {
        window.location.href = "/auth";
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header with app name */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b p-3 flex items-center justify-center">
        <h1 className="font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Be bit.
        </h1>
      </div>
      
      {/* Content */}
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord du Club</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Stats Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold">10,520€</div>
                  <div className="text-sm text-muted-foreground">Revenus</div>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold">385</div>
                  <div className="text-sm text-muted-foreground">Billets vendus</div>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm text-muted-foreground">Événements</div>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold">4.7/5</div>
                  <div className="text-sm text-muted-foreground">Note</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Actions Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Actions</h2>
              <div className="space-y-2">
                <Button className="w-full" size="lg">Créer un événement</Button>
                <Button variant="outline" className="w-full" size="lg">Gérer les réservations</Button>
                <Button variant="outline" className="w-full" size="lg">Trouver des artistes</Button>
                <Button variant="outline" className="w-full" size="lg">Voir les participants</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Events Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Prochains événements</h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 border rounded-lg">
                <div className="h-16 w-16 rounded-md bg-cover bg-center flex-shrink-0 bg-primary/20"></div>
                <div className="flex-1">
                  <h3 className="font-medium">Soirée Techno avec DJ Elektra</h3>
                  <div className="text-sm text-muted-foreground">Samedi 15 décembre, 21h00</div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-sm">120 / 200 billets vendus</div>
                    <Button variant="outline" size="sm">Gérer</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 border rounded-lg">
                <div className="h-16 w-16 rounded-md bg-cover bg-center flex-shrink-0 bg-secondary/20"></div>
                <div className="flex-1">
                  <h3 className="font-medium">House Party avec MC Blaze</h3>
                  <div className="text-sm text-muted-foreground">Vendredi 22 décembre, 22h00</div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-sm">85 / 150 billets vendus</div>
                    <Button variant="outline" size="sm">Gérer</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Button variant="outline">Voir tous les événements</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; 2023 Be bit. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}