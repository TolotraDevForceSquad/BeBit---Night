import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { Progress } from "../../components/ui/progress";
import ResponsiveLayout from "../../layouts/ResponsiveLayout";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Award,
  Activity,
  EyeOff,
  Heart,
  Ticket,
  Wine,
  Music,
  Info,
  Coffee,
  Zap,
  Download
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// Types
interface SalesData {
  name: string;
  value: number;
  fill?: string;
}

interface RevenueData {
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

interface PerformanceData {
  time: string;
  value: number;
}

// Données fictives pour les graphiques
const revenueByCategory: SalesData[] = [
  { name: 'Entrées', value: 5400000, fill: '#8884d8' },
  { name: 'Boissons', value: 3800000, fill: '#82ca9d' },
  { name: 'VIP', value: 1800000, fill: '#ffc658' },
  { name: 'Réservations', value: 1200000, fill: '#ff8042' },
  { name: 'Merchandising', value: 600000, fill: '#0088fe' }
];

const visitorsByDemographic: SalesData[] = [
  { name: '18-24', value: 35, fill: '#8884d8' },
  { name: '25-34', value: 45, fill: '#82ca9d' },
  { name: '35-44', value: 15, fill: '#ffc658' },
  { name: '45+', value: 5, fill: '#ff8042' }
];

const monthlyRevenueData: TimeSeriesData[] = [
  { date: 'Jan', revenue: 2100000, visitors: 1200, reservations: 52 },
  { date: 'Fév', revenue: 2300000, visitors: 1350, reservations: 60 },
  { date: 'Mar', revenue: 2800000, visitors: 1500, reservations: 68 },
  { date: 'Avr', revenue: 3200000, visitors: 1800, reservations: 75 },
  { date: 'Mai', revenue: 4100000, visitors: 2100, reservations: 92 },
  { date: 'Juin', revenue: 5500000, visitors: 2800, reservations: 108 },
  { date: 'Juil', revenue: 8200000, visitors: 4200, reservations: 145 },
  { date: 'Août', revenue: 9800000, visitors: 5100, reservations: 160 },
  { date: 'Sep', revenue: 7200000, visitors: 3800, reservations: 125 },
  { date: 'Oct', revenue: 5800000, visitors: 3000, reservations: 98 },
  { date: 'Nov', revenue: 4500000, visitors: 2400, reservations: 85 },
  { date: 'Déc', revenue: 6800000, visitors: 3500, reservations: 115 }
];

const performanceByHour: PerformanceData[] = [
  { time: '20h', value: 20 },
  { time: '21h', value: 35 },
  { time: '22h', value: 65 },
  { time: '23h', value: 90 },
  { time: '00h', value: 100 },
  { time: '01h', value: 95 },
  { time: '02h', value: 80 },
  { time: '03h', value: 60 },
  { time: '04h', value: 40 },
  { time: '05h', value: 15 }
];

const popularProducts = [
  { name: 'Whisky', category: 'Alcool fort', sales: 680, revenue: 1360000, growth: 12 },
  { name: 'Vodka', category: 'Alcool fort', sales: 520, revenue: 1040000, growth: 8 },
  { name: 'Bière pression', category: 'Bière', sales: 1520, revenue: 912000, growth: -3 },
  { name: 'Champagne', category: 'Vin', sales: 240, revenue: 960000, growth: 24 },
  { name: 'Cocktail maison', category: 'Cocktail', sales: 420, revenue: 840000, growth: 18 }
];

const topEvents = [
  { name: 'Summer Night Party', date: '15/07/2025', attendance: 850, revenue: 4250000, capacityUtilization: 94 },
  { name: 'DJ Elektra Live', date: '22/08/2025', attendance: 920, revenue: 5520000, capacityUtilization: 98 },
  { name: 'Techno Revolution', date: '10/08/2025', attendance: 780, revenue: 3900000, capacityUtilization: 86 },
  { name: 'Jazz & Cocktails', date: '05/09/2025', attendance: 580, revenue: 2900000, capacityUtilization: 72 }
];

// Formatage monétaire
const formatCurrency = (value: number) => {
  return (value/100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

const BIDashboardPage = () => {
  const [timeRange, setTimeRange] = useState('yearly');
  const [chartType, setChartType] = useState('revenue');
  
  // Calculer le total des revenus pour l'année
  const totalRevenue = monthlyRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalVisitors = monthlyRevenueData.reduce((sum, item) => sum + item.visitors, 0);
  const totalReservations = monthlyRevenueData.reduce((sum, item) => sum + item.reservations, 0);
  
  // Calculer le pourcentage d'occupation moyen
  const averageOccupancyRate = topEvents.reduce((sum, event) => sum + event.capacityUtilization, 0) / topEvents.length;
  
  // Obtenir la tendance de croissance
  const revenueGrowth = 14.5; // Pourcentage de croissance
  const visitorGrowth = 18.2;
  const reservationGrowth = 9.6;
  
  return (
    <ResponsiveLayout>
      <div className="p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Business Intelligence</h1>
            <p className="text-lg text-muted-foreground mt-1">Analyse avancée des performances de votre établissement</p>
          </div>
          
          <div className="flex mt-4 lg:mt-0 space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Cette semaine</SelectItem>
                <SelectItem value="monthly">Ce mois</SelectItem>
                <SelectItem value="quarterly">Ce trimestre</SelectItem>
                <SelectItem value="yearly">Cette année</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
        
        {/* Cartes des KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Chiffre d'affaires total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                <div className={`flex items-center ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueGrowth >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span>{Math.abs(revenueGrowth)}%</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">vs période précédente</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Visiteurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{totalVisitors.toLocaleString()}</div>
                <div className={`flex items-center ${visitorGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {visitorGrowth >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span>{Math.abs(visitorGrowth)}%</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">vs période précédente</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{totalReservations}</div>
                <div className={`flex items-center ${reservationGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {reservationGrowth >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span>{Math.abs(reservationGrowth)}%</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">vs période précédente</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taux d'occupation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{averageOccupancyRate.toFixed(1)}%</div>
                <div className="text-green-600 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>5.2%</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">vs période précédente</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Évolution mensuelle</CardTitle>
                <div className="flex">
                  <Button
                    variant={chartType === 'revenue' ? 'default' : 'outline'}
                    size="sm"
                    className="mr-1"
                    onClick={() => setChartType('revenue')}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    CA
                  </Button>
                  <Button
                    variant={chartType === 'visitors' ? 'default' : 'outline'}
                    size="sm"
                    className="mr-1"
                    onClick={() => setChartType('visitors')}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Visiteurs
                  </Button>
                  <Button
                    variant={chartType === 'reservations' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('reservations')}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Réservations
                  </Button>
                </div>
              </div>
              <CardDescription>Tendance sur l'année {new Date().getFullYear()}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 w-full p-2">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'revenue' ? (
                    <AreaChart data={monthlyRevenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis
                        tickFormatter={(value) => formatCurrency(value).replace(' MGA', '')}
                      />
                      <Tooltip
                        formatter={(value: number) => [formatCurrency(value), 'Revenu']}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  ) : chartType === 'visitors' ? (
                    <AreaChart data={monthlyRevenueData}>
                      <defs>
                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="visitors"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorVisitors)"
                      />
                    </AreaChart>
                  ) : (
                    <AreaChart data={monthlyRevenueData}>
                      <defs>
                        <linearGradient id="colorReservations" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="reservations"
                        stroke="#ffc658"
                        fillOpacity={1}
                        fill="url(#colorReservations)"
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Répartition des revenus</CardTitle>
              <CardDescription>Par catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={revenueByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {revenueByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Revenu']}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2">
                <div className="grid grid-cols-2 gap-4">
                  {revenueByCategory.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.fill }}
                      ></div>
                      <div className="text-xs">{category.name}: {formatCurrency(category.value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Pic de fréquentation</CardTitle>
              <CardDescription>Par heure de la journée</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceByHour}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Occupation']} />
                    <Bar dataKey="value" name="Occupation" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Heure de pointe:</span>
                  <Badge variant="outline" className="font-semibold">00h00 - 01h00</Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Heures calmes:</span>
                  <Badge variant="outline" className="font-semibold">20h00 - 21h00, 04h00 - 05h00</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Démographie des visiteurs</CardTitle>
              <CardDescription>Par tranche d'âge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={visitorsByDemographic}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {visitorsByDemographic.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Principale audience</span>
                    <span className="text-xs text-muted-foreground">25-34 ans (45%)</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-medium">Équilibre H/F</span>
                    <span className="text-xs text-muted-foreground">54% / 46%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
              <CardDescription>Basées sur l'analyse de vos données</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 p-2 rounded-md">
                    <Target className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Optimisez vos tarifs d'entrée</p>
                    <p className="text-xs text-muted-foreground mt-1">Augmentez de 10-15% les vendredis et samedis pour refléter la forte demande</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 p-2 rounded-md">
                    <Music className="h-4 w-4 text-green-600 dark:text-green-300" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Programmation musicale</p>
                    <p className="text-xs text-muted-foreground mt-1">Les soirées House et Techno génèrent 35% plus de revenus</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900 p-2 rounded-md">
                    <Wine className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Promotion boissons</p>
                    <p className="text-xs text-muted-foreground mt-1">Créez des offres spéciales sur les cocktails pour augmenter le panier moyen</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 p-2 rounded-md">
                    <Zap className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Marketing digital</p>
                    <p className="text-xs text-muted-foreground mt-1">Ciblez la tranche 25-34 ans sur Instagram avec vos événements VIP</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tableaux de données et autres informations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Produits les plus vendus</CardTitle>
              <CardDescription>Top 5 des ventes ce mois-ci</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th scope="col" className="px-4 py-3">Produit</th>
                      <th scope="col" className="px-4 py-3">Catégorie</th>
                      <th scope="col" className="px-4 py-3">Ventes</th>
                      <th scope="col" className="px-4 py-3">Revenus</th>
                      <th scope="col" className="px-4 py-3">Évolution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularProducts.map((product, index) => (
                      <tr key={index} className="border-b border-muted hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{product.name}</td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3">{product.sales}</td>
                        <td className="px-4 py-3">{formatCurrency(product.revenue)}</td>
                        <td className="px-4 py-3">
                          <div className={`flex items-center ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.growth >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            <span>{Math.abs(product.growth)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Événements les plus performants</CardTitle>
              <CardDescription>Basé sur le chiffre d'affaires</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th scope="col" className="px-4 py-3">Événement</th>
                      <th scope="col" className="px-4 py-3">Date</th>
                      <th scope="col" className="px-4 py-3">Entrées</th>
                      <th scope="col" className="px-4 py-3">Revenus</th>
                      <th scope="col" className="px-4 py-3">Capacité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topEvents.map((event, index) => (
                      <tr key={index} className="border-b border-muted hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{event.name}</td>
                        <td className="px-4 py-3">{event.date}</td>
                        <td className="px-4 py-3">{event.attendance}</td>
                        <td className="px-4 py-3">{formatCurrency(event.revenue)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Progress value={event.capacityUtilization} className="h-2 mr-3" />
                            <span>{event.capacityUtilization}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Insights globaux */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Insights & Prédictions</CardTitle>
            <CardDescription>Intelligence prédictive pour votre établissement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-base text-blue-800 dark:text-blue-300">Tendances</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Les vendredis génèrent 45% de vos revenus hebdomadaires. Considérez d'augmenter votre personnel de 20% pour optimiser le service pendant ces heures de pointe.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                    <CardTitle className="text-base text-purple-800 dark:text-purple-300">Opportunités</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-purple-700 dark:text-purple-400">Vos soirées à thème augmentent la fréquentation de 35%. Nous recommandons d'organiser 3-4 événements thématiques mensuels pour maximiser votre revenu.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <Info className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" />
                    <CardTitle className="text-base text-amber-800 dark:text-amber-300">Prédictions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-amber-700 dark:text-amber-400">Basé sur vos données, nous prévoyons une augmentation de 22% de la fréquentation pour le mois prochain. Préparez votre inventaire et personnel en conséquence.</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default BIDashboardPage;