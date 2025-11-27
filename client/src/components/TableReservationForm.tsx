import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, Users, ChevronDown, Check } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

// Définir le type de données pour les zones de tables
type TableArea = {
  id: string;
  name: string;
  description: string;
  minCapacity: number;
  maxCapacity: number;
  basePrice: number;
  available: boolean;
  image?: string;
};

// Définir les types de données pour les propriétés du formulaire
interface TableReservationFormProps {
  clubId: number;
  clubName: string;
  tableAreas: TableArea[];
  onReservationComplete?: (data: ReservationFormData) => void;
  className?: string;
}

// Schema de validation pour le formulaire
const reservationFormSchema = z.object({
  date: z.date({
    required_error: "Veuillez sélectionner une date.",
  }),
  time: z.string({
    required_error: "Veuillez sélectionner une heure.",
  }),
  tableArea: z.string({
    required_error: "Veuillez choisir une zone.",
  }),
  guestCount: z.coerce.number().min(1, {
    message: "Le nombre de personnes doit être supérieur à 0.",
  }),
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  phone: z.string().min(10, {
    message: "Veuillez entrer un numéro de téléphone valide.",
  }),
  specialRequests: z.string().optional(),
});

// Type pour les données du formulaire
type ReservationFormData = z.infer<typeof reservationFormSchema>;

// Les heures disponibles pour la réservation
const availableTimes = [
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", 
  "23:00", "23:30", "00:00", "00:30", "01:00", "01:30", "02:00"
];

export function TableReservationForm({ 
  clubId, 
  clubName, 
  tableAreas,
  onReservationComplete,
  className 
}: TableReservationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Définir le formulaire avec validation
  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      date: undefined,
      time: "",
      tableArea: "",
      guestCount: 1,
      name: "",
      email: "",
      phone: "",
      specialRequests: "",
    },
  });
  
  // Obtenir la zone de table sélectionnée
  const selectedTableAreaId = form.watch("tableArea");
  const selectedTableArea = tableAreas.find(area => area.id === selectedTableAreaId);
  
  // Obtenir le nombre d'invités
  const guestCount = form.watch("guestCount");
  
  // Calculer le prix estimé
  const calculateEstimatedPrice = (): number => {
    if (!selectedTableArea || !guestCount) return 0;
    
    // Prix de base de la zone + supplément par personne au-delà du minimum
    let price = selectedTableArea.basePrice;
    const extraGuests = Math.max(0, guestCount - selectedTableArea.minCapacity);
    const extraCost = extraGuests * 5000; // 5 000 Ar par personne supplémentaire
    
    return price + extraCost;
  };
  
  // Gérer la soumission du formulaire
  const onSubmit = (data: ReservationFormData) => {
    setIsSubmitting(true);
    
    // Simuler une requête API
    setTimeout(() => {
      console.log("Données de réservation:", data);
      
      // Afficher un toast de confirmation
      toast({
        title: "Réservation envoyée !",
        description: `Votre demande de réservation pour le ${format(data.date, 'dd MMMM yyyy', { locale: fr })} à ${data.time} a été envoyée au club.`,
        variant: "default",
      });
      
      // Réinitialiser le formulaire
      form.reset();
      
      // Appeler le callback si fourni
      if (onReservationComplete) {
        onReservationComplete(data);
      }
      
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Réserver une table</CardTitle>
        <CardDescription>
          Réservez une table au {clubName} pour votre prochaine sortie
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sélection de la date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "EEEE d MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Les réservations sont disponibles jusqu'à 2 mois à l'avance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Sélection de l'heure */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une heure" />
                          <Clock className="h-4 w-4 opacity-50" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Heures de réservation disponibles de 20h à 2h du matin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Sélection de la zone de table */}
            <FormField
              control={form.control}
              name="tableArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone de table</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une zone" />
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tableAreas
                        .filter(area => area.available)
                        .map((area) => (
                          <SelectItem key={area.id} value={area.id} className="flex items-center py-2">
                            <div>
                              <div className="font-medium">{area.name}</div>
                              <div className="text-xs text-muted-foreground">{area.description}</div>
                              <div className="text-xs mt-1">
                                <Badge variant="outline" className="mr-1">
                                  {area.minCapacity}-{area.maxCapacity} pers.
                                </Badge>
                                <Badge variant="secondary">
                                  {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(area.basePrice).replace('MGA', 'Ar')}
                                </Badge>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {selectedTableArea && (
                    <div className="mt-2 p-3 bg-muted/50 rounded-md">
                      <div className="font-medium">{selectedTableArea.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedTableArea.description}</div>
                      <div className="mt-1 flex items-center text-sm">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        <span>{selectedTableArea.minCapacity} à {selectedTableArea.maxCapacity} personnes</span>
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Nombre de personnes */}
            <FormField
              control={form.control}
              name="guestCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de personnes</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="Combien de personnes?"
                        className="pl-10"
                        min={selectedTableArea ? selectedTableArea.minCapacity : 1}
                        max={selectedTableArea ? selectedTableArea.maxCapacity : 20}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  {selectedTableArea && guestCount > 0 && (
                    <FormDescription>
                      Cette zone accepte entre {selectedTableArea.minCapacity} et {selectedTableArea.maxCapacity} personnes.
                      {guestCount > selectedTableArea.minCapacity && (
                        <span> Un supplément de 5 000 Ar par personne s'applique au-delà de {selectedTableArea.minCapacity} personnes.</span>
                      )}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Prix estimé */}
            {selectedTableArea && guestCount > 0 && guestCount >= selectedTableArea.minCapacity && guestCount <= selectedTableArea.maxCapacity && (
              <div className="bg-primary/10 p-4 rounded-md">
                <h4 className="font-medium mb-1">Prix estimé</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Réservation de base ({selectedTableArea.name})</span>
                    <span>
                      {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(selectedTableArea.basePrice).replace('MGA', 'Ar')}
                    </span>
                  </div>
                  
                  {guestCount > selectedTableArea.minCapacity && (
                    <div className="flex justify-between">
                      <span>Supplément ({guestCount - selectedTableArea.minCapacity} pers. × 5 000 Ar)</span>
                      <span>
                        {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format((guestCount - selectedTableArea.minCapacity) * 5000).replace('MGA', 'Ar')}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t pt-1 mt-1 font-medium flex justify-between">
                    <span>Total estimé</span>
                    <span>
                      {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(calculateEstimatedPrice()).replace('MGA', 'Ar')}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Coordonnées */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Vos coordonnées</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Votre nom" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="034 xx xxx xx" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="votre@email.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demandes spéciales (facultatif)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Précisez vos demandes particulières ici..."
                        className="resize-none h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Demander une réservation
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex-col space-y-2 text-xs text-muted-foreground border-t pt-4">
        <p>Les réservations ne sont pas garanties avant confirmation du club.</p>
        <p>Un acompte peut être demandé pour confirmer votre réservation.</p>
        <p>Politique d'annulation : gratuite jusqu'à 24h avant l'événement, 50% du montant ensuite.</p>
      </CardFooter>
    </Card>
  );
}

export default TableReservationForm;