import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import ResponsiveLayout from "../../layouts/ResponsiveLayout";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  ChevronUp,
  ChevronDown,
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Wine,
  Ticket,
  Music,
  Activity,
  Utensils,
  Clock,
  Star,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  Download
} from 'lucide-react';

// Types pour les graphiques
interface SalesData {
  name: string;
  value: number;
  fill?: string;
}

interface TimeSeriesData {
  date: string;
  revenue: number;
  visitors: number;
  reservations: number;
}

// Données fictives pour la BI
const currentMonthSales = 12750000; // en Ariary
const lastMonthSales = 10250000;
const salesGrowth = ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100;

const currentMonthVisitors = 3245;
const lastMonthVisitors = 2870;
const visitorsGrowth = ((currentMonthVisitors - lastMonthVisitors) / lastMonthVisitors) * 100;

const currentMonthReservations = 142;
const lastMonthReservations = 118;
const reservationsGrowth = ((currentMonthReservations - lastMonthReservations) / lastMonthReservations) * 100;

const salesByCategory: SalesData[] = [
  { name: 'Boissons', value: 5400000, fill: '#8884d8' },
  { name: 'Cocktails', value: 3800000, fill: '#82ca9d' },
  { name: 'Entrées', value: 1200000, fill: '#ffc658' },
  { name: 'Nourriture', value: 1750000, fill: '#ff8042' },
  { name: 'Événements', value: 600000, fill: '#0088fe' }
];

const customerSegments: SalesData[] = [
  { name: 'Réguliers', value: 55, fill: '#0088FE' },
  { name: 'Occasionnels', value: 30, fill: '#00C49F' },
  { name: 'Nouveaux', value: 15, fill: '#FFBB28' }
];

const timeOfDay: SalesData[] = [
  { name: 'Matin (9h-12h)', value: 5, fill: '#FFDA83' },
  { name: 'Après-midi (12h-18h)', value: 25, fill: '#8DD1E1' },
  { name: 'Soirée (18h-22h)', value: 45, fill: '#A4DE6C' },
  { name: 'Nuit (22h-2h)', value: 25, fill: '#FF6B6B' }
];

const dailyVisits: TimeSeriesData[] = [
  { date: 'Lun', revenue: 120000, visitors: 180, reservations: 5 },
  { date: 'Mar', revenue: 150000, visitors: 220, reservations: 8 },
  { date: 'Mer', revenue: 160000, visitors: 280, reservations: 10 },
  { date: 'Jeu', revenue: 270000, visitors: 395, reservations: 15 },
  { date: 'Ven', revenue: 380000, visitors: 520, reservations: 25 },
  { date: 'Sam', revenue: 480000, visitors: 620, reservations: 42 },
  { date: 'Dim', revenue: 210000, visitors: 320, reservations: 12 }
];

const monthlyTrends: TimeSeriesData[] = Array.from({ length: 12 }).map((_, i) => {
  const month = new Date(0, i).toLocaleDateString('fr-FR', { month: 'short' });
  const baseVisitors = [2200, 2300, 2500, 2700, 2900, 3100, 3000, 2800, 2600, 2700, 2900, 3100][i];
  const multiplier = [0.9, 0.85, 0.95, 1.05, 1.1, 1.2, 1.3, 1.25, 1.2, 1.1, 1.15, 1.25][i];
  
  return {
    date: month,
    revenue: Math.round(baseVisitors * 500 * multiplier),
    visitors: Math.round(baseVisitors * multiplier),
    reservations: Math.round(baseVisitors * 0.04 * multiplier)
  };
});

// Top produits
const topProducts = [
  { name: 'Mojito', category: 'Cocktails', sales: 387, revenue: 1548000 },
  { name: 'Burger Classique', category: 'Nourriture', sales: 245, revenue: 1225000 },
  { name: 'Vodka Redbull', category: 'Boissons', sales: 213, revenue: 852000 },
  { name: 'Planche Mixte', category: 'Entrées', sales: 189, revenue: 756000 },
  { name: 'Piña Colada', category: 'Cocktails', sales: 156, revenue: 624000 }
];

// Crénaux horaires de réservation
const reservationSlots = [
  { time: '18:00', count: 15, percentage: 10 },
  { time: '19:00', count: 32, percentage: 22 },
  { time: '20:00', count: 48, percentage: 34 },
  { time: '21:00', count: 30, percentage: 21 },
  { time: '22:00', count: 18, percentage: 13 }
];

// Zones par popularité
const popularAreas = [
  { area: 'Terrasse', tables: 8, occupancyRate: 85, averageRevenue: 24500 },
  { area: 'Bar', tables: 6, occupancyRate: 92, averageRevenue: 18500 },
  { area: 'Intérieur', tables: 12, occupancyRate: 65, averageRevenue: 28000 },
  { area: 'VIP', tables: 4, occupancyRate: 78, averageRevenue: 45000 }
];

// Formats monétaires
const formatCurrency = (value: number) => {
  return (value/100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

const BIDashboardPage = () => {
  const [timeRange, setTimeRange] = useState('this_month');
  const [chartType, setChartType] = useState('daily');
  
  // Fonction pour afficher la tendance avec couleur
  const renderTrend = (value: number) => {
    const isPositive = value > 0;
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
        {isPositive ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
        <span>{Math.abs(value).toFixed(1)}%</span>
      </div>
    );
  };
  
  return (
    <ResponsiveLayout>
      <div className="p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Intelligence d'Affaires</h1>
            <p className="text-lg text-muted-foreground mt-1">Analysez les performances de votre établissement</p>
          </div>
          
          <div className="flex mt-4 lg:mt-0 space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="yesterday">Hier</SelectItem>
                <SelectItem value="this_week">Cette semaine</SelectItem>
                <SelectItem value="last_week">Semaine dernière</SelectItem>
                <SelectItem value="this_month">Ce mois-ci</SelectItem>
                <SelectItem value="last_month">Mois dernier</SelectItem>
                <SelectItem value="custom">Personnalisé...</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Indicateurs clés de performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Chiffre d'affaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{formatCurrency(currentMonthSales)}</div>
                {renderTrend(salesGrowth)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">vs mois précédent</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Visiteurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{currentMonthVisitors.toLocaleString()}</div>
                {renderTrend(visitorsGrowth)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">vs mois précédent</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{currentMonthReservations}</div>
                {renderTrend(reservationsGrowth)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">vs mois précédent</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tendances des revenus et fréquentation</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant={chartType === 'daily' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setChartType('daily')}
                  >
                    Journalier
                  </Button>
                  <Button 
                    variant={chartType === 'monthly' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setChartType('monthly')}
                  >
                    Mensuel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartType === 'daily' ? dailyVisits : monthlyTrends}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      name="Revenus"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="visitors"
                      name="Visiteurs"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Répartition des ventes</CardTitle>
              <CardDescription>Par catégorie de produits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Affluence par période</CardTitle>
              <CardDescription>Distribution des clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeOfDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Bar dataKey="value" name="Pourcentage" radius={[4, 4, 0, 0]}>
                      {timeOfDay.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Onglets d'analyse détaillée */}
        <Tabs defaultValue="products" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="products" className="flex items-center">
              <Wine className="h-4 w-4 mr-2" />
              Produits
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Réservations
            </TabsTrigger>
            <TabsTrigger value="areas" className="flex items-center">
              <Utensils className="h-4 w-4 mr-2" />
              Zones
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Produits les plus vendus</CardTitle>
                <CardDescription>Top 5 des produits par chiffre d'affaires</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-medium">Produit</th>
                        <th className="text-left py-3 font-medium">Catégorie</th>
                        <th className="text-right py-3 font-medium">Quantité</th>
                        <th className="text-right py-3 font-medium">Chiffre d'affaires</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((product, index) => (
                        <tr 
                          key={index} 
                          className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3">{product.name}</td>
                          <td className="py-3">
                            <Badge variant="outline">{product.category}</Badge>
                          </td>
                          <td className="py-3 text-right">{product.sales}</td>
                          <td className="py-3 text-right font-medium">{formatCurrency(product.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button variant="outline" size="sm">
                  Voir tous les produits
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="reservations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Créneaux de réservation</CardTitle>
                  <CardDescription>Répartition des réservations par heure</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reservationSlots}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip formatter={(value: any, name: any) => name === 'count' ? `${value} réservations` : `${value}%`} />
                        <Legend />
                        <Bar dataKey="count" name="Nombre de réservations" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Analyse des réservations</CardTitle>
                  <CardDescription>Statistiques détaillées sur les réservations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">Taux de conversion des réservations</div>
                        <div className="font-bold">87%</div>
                      </div>
                      <div className="bg-muted h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '87%' }}></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">87% des réservations se présentent</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">Délai moyen de réservation</div>
                        <div className="font-bold">3.2 jours</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Réservations effectuées en moyenne 3.2 jours avant</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">Taille moyenne des groupes</div>
                        <div className="font-bold">4.3 personnes</div>
                      </div>
                      <div className="text-xs text-muted-foreground">La majorité des réservations sont pour 4 personnes</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">Revenus moyens par réservation</div>
                        <div className="font-bold">{formatCurrency(8500000)}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Tendance à la hausse (+12% ce mois-ci)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="areas">
            <Card>
              <CardHeader>
                <CardTitle>Performance par zone</CardTitle>
                <CardDescription>Analyse détaillée par emplacement dans l'établissement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-medium">Zone</th>
                        <th className="text-center py-3 font-medium">Tables</th>
                        <th className="text-center py-3 font-medium">Taux d'occupation</th>
                        <th className="text-right py-3 font-medium">Revenu moyen/table</th>
                      </tr>
                    </thead>
                    <tbody>
                      {popularAreas.map((area, index) => (
                        <tr 
                          key={index} 
                          className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3">{area.area}</td>
                          <td className="py-3 text-center">{area.tables}</td>
                          <td className="py-3 text-center">
                            <div className="flex items-center justify-center">
                              <span className={
                                area.occupancyRate > 80 ? 'text-green-600 dark:text-green-500' : 
                                area.occupancyRate > 60 ? 'text-yellow-600 dark:text-yellow-500' :
                                'text-red-600 dark:text-red-500'
                              }>
                                {area.occupancyRate}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-right font-medium">{formatCurrency(area.averageRevenue * 100)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Optimisation des zones</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg border">
                      <div className="flex items-start">
                        <TrendingUp className="h-5 w-5 mr-2 text-green-600 dark:text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Opportunité : Terrasse</h4>
                          <p className="text-sm text-muted-foreground">
                            Fort taux d'occupation (85%). Envisagez d'augmenter les prix ou d'ajouter plus de tables.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted rounded-lg border">
                      <div className="flex items-start">
                        <TrendingUp className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Attention : Intérieur</h4>
                          <p className="text-sm text-muted-foreground">
                            Taux d'occupation modéré (65%). Envisagez d'améliorer l'expérience ou de proposer des offres spéciales.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Informations prédictives */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Prévisions et recommandations intelligentes
            </CardTitle>
            <CardDescription>
              Basées sur l'analyse des tendances et des données historiques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-medium text-blue-800 dark:text-blue-400 mb-1">Prévisions de fréquentation</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Hausse attendue de 18% ce week-end par rapport à la moyenne. Prévoyez du personnel supplémentaire.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h3 className="font-medium text-purple-800 dark:text-purple-400 mb-1">Opportunités de revenu</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    La catégorie Cocktails montre une marge supérieure de 35%. Envisagez une promotion sur les cocktails signature.
                  </p>
                </div>
                
                <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h3 className="font-medium text-amber-800 dark:text-amber-400 mb-1">Alerte inventaire</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Les ingrédients pour Mojito risquent d'être en rupture d'ici vendredi. Commandez du rhum et de la menthe.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-medium text-green-800 dark:text-green-400 mb-1">Recommandation marketing</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Les publications Instagram entre 18h et 20h génèrent 40% plus d'engagement. Planifiez vos posts en conséquence.
                  </p>
                </div>
                
                <div className="p-4 bg-pink-50 dark:bg-pink-950 rounded-lg border border-pink-200 dark:border-pink-800">
                  <h3 className="font-medium text-pink-800 dark:text-pink-400 mb-1">Tendances de réservation</h3>
                  <p className="text-sm text-pink-700 dark:text-pink-300">
                    85% des réservations sont faites en ligne. Optimisez votre présence sur les plateformes de réservation.
                  </p>
                </div>
                
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <h3 className="font-medium text-indigo-800 dark:text-indigo-400 mb-1">Fidélisation clients</h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">
                    Les clients récurrents dépensent en moyenne 35% de plus. Lancez un programme de fidélité pour augmenter le taux de retour.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default BIDashboardPage;