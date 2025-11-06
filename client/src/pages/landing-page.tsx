import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Music2, 
  Clock, 
  Map, 
  CalendarDays, 
  QrCode, 
  Wallet, 
  User, 
  ChevronRight 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full py-4 px-6 flex items-center justify-between bg-background/80 backdrop-blur-sm fixed top-0 z-50 border-b">
        <div className="flex items-center">
  <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
    Be bit.
  </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/auth">Connexion</Link>
          </Button>
          <Button asChild>
            <Link href="/auth?tab=register">S'inscrire</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full h-screen flex flex-col items-center justify-center pt-16 px-6 bg-gradient-to-b from-background to-background/80">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Découvre la vie nocturne avec{" "}
            <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
              Be bit.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            La première application qui connecte artistes, clubs et participants pour créer 
            des expériences nocturnes uniques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="h-14 px-8 text-lg">
              <Link href="/auth?tab=register">Rejoindre la communauté</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg">
              <Link href="#how-it-works">
                Comment ça marche <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-16">
            <div className="relative w-full max-w-3xl mx-auto">
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000"
                alt="Be bit app preview" 
                className="w-full aspect-video object-cover rounded-2xl shadow-2xl border border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-20 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Be bit. révolutionne l'expérience nocturne en connectant tous les acteurs de la vie nocturne.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Swipe & Match</h3>
              <p className="text-muted-foreground">
                Découvre des événements en faisant défiler comme sur TikTok et trouve des soirées qui correspondent à tes goûts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Géolocalisation</h3>
              <p className="text-muted-foreground">
                Trouve des événements à proximité et découvre la vie nocturne autour de toi.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Music2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Artistes & DJs</h3>
              <p className="text-muted-foreground">
                Suis tes artistes préférés et sois informé de leurs prochaines performances.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tickets Digitaux</h3>
              <p className="text-muted-foreground">
                Achète des tickets directement dans l'app et accède aux événements avec un simple QR code.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Portefeuille Virtuel</h3>
              <p className="text-muted-foreground">
                Gère ton budget soirée avec notre portefeuille intégré et suis tes dépenses.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Créer des Sorties</h3>
              <p className="text-muted-foreground">
                Organise tes propres sorties et invite tes amis à te rejoindre facilement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Pour tous les acteurs de la nuit</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une plateforme unique qui connecte les utilisateurs, artistes et établissements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* User Type 1 */}
            <div className="bg-background p-8 rounded-xl border border-border flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
                <User className="h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Utilisateurs</h3>
              <p className="text-muted-foreground mb-6">
                Découvre, réserve et profite des meilleures sorties. Crée tes propres événements et invite tes amis.
              </p>
              <ul className="space-y-2 text-left w-full mb-6">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2"></div>
                  Explorer les événements à proximité
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2"></div>
                  Réserver tables et tickets
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2"></div>
                  Organiser des sorties entre amis
                </li>
              </ul>
              <Button variant="outline" className="mt-auto" asChild>
                <Link href="/auth?tab=register">Rejoindre</Link>
              </Button>
            </div>

            {/* User Type 2 */}
            <div className="bg-background p-8 rounded-xl border border-border flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
                <Music2 className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Artistes</h3>
              <p className="text-muted-foreground mb-6">
                Gère ton agenda, reçois des invitations des clubs et construis ta fanbase.
              </p>
              <ul className="space-y-2 text-left w-full mb-6">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></div>
                  Recevoir des demandes de booking
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></div>
                  Gérer ton agenda de performances
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></div>
                  Développer ta visibilité
                </li>
              </ul>
              <Button variant="outline" className="mt-auto" asChild>
                <Link href="/auth?tab=register">Rejoindre</Link>
              </Button>
            </div>

            {/* User Type 3 */}
            <div className="bg-background p-8 rounded-xl border border-border flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Clubs & Lieux</h3>
              <p className="text-muted-foreground mb-6">
                Crée des événements, invite des artistes et gère les réservations de tables.
              </p>
              <ul className="space-y-2 text-left w-full mb-6">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                  Promouvoir vos événements
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                  Gérer les réservations de tables
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                  Inviter des artistes à performer
                </li>
              </ul>
              <Button variant="outline" className="mt-auto" asChild>
                <Link href="/auth?tab=register">Rejoindre</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-rose-500/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à vivre la nuit autrement ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Rejoins la communauté Be bit. dès maintenant et révolutionne ta vie nocturne.
          </p>
          <Button size="lg" className="h-14 px-8 text-lg" asChild>
            <Link href="/auth?tab=register">Créer un compte gratuitement</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-background border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                Be bit.
              </h2>
              <p className="text-muted-foreground mt-1">
                Révolutionne ta vie nocturne
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:items-center">
              <Link href="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
                Connexion
              </Link>
              <Link href="/auth?tab=register" className="text-muted-foreground hover:text-foreground transition-colors">
                Inscription
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                Comment ça marche
              </Link>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Be bit. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}