import { useState, useEffect } from "react";
import ClubLayout from "@/layouts/club-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SimpleClubDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simuler un chargement des données
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ClubLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Tableau de bord du Club</h1>
            
            <p className="text-muted-foreground">
              Bienvenue sur votre tableau de bord. Vous pouvez gérer vos événements, réservations et plus encore.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
                  <p>Vos statistiques seront affichées ici.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
                  <div className="space-y-2">
                    <Button className="w-full">Créer un événement</Button>
                    <Button variant="outline" className="w-full">Gérer les réservations</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </ClubLayout>
  );
}