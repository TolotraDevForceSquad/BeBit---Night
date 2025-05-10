import React from 'react';
import ResponsiveLayout from '../../layouts/ResponsiveLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BIDashboardPage: React.FC = () => {
  return (
    <ResponsiveLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard Business Intelligence</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Analysez les données et les tendances de votre établissement
        </p>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="revenue">Revenus</TabsTrigger>
            <TabsTrigger value="attendance">Fréquentation</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Revenus totaux</CardTitle>
                  <CardDescription>Ce mois-ci</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">36.200.000 Ar</div>
                  <div className="text-xs text-muted-foreground flex items-center mt-1">
                    <span className="text-green-500 mr-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                      12%
                    </span>
                    par rapport au mois dernier
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Nombre de visiteurs</CardTitle>
                  <CardDescription>Ce mois-ci</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,845</div>
                  <div className="text-xs text-muted-foreground flex items-center mt-1">
                    <span className="text-green-500 mr-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                      8%
                    </span>
                    par rapport au mois dernier
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Taux d'occupation</CardTitle>
                  <CardDescription>Moyenne</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <div className="text-xs text-muted-foreground flex items-center mt-1">
                    <span className="text-green-500 mr-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                      5%
                    </span>
                    par rapport au mois dernier
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Panier moyen</CardTitle>
                  <CardDescription>Ce mois-ci</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85.000 Ar</div>
                  <div className="text-xs text-muted-foreground flex items-center mt-1">
                    <span className="text-red-500 mr-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
                      3%
                    </span>
                    par rapport au mois dernier
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Revenus par jour de la semaine</CardTitle>
                  <CardDescription>30 derniers jours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex items-end space-x-2 pb-6 pt-6">
                    {/* Bar chart simulation */}
                    <div className="w-1/7 h-[40%] bg-primary rounded-t-md relative group">
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">Lun</span>
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">4.2M</span>
                    </div>
                    <div className="w-1/7 h-[65%] bg-primary rounded-t-md relative group">
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">Mar</span>
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">6.8M</span>
                    </div>
                    <div className="w-1/7 h-[50%] bg-primary rounded-t-md relative group">
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">Mer</span>
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">5.2M</span>
                    </div>
                    <div className="w-1/7 h-[70%] bg-primary rounded-t-md relative group">
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">Jeu</span>
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">7.4M</span>
                    </div>
                    <div className="w-1/7 h-[90%] bg-primary rounded-t-md relative group">
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">Ven</span>
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">9.6M</span>
                    </div>
                    <div className="w-1/7 h-[100%] bg-primary rounded-t-md relative group">
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">Sam</span>
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">10.5M</span>
                    </div>
                    <div className="w-1/7 h-[45%] bg-primary rounded-t-md relative group">
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">Dim</span>
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">4.7M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Répartition des ventes</CardTitle>
                  <CardDescription>Par catégorie de produits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex items-center justify-center">
                    {/* Donut chart simulation */}
                    <div className="relative w-[180px] h-[180px]">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#c7d2fe" strokeWidth="3.8"></circle>
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#818cf8" strokeWidth="3.8" strokeDasharray="100.48" strokeDashoffset="0"></circle>
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#6366f1" strokeWidth="3.8" strokeDasharray="50.24" strokeDashoffset="-100.48"></circle>
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#4f46e5" strokeWidth="3.8" strokeDasharray="25.12" strokeDashoffset="-150.72"></circle>
                      </svg>
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold">36.2M</div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 space-y-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#818cf8] mr-2"></div>
                        <span className="text-sm">Boissons (45%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#6366f1] mr-2"></div>
                        <span className="text-sm">Entrées (25%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#4f46e5] mr-2"></div>
                        <span className="text-sm">Tables VIP (20%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#c7d2fe] mr-2"></div>
                        <span className="text-sm">Divers (10%)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Produits les plus vendus</CardTitle>
                  <CardDescription>30 derniers jours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/40">
                        <tr>
                          <th scope="col" className="px-6 py-3">Produit</th>
                          <th scope="col" className="px-6 py-3">Catégorie</th>
                          <th scope="col" className="px-6 py-3">Quantité</th>
                          <th scope="col" className="px-6 py-3">Revenu</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-card border-b">
                          <td className="px-6 py-4 font-medium">Premium Vodka (Bouteille)</td>
                          <td className="px-6 py-4">Boissons</td>
                          <td className="px-6 py-4">128</td>
                          <td className="px-6 py-4">6.400.000 Ar</td>
                        </tr>
                        <tr className="bg-card border-b">
                          <td className="px-6 py-4 font-medium">Whisky Gold (Bouteille)</td>
                          <td className="px-6 py-4">Boissons</td>
                          <td className="px-6 py-4">95</td>
                          <td className="px-6 py-4">5.700.000 Ar</td>
                        </tr>
                        <tr className="bg-card border-b">
                          <td className="px-6 py-4 font-medium">Champagne Prestige</td>
                          <td className="px-6 py-4">Boissons</td>
                          <td className="px-6 py-4">86</td>
                          <td className="px-6 py-4">4.300.000 Ar</td>
                        </tr>
                        <tr className="bg-card border-b">
                          <td className="px-6 py-4 font-medium">Table VIP Zone Centrale</td>
                          <td className="px-6 py-4">Tables</td>
                          <td className="px-6 py-4">42</td>
                          <td className="px-6 py-4">4.200.000 Ar</td>
                        </tr>
                        <tr className="bg-card">
                          <td className="px-6 py-4 font-medium">Cocktail Signature</td>
                          <td className="px-6 py-4">Boissons</td>
                          <td className="px-6 py-4">210</td>
                          <td className="px-6 py-4">2.100.000 Ar</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse détaillée des revenus</CardTitle>
                  <CardDescription>Cette section sera disponible prochainement</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse de la fréquentation</CardTitle>
                  <CardDescription>Cette section sera disponible prochainement</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketing">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analyses marketing</CardTitle>
                  <CardDescription>Cette section sera disponible prochainement</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default BIDashboardPage;