import React, { useState } from 'react';
import ResponsiveLayout from '../../layouts/ResponsiveLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Calendar, Check, Plus, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const TableReservationPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [floorView, setFloorView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newReservationOpen, setNewReservationOpen] = useState(false);
  
  // Données fictives pour les réservations
  const upcomingReservations = [
    { id: 1, name: "Thomas Dubois", date: "15/07/2025", time: "21:30", guests: 4, zone: "VIP", table: "V3", status: "confirmed", phone: "+261 34 67 890 12", email: "thomas@example.com", notes: "Anniversaire - bouteille de champagne préparée" },
    { id: 2, name: "Marie Laurent", date: "17/07/2025", time: "22:00", guests: 8, zone: "Terrasse", table: "T5", status: "pending", phone: "+261 33 45 678 90", email: "marie@example.com", notes: "" },
    { id: 3, name: "Pierre Moreau", date: "22/07/2025", time: "23:00", guests: 6, zone: "Intérieur", table: "I8", status: "confirmed", phone: "+261 32 56 789 01", email: "pierre@example.com", notes: "Près de la scène" },
    { id: 4, name: "Sophie Martin", date: "24/07/2025", time: "20:30", guests: 2, zone: "Bar", table: "B2", status: "confirmed", phone: "+261 33 12 345 67", email: "sophie@example.com", notes: "" },
    { id: 5, name: "Jean Petit", date: "25/07/2025", time: "21:00", guests: 4, zone: "Terrasse", table: "T2", status: "pending", phone: "+261 34 23 456 78", email: "jean@example.com", notes: "Allergie aux fruits de mer" },
  ];

  const pastReservations = [
    { id: 101, name: "Luc Bernard", date: "05/07/2025", time: "22:00", guests: 5, zone: "VIP", table: "V1", status: "completed", phone: "+261 33 78 901 23", email: "luc@example.com", notes: "" },
    { id: 102, name: "Emma Roux", date: "04/07/2025", time: "20:30", guests: 3, zone: "Intérieur", table: "I4", status: "completed", phone: "+261 32 89 012 34", email: "emma@example.com", notes: "" },
    { id: 103, name: "Marc Dupuis", date: "01/07/2025", time: "21:30", guests: 6, zone: "Terrasse", table: "T6", status: "completed", phone: "+261 34 90 123 45", email: "marc@example.com", notes: "" },
    { id: 104, name: "Julie Lemoine", date: "28/06/2025", time: "23:00", guests: 2, zone: "Bar", table: "B5", status: "no_show", phone: "+261 33 01 234 56", email: "julie@example.com", notes: "" },
    { id: 105, name: "Paul Girard", date: "27/06/2025", time: "22:30", guests: 7, zone: "Intérieur", table: "I1", status: "completed", phone: "+261 32 12 345 67", email: "paul@example.com", notes: "VIP - Artiste" },
  ];

  const cancelledReservations = [
    { id: 201, name: "Nicolas Blanc", date: "10/07/2025", time: "21:00", guests: 4, zone: "VIP", table: "V2", status: "cancelled", phone: "+261 34 23 456 78", email: "nicolas@example.com", notes: "Annulé pour raisons personnelles" },
    { id: 202, name: "Camille Petit", date: "12/07/2025", time: "22:30", guests: 5, zone: "Terrasse", table: "T3", status: "cancelled", phone: "+261 33 34 567 89", email: "camille@example.com", notes: "Reporté au mois prochain" },
  ];

  // Fonction pour obtenir le statut formaté
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Confirmée</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">En attente</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">Annulée</span>;
      case 'completed':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">Terminée</span>;
      case 'no_show':
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">Non présenté</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">{status}</span>;
    }
  };

  const renderReservationTable = (reservations: any[]) => (
    <div className="relative overflow-x-auto rounded-md border">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
          <tr>
            <th scope="col" className="px-4 py-3">Client</th>
            <th scope="col" className="px-4 py-3">Date</th>
            <th scope="col" className="px-4 py-3">Heure</th>
            <th scope="col" className="px-4 py-3">Personnes</th>
            <th scope="col" className="px-4 py-3">Zone</th>
            <th scope="col" className="px-4 py-3">Table</th>
            <th scope="col" className="px-4 py-3">Statut</th>
            <th scope="col" className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(reservation => (
            <tr key={reservation.id} className="bg-card border-b hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{reservation.name}</td>
              <td className="px-4 py-3">{reservation.date}</td>
              <td className="px-4 py-3">{reservation.time}</td>
              <td className="px-4 py-3">{reservation.guests}</td>
              <td className="px-4 py-3">{reservation.zone}</td>
              <td className="px-4 py-3">{reservation.table}</td>
              <td className="px-4 py-3">
                {getStatusBadge(reservation.status)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="p-1 rounded-md hover:bg-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Détails de la réservation</DialogTitle>
                        <DialogDescription>Réservation #{reservation.id}</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Client</Label>
                            <div className="font-medium">{reservation.name}</div>
                          </div>
                          <div>
                            <Label>Status</Label>
                            <div>{getStatusBadge(reservation.status)}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Date</Label>
                            <div>{reservation.date}</div>
                          </div>
                          <div>
                            <Label>Heure</Label>
                            <div>{reservation.time}</div>
                          </div>
                          <div>
                            <Label>Personnes</Label>
                            <div>{reservation.guests}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Zone</Label>
                            <div>{reservation.zone}</div>
                          </div>
                          <div>
                            <Label>Table</Label>
                            <div>{reservation.table}</div>
                          </div>
                        </div>
                        <div>
                          <Label>Contact</Label>
                          <div>{reservation.phone}</div>
                          <div>{reservation.email}</div>
                        </div>
                        {reservation.notes && (
                          <div>
                            <Label>Notes</Label>
                            <div className="text-muted-foreground">{reservation.notes}</div>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        {reservation.status === 'pending' && (
                          <div className="flex space-x-2 mr-auto">
                            <Button variant="outline" size="sm" className="flex items-center">
                              <X className="mr-1 h-4 w-4" /> Refuser
                            </Button>
                            <Button size="sm" className="flex items-center">
                              <Check className="mr-1 h-4 w-4" /> Confirmer
                            </Button>
                          </div>
                        )}
                        <Button variant="outline">Fermer</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <button className="p-1 rounded-md hover:bg-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Plan des tables
  const renderFloorPlan = () => (
    <div className="relative h-[500px] border rounded-lg bg-muted/20 p-4">
      {/* En-tête avec date et titre */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Plan des tables - {selectedDate.split('-').reverse().join('/')}</h3>
        <div className="flex space-x-2">
          <Input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          <Button onClick={() => setNewReservationOpen(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-1" /> Nouvelle réservation
          </Button>
        </div>
      </div>
      
      {/* Légende */}
      <div className="bg-card border rounded-md p-2 flex space-x-4 mb-4">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-green-200 mr-1"></div>
          <span className="text-xs">Disponible</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-red-200 mr-1"></div>
          <span className="text-xs">Réservée</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-yellow-200 mr-1"></div>
          <span className="text-xs">En attente</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-slate-200 mr-1"></div>
          <span className="text-xs">Indisponible</span>
        </div>
      </div>
      
      {/* Conteneur de plan */}
      <div className="grid grid-cols-3 gap-4 h-[400px]">
        {/* Zone VIP */}
        <div className="border rounded-md bg-card p-3">
          <h4 className="font-medium mb-2 pb-1 border-b">Zone VIP</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="aspect-square bg-green-200 rounded-md flex items-center justify-center cursor-pointer hover:ring-2 ring-primary">
              <div className="text-center">
                <div className="font-medium">V1</div>
                <div className="text-xs">4 pers.</div>
              </div>
            </div>
            <div className="aspect-square bg-red-200 rounded-md flex items-center justify-center cursor-pointer hover:ring-2 ring-primary">
              <div className="text-center">
                <div className="font-medium">V2</div>
                <div className="text-xs">6 pers.</div>
                <div className="text-xs text-muted-foreground">21:00</div>
              </div>
            </div>
            <div className="aspect-square bg-red-200 rounded-md flex items-center justify-center cursor-pointer hover:ring-2 ring-primary">
              <div className="text-center">
                <div className="font-medium">V3</div>
                <div className="text-xs">4 pers.</div>
                <div className="text-xs text-muted-foreground">21:30</div>
              </div>
            </div>
            <div className="aspect-square bg-green-200 rounded-md flex items-center justify-center cursor-pointer hover:ring-2 ring-primary">
              <div className="text-center">
                <div className="font-medium">V4</div>
                <div className="text-xs">8 pers.</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Zone Terrasse */}
        <div className="border rounded-md bg-card p-3">
          <h4 className="font-medium mb-2 pb-1 border-b">Terrasse</h4>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={`t-${i+1}`}
                className={`aspect-square ${i === 2 || i === 4 ? 'bg-red-200' : i === 1 ? 'bg-yellow-200' : 'bg-green-200'} rounded-md flex items-center justify-center cursor-pointer hover:ring-2 ring-primary`}
              >
                <div className="text-center">
                  <div className="font-medium">T{i+1}</div>
                  <div className="text-xs">4 pers.</div>
                  {(i === 2 || i === 4) && <div className="text-xs text-muted-foreground">22:00</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Zone Intérieur */}
        <div className="border rounded-md bg-card p-3">
          <h4 className="font-medium mb-2 pb-1 border-b">Intérieur</h4>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={`i-${i+1}`}
                className={`aspect-square ${i === 7 ? 'bg-red-200' : i === 0 || i === 5 ? 'bg-slate-200' : 'bg-green-200'} rounded-md flex items-center justify-center cursor-pointer hover:ring-2 ring-primary`}
              >
                <div className="text-center">
                  <div className="font-medium">I{i+1}</div>
                  <div className="text-xs">{i < 6 ? '2' : '4'} pers.</div>
                  {i === 7 && <div className="text-xs text-muted-foreground">23:00</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Zone Bar */}
        <div className="border rounded-md bg-card p-3">
          <h4 className="font-medium mb-2 pb-1 border-b">Bar</h4>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={`b-${i+1}`}
                className={`aspect-square ${i === 1 ? 'bg-red-200' : 'bg-green-200'} rounded-md flex items-center justify-center cursor-pointer hover:ring-2 ring-primary`}
              >
                <div className="text-center">
                  <div className="font-medium">B{i+1}</div>
                  <div className="text-xs">2 pers.</div>
                  {i === 1 && <div className="text-xs text-muted-foreground">20:30</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Réservations de tables</h1>
            <p className="text-lg text-muted-foreground">
              Gérez les réservations de tables de votre établissement
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={floorView ? "outline" : "default"} 
              onClick={() => setFloorView(false)}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              Liste
            </Button>
            <Button 
              variant={floorView ? "default" : "outline"} 
              onClick={() => setFloorView(true)}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
              Plan des tables
            </Button>
            <Button onClick={() => setNewReservationOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Nouvelle réservation
            </Button>
          </div>
        </div>
        
        {floorView ? (
          renderFloorPlan()
        ) : (
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <Tabs defaultValue="upcoming" onValueChange={setSelectedTab} className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="upcoming">À venir</TabsTrigger>
                  <TabsTrigger value="past">Passées</TabsTrigger>
                  <TabsTrigger value="cancelled">Annulées</TabsTrigger>
                </TabsList>
                
                <div className="flex space-x-2">
                  <div className="relative w-[250px]">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-4 h-4 text-muted-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                    </div>
                    <Input 
                      type="search" 
                      className="w-full p-2 pl-10 text-sm border border-input rounded-lg bg-background" 
                      placeholder="Rechercher un client..." 
                    />
                  </div>
                  
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="confirmed">Confirmées</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="cancelled">Annulées</SelectItem>
                      <SelectItem value="completed">Terminées</SelectItem>
                      <SelectItem value="no_show">Non présentées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TabsContent value="upcoming">
                {renderReservationTable(upcomingReservations)}
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Affichage des réservations 1 à {upcomingReservations.length} sur {upcomingReservations.length}
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" disabled>Précédent</Button>
                    <Button variant="default" size="sm">1</Button>
                    <Button variant="outline" size="sm" disabled>Suivant</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="past">
                {renderReservationTable(pastReservations)}
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Affichage des réservations 1 à {pastReservations.length} sur {pastReservations.length}
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" disabled>Précédent</Button>
                    <Button variant="default" size="sm">1</Button>
                    <Button variant="outline" size="sm" disabled>Suivant</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="cancelled">
                {renderReservationTable(cancelledReservations)}
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Affichage des réservations 1 à {cancelledReservations.length} sur {cancelledReservations.length}
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" disabled>Précédent</Button>
                    <Button variant="default" size="sm">1</Button>
                    <Button variant="outline" size="sm" disabled>Suivant</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Statistiques des réservations</CardTitle>
              <CardDescription>Derniers 30 jours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Total</div>
                  <div className="text-2xl font-bold">154</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Confirmées</div>
                  <div className="text-2xl font-bold">112</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">En attente</div>
                  <div className="text-2xl font-bold">32</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Annulées</div>
                  <div className="text-2xl font-bold">10</div>
                </div>
              </div>
              
              <div className="h-[200px] flex items-end space-x-2">
                {/* Bar chart simulation */}
                {Array.from({ length: 30 }).map((_, i) => {
                  const height = Math.floor(Math.random() * 80) + 10;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center group">
                      <div className="w-full bg-primary h-[1px] mb-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className={`w-full bg-primary hover:bg-primary/80 transition-colors rounded-t-sm`} style={{ height: `${height}%` }}></div>
                      <div className="text-xs mt-1">{(i + 1) % 5 === 0 ? i + 1 : ''}</div>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-center mt-1 text-muted-foreground">Jour du mois</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Configuration des tables</CardTitle>
              <CardDescription>Aperçu des zones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/40 border rounded-md">
                  <div>
                    <div className="font-medium">Terrasse</div>
                    <div className="text-xs text-muted-foreground">8 tables, 32 places</div>
                  </div>
                  <Button variant="ghost" size="sm">Modifier</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/40 border rounded-md">
                  <div>
                    <div className="font-medium">Intérieur</div>
                    <div className="text-xs text-muted-foreground">12 tables, 48 places</div>
                  </div>
                  <Button variant="ghost" size="sm">Modifier</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/40 border rounded-md">
                  <div>
                    <div className="font-medium">VIP</div>
                    <div className="text-xs text-muted-foreground">4 tables, 16 places</div>
                  </div>
                  <Button variant="ghost" size="sm">Modifier</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/40 border rounded-md">
                  <div>
                    <div className="font-medium">Bar</div>
                    <div className="text-xs text-muted-foreground">6 tables, 18 places</div>
                  </div>
                  <Button variant="ghost" size="sm">Modifier</Button>
                </div>
              </div>
              
              <Button className="w-full mt-4 flex items-center justify-center">
                <Plus className="h-4 w-4 mr-1" /> Ajouter une zone
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Modal pour nouvelle réservation */}
      <Dialog open={newReservationOpen} onOpenChange={setNewReservationOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Nouvelle réservation</DialogTitle>
            <DialogDescription>
              Créez une nouvelle réservation de table
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du client</Label>
                <Input id="name" placeholder="Nom complet" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" placeholder="+261 34 XX XXX XX" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@example.com" />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Heure</Label>
                <Input id="time" type="time" defaultValue="20:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests">Personnes</Label>
                <Input id="guests" type="number" min="1" max="20" defaultValue="2" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Zone</Label>
              <RadioGroup defaultValue="terrasse" className="flex space-x-2">
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="terrasse" id="terrasse" />
                  <Label htmlFor="terrasse">Terrasse</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="interieur" id="interieur" />
                  <Label htmlFor="interieur">Intérieur</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="vip" id="vip" />
                  <Label htmlFor="vip">VIP</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="bar" id="bar" />
                  <Label htmlFor="bar">Bar</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" placeholder="Notes spéciales" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewReservationOpen(false)}>Annuler</Button>
            <Button onClick={() => setNewReservationOpen(false)}>Créer la réservation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ResponsiveLayout>
  );
};

export default TableReservationPage;