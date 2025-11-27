import React from 'react';
import ResponsiveLayout from '../../layouts/ResponsiveLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BIDashboardPage: React.FC = () => {
  return (
    <ResponsiveLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">Business Intelligence Avancée</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Analyses prédictives et tendances intelligentes pour optimiser votre établissement
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
                  <CardTitle>Analyse prédictive des ventes</CardTitle>
                  <CardDescription>Prochains 30 jours (IA)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex flex-col justify-between">
                    <div className="flex items-center justify-center mb-2">
                      <div className="relative w-[160px] h-[160px] flex items-center justify-center">
                        <div className="absolute inset-0 border-8 border-[#818cf8] rounded-full" style={{clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 50% 100%)'}}></div>
                        <div className="absolute inset-0 border-8 border-[#6366f1] rounded-full" style={{clipPath: 'polygon(50% 50%, 50% 0, 0% 0, 0% 100%, 25% 100%, 35% 75%)'}}></div>
                        <div className="absolute inset-0 border-8 border-[#4f46e5] rounded-full" style={{clipPath: 'polygon(50% 50%, 35% 75%, 25% 100%, 75% 100%, 65% 75%)'}}></div>
                        <div className="absolute inset-0 border-8 border-[#c7d2fe] rounded-full" style={{clipPath: 'polygon(50% 50%, 65% 75%, 75% 100%, 100% 100%, 100% 50%)'}}></div>
                        <div className="text-center z-10">
                          <div className="text-2xl font-bold">42.7M</div>
                          <div className="text-xs text-muted-foreground">Prévision</div>
                        </div>
                      </div>
                      <div className="ml-4 space-y-2">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-[#818cf8] mr-2"></div>
                            <span className="text-sm">Boissons</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium">48%</span>
                            <span className="text-xs text-green-500">(+3%)</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-[#6366f1] mr-2"></div>
                            <span className="text-sm">Entrées</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium">22%</span>
                            <span className="text-xs text-red-500">(-3%)</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-[#4f46e5] mr-2"></div>
                            <span className="text-sm">Tables VIP</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium">19%</span>
                            <span className="text-xs text-red-500">(-1%)</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-[#c7d2fe] mr-2"></div>
                            <span className="text-sm">Divers</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium">11%</span>
                            <span className="text-xs text-green-500">(+1%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 border-t pt-3">
                      <div className="text-sm font-medium mb-2">Recommandations IA</div>
                      <ul className="text-xs space-y-1.5 text-muted-foreground">
                        <li className="flex items-start">
                          <div className="rounded-full bg-green-500 w-1.5 h-1.5 mt-1 mr-1.5"></div>
                          <span>Augmenter les stocks de boissons premium (+18% prévus)</span>
                        </li>
                        <li className="flex items-start">
                          <div className="rounded-full bg-amber-500 w-1.5 h-1.5 mt-1 mr-1.5"></div>
                          <span>Réduire les prix d'entrée en semaine (-10% recommandé)</span>
                        </li>
                        <li className="flex items-start">
                          <div className="rounded-full bg-blue-500 w-1.5 h-1.5 mt-1 mr-1.5"></div>
                          <span>Créer une offre combinée entrée + boisson (+25% potentiel)</span>
                        </li>
                      </ul>
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
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Analyse prédictive des revenus</CardTitle>
                    <CardDescription>Comparaison et tendances sur 12 mois</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex flex-col">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <div className="w-3 h-0.5 bg-blue-500 mr-1"></div>
                            <span className="text-xs">Cette année</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-0.5 bg-gray-300 mr-1"></div>
                            <span className="text-xs">Année précédente</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-0.5 border border-dashed border-primary mr-1"></div>
                            <span className="text-xs">Prévision IA</span>
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          <span className="text-green-500">+12.8%</span> vs année précédente
                        </div>
                      </div>
                      
                      <div className="h-[250px] w-full relative">
                        {/* Simulation d'un graphique de ligne interactif */}
                        <div className="absolute left-0 top-0 w-full h-full grid grid-cols-12 gap-0">
                          {/* Lignes horizontales du grid */}
                          {Array.from({length: 6}).map((_, i) => (
                            <div key={`hline-${i}`} className="absolute w-full border-b border-gray-100 dark:border-gray-800" style={{top: `${20 * i}%`}}>
                              <span className="absolute -top-2 -left-12 text-xs text-muted-foreground">
                                {(50 - i * 10)}M
                              </span>
                            </div>
                          ))}
                          
                          {/* Barres pour chaque mois */}
                          {Array.from({length: 12}).map((_, i) => {
                            // Valeurs de revenus pour cette année
                            const currentYearValue = 20 + Math.sin(i * 0.5) * 10 + Math.random() * 5;
                            // Valeurs de l'année précédente
                            const lastYearValue = 18 + Math.sin(i * 0.5) * 8 + Math.random() * 4;
                            // Prévision
                            const prediction = i > 7 ? 23 + Math.sin(i * 0.5) * 12 + Math.random() * 3 : null;
                            
                            return (
                              <div key={`month-${i}`} className="relative h-full flex flex-col justify-end items-center">
                                {/* Point de données pour cette année */}
                                <div 
                                  className="absolute w-2 h-2 bg-blue-500 rounded-full z-10 transition-all duration-300 hover:w-3 hover:h-3"
                                  style={{
                                    bottom: `${currentYearValue}%`,
                                    left: `${(i * 8.33) + 4.165}%`,
                                  }}
                                >
                                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-md px-2 py-1 text-xs whitespace-nowrap">
                                    {Math.round(currentYearValue / 2)}M Ar
                                  </div>
                                </div>
                                
                                {/* Point de données pour l'année dernière */}
                                <div 
                                  className="absolute w-2 h-2 bg-gray-300 rounded-full z-10 transition-all duration-300 hover:w-3 hover:h-3"
                                  style={{
                                    bottom: `${lastYearValue}%`,
                                    left: `${(i * 8.33) + 4.165}%`,
                                  }}
                                >
                                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-md px-2 py-1 text-xs whitespace-nowrap">
                                    {Math.round(lastYearValue / 2)}M Ar
                                  </div>
                                </div>
                                
                                {/* Points de prédiction (seulement pour les mois futurs) */}
                                {prediction && (
                                  <div 
                                    className="absolute w-2 h-2 border border-primary bg-background rounded-full z-10 transition-all duration-300 hover:w-3 hover:h-3"
                                    style={{
                                      bottom: `${prediction}%`,
                                      left: `${(i * 8.33) + 4.165}%`,
                                    }}
                                  >
                                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-background border border-primary rounded-md px-2 py-1 text-xs whitespace-nowrap">
                                      {Math.round(prediction / 2)}M Ar (IA)
                                    </div>
                                  </div>
                                )}
                                
                                {/* Ligne du mois */}
                                <div className="absolute bottom-0 text-xs text-muted-foreground">
                                  {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][i]}
                                </div>
                              </div>
                            );
                          })}
                          
                          {/* Lignes qui connectent les points */}
                          <svg className="absolute inset-0 h-full w-full" style={{top: '0', left: '0'}}>
                            <path 
                              d="M50,180 Q100,100 150,150 T250,120 T350,150 T450,130 T550,170 T650,120" 
                              stroke="#3b82f6" 
                              strokeWidth="2" 
                              fill="none" 
                            />
                            <path 
                              d="M50,200 Q100,120 150,170 T250,140 T350,170 T450,150 T550,190 T650,140" 
                              stroke="#d1d5db" 
                              strokeWidth="2" 
                              fill="none" 
                            />
                            <path 
                              d="M450,130 Q500,100 550,120 T650,80" 
                              stroke="#3b82f6" 
                              strokeWidth="2" 
                              strokeDasharray="4 4"
                              fill="none" 
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Impact des événements</CardTitle>
                    <CardDescription>Rendement par type d'événement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Soirées DJ</span>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">6.4M Ar</span>
                            <span className="text-xs text-green-500">+12%</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{width: '80%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Soirées live</span>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">5.8M Ar</span>
                            <span className="text-xs text-green-500">+8%</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{width: '72%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Concerts</span>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">9.2M Ar</span>
                            <span className="text-xs text-green-500">+22%</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{width: '95%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Soirées à thème</span>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">4.5M Ar</span>
                            <span className="text-xs text-red-500">-5%</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{width: '65%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>After-work</span>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">3.2M Ar</span>
                            <span className="text-xs text-green-500">+15%</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{width: '48%'}}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t">
                      <div className="text-sm font-medium mb-2">Insights IA</div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
                        <p className="text-xs">
                          <span className="font-medium">Opportunité détectée:</span> Les concerts génèrent 22% de revenus supplémentaires par rapport à la même période l'an dernier. L'IA suggère d'augmenter la fréquence des concerts de 2 à 4 par mois.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Segmentation des revenus par source</CardTitle>
                  <CardDescription>Analyse détaillée par canal et produit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-medium mb-4">Répartition par canal</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                            <span>Application Be bit.</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">42%</span>
                            <span className="text-xs text-green-500 ml-1">↑ 8%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                            <span>Vente sur place</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">30%</span>
                            <span className="text-xs text-red-500 ml-1">↓ 12%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                            <span>Site web</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">18%</span>
                            <span className="text-xs text-green-500 ml-1">↑ 3%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
                            <span>Partenaires</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">10%</span>
                            <span className="text-xs text-green-500 ml-1">↑ 2%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="text-sm font-medium mb-2">Recommandation d'action</div>
                        <p className="text-xs text-muted-foreground">
                          La croissance des ventes via l'application (+8%) indique une préférence client pour les achats mobiles. Considérez d'augmenter les promotions exclusives sur l'application pour accentuer cette tendance.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-4">Revenus par types de produits</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Tickets événements</span>
                            <span className="font-medium">15.4M Ar</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full" style={{width: '45%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Ventes boissons</span>
                            <span className="font-medium">12.8M Ar</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full">
                            <div className="h-2 bg-purple-500 rounded-full" style={{width: '37%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Tables VIP</span>
                            <span className="font-medium">3.8M Ar</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{width: '12%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Merchandising</span>
                            <span className="font-medium">1.2M Ar</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full">
                            <div className="h-2 bg-amber-500 rounded-full" style={{width: '4%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Autres revenus</span>
                            <span className="font-medium">0.8M Ar</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full">
                            <div className="h-2 bg-gray-500 rounded-full" style={{width: '2%'}}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="text-sm font-medium mb-2">Prévision IA</div>
                        <p className="text-xs text-muted-foreground">
                          Le merchandising représente une opportunité de croissance sous-exploitée. 
                          Nos modèles prédictifs estiment un potentiel de croissance de 300% avec l'ajout 
                          de produits dérivés exclusifs liés aux événements et artistes.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <div className="grid gap-6">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Affluence et heures de pointe</CardTitle>
                    <CardDescription>Analyse par jour et heure (30 derniers jours)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[4/3] relative">
                      {/* Heatmap simulation */}
                      <div className="grid grid-cols-7 grid-rows-6 gap-1 w-full h-full">
                        {/* Labels pour les jours */}
                        <div className="absolute -left-8 top-0 h-full flex flex-col justify-between py-1">
                          {['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00'].map((hour, i) => (
                            <div key={`hour-${i}`} className="text-xs text-muted-foreground">
                              {hour}
                            </div>
                          ))}
                        </div>
                        
                        {/* Labels pour les heures */}
                        <div className="absolute -top-6 left-0 w-full flex justify-between px-1">
                          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => (
                            <div key={`day-${i}`} className="text-xs text-muted-foreground">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        {/* Cellules du heatmap */}
                        {Array.from({ length: 77 }).map((_, i) => {
                          const row = Math.floor(i / 7);
                          const col = i % 7;
                          // Plus de clients le vendredi et samedi soir
                          const isWeekend = col === 5 || col === 4;
                          // Plus de clients en soirée (20h-1h)
                          const isPrimeTime = row >= 2 && row <= 6;
                          
                          // Calculer l'intensité de couleur basée sur l'affluence simulée
                          let intensity = 0;
                          if (isWeekend && isPrimeTime) {
                            intensity = 0.7 + Math.random() * 0.3; // Forte affluence
                          } else if (isWeekend || isPrimeTime) {
                            intensity = 0.3 + Math.random() * 0.4; // Affluence moyenne
                          } else {
                            intensity = Math.random() * 0.3; // Faible affluence
                          }
                          
                          // Convertir l'intensité en une teinte de bleu
                          const heatColor = `rgba(79, 70, 229, ${intensity})`;
                          
                          return (
                            <div 
                              key={`cell-${i}`} 
                              className="rounded-sm hover:ring-1 ring-primary cursor-pointer transition-all duration-150 flex items-center justify-center group"
                              style={{ backgroundColor: heatColor }}
                            >
                              <span className="opacity-0 group-hover:opacity-100 text-xs font-medium bg-background text-foreground px-1.5 py-0.5 rounded shadow-sm border">
                                {Math.round(intensity * 100)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-200 mr-1"></div>
                          <span className="text-xs">Faible</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-400 mr-1"></div>
                          <span className="text-xs">Moyenne</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-600 mr-1"></div>
                          <span className="text-xs">Forte</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Moyenne sur les 30 derniers jours
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Analyse démographique</CardTitle>
                    <CardDescription>Profil de votre clientèle</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Répartition par âge */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Répartition par âge</h3>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>18-24 ans</span>
                              <span className="font-medium">35%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-primary rounded-full" style={{ width: '35%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>25-34 ans</span>
                              <span className="font-medium">42%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-primary rounded-full" style={{ width: '42%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>35-44 ans</span>
                              <span className="font-medium">18%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-primary rounded-full" style={{ width: '18%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>45+ ans</span>
                              <span className="font-medium">5%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-primary rounded-full" style={{ width: '5%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Répartition par genre */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Répartition par genre</h3>
                        <div className="flex items-center">
                          <div className="w-24 h-24 relative">
                            <svg viewBox="0 0 100 100">
                              <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="none" 
                                stroke="#e0e0e0" 
                                strokeWidth="20" 
                              />
                              <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="none" 
                                stroke="#4f46e5" 
                                strokeWidth="20" 
                                strokeDasharray="184" 
                                strokeDashoffset="0" 
                                transform="rotate(-90 50 50)"
                              />
                              <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="none" 
                                stroke="#ec4899" 
                                strokeWidth="20" 
                                strokeDasharray="184" 
                                strokeDashoffset="105" 
                                transform="rotate(-90 50 50)"
                              />
                            </svg>
                          </div>
                          
                          <div className="ml-4 space-y-2">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-[#4f46e5] mr-2 rounded-sm"></div>
                              <span className="text-xs">Hommes (54%)</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-[#ec4899] mr-2 rounded-sm"></div>
                              <span className="text-xs">Femmes (43%)</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-[#e0e0e0] mr-2 rounded-sm"></div>
                              <span className="text-xs">Autres (3%)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tendance d'affluence */}
                      <div>
                        <h3 className="text-sm font-medium mb-1">Tendance d'affluence</h3>
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-green-500">+12.5%</div>
                          <div className="text-xs ml-2 text-muted-foreground">vs mois précédent</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Comportement de la clientèle</CardTitle>
                    <CardDescription>Habitudes et préférences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-3">Durée moyenne de présence</h3>
                        <div className="flex space-x-3">
                          <div className="flex-1 bg-muted/50 rounded-md p-3 text-center">
                            <div className="text-xl font-bold">2h 45m</div>
                            <div className="text-xs text-muted-foreground">En semaine</div>
                          </div>
                          <div className="flex-1 bg-muted/50 rounded-md p-3 text-center">
                            <div className="text-xl font-bold">3h 20m</div>
                            <div className="text-xs text-muted-foreground">Weekend</div>
                          </div>
                          <div className="flex-1 bg-muted/50 rounded-md p-3 text-center">
                            <div className="text-xl font-bold">4h 05m</div>
                            <div className="text-xs text-muted-foreground">Événements</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-3">Taux de retour clients</h3>
                        <div className="flex items-center">
                          <div className="w-full bg-muted h-8 rounded-md overflow-hidden flex">
                            <div className="bg-green-500 h-full w-[32%] flex items-center justify-center text-xs font-medium text-white">
                              Réguliers (32%)
                            </div>
                            <div className="bg-blue-500 h-full w-[45%] flex items-center justify-center text-xs font-medium text-white">
                              Occasionnels (45%)
                            </div>
                            <div className="bg-orange-500 h-full w-[23%] flex items-center justify-center text-xs font-medium text-white">
                              Nouveaux (23%)
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Zones les plus fréquentées</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                              <span className="text-xs">Bar principal</span>
                            </div>
                            <span className="text-xs font-medium">85%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                              <span className="text-xs">Piste de danse</span>
                            </div>
                            <span className="text-xs font-medium">76%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                              <span className="text-xs">Terrasse</span>
                            </div>
                            <span className="text-xs font-medium">62%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                              <span className="text-xs">Zone VIP</span>
                            </div>
                            <span className="text-xs font-medium">48%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Prédictions et recommandations IA</CardTitle>
                    <CardDescription>Optimisations basées sur les données de fréquentation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
                        <h3 className="font-medium text-sm flex items-center mb-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1 text-blue-600"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                          Prédiction d'affluence
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Basé sur les données historiques et les événements à venir, nous prévoyons un pic d'affluence de <span className="font-medium">+18%</span> le weekend prochain, principalement dans la zone bar et terrasse.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
                        <h3 className="font-medium text-sm flex items-center mb-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1 text-amber-600"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path></svg>
                          Optimisation du personnel
                        </h3>
                        <p className="text-xs text-muted-foreground mb-1">
                          Recommandation d'ajouter <span className="font-medium">2 barmans supplémentaires</span> pour le vendredi et samedi entre 22h et 2h pour réduire le temps d'attente au bar principal.
                        </p>
                        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                        <h3 className="font-medium text-sm flex items-center mb-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1 text-green-600"><path d="M5.51 18.49a10 10 0 1 0 0-14.14 9.89 9.89 0 0 0 0 14.14"></path><path d="m12 8-4 4 4 4"></path><path d="m16 12h-8"></path></svg>
                          Optimisation de l'espace
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          La zone VIP est sous-utilisée le mercredi et jeudi. Suggestion de <span className="font-medium">promotion spéciale mid-week</span> pour augmenter la fréquentation de 48% à 65%.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-md">
                        <h3 className="font-medium text-sm flex items-center mb-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1 text-purple-600"><path d="M12 2v4"></path><path d="m6.41 6.41 2.83 2.83"></path><path d="M2 12h4"></path><path d="m6.41 17.59 2.83-2.83"></path><path d="M12 22v-4"></path><path d="m17.59 17.59-2.83-2.83"></path><path d="M22 12h-4"></path><path d="m17.59 6.41-2.83 2.83"></path></svg>
                          Tendance et opportunité
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Forte augmentation de la clientèle 25-34 ans (+15%). Opportunité d'organiser des événements ciblés pour cette tranche d'âge les jeudis avec un <span className="font-medium">potentiel de revenu de +22%</span>.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="marketing">
            <div className="grid gap-6">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance des campagnes</CardTitle>
                    <CardDescription>Suivi des 5 dernières campagnes marketing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div>
                        <div className="mb-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">Weekend DJ International (Avril)</h3>
                            <span className="text-sm font-medium text-green-500">+38%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: '92%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Budget: 5 000 Ar</span>
                            <span>ROI: 3.8x</span>
                          </div>
                        </div>
                        
                        <div className="mb-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">Happy Hour Extended (Mars)</h3>
                            <span className="text-sm font-medium text-green-500">+21%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: '78%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Budget: 2 500 Ar</span>
                            <span>ROI: 2.2x</span>
                          </div>
                        </div>
                        
                        <div className="mb-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">Ladies Night (Mars)</h3>
                            <span className="text-sm font-medium text-green-500">+28%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Budget: 3 200 Ar</span>
                            <span>ROI: 2.7x</span>
                          </div>
                        </div>
                        
                        <div className="mb-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">Soirée Masquée (Février)</h3>
                            <span className="text-sm font-medium text-amber-500">+12%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: '65%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Budget: 4 200 Ar</span>
                            <span>ROI: 1.5x</span>
                          </div>
                        </div>
                        
                        <div className="mb-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">Soirée Nouvel An (Janvier)</h3>
                            <span className="text-sm font-medium text-red-500">+8%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-red-500" style={{ width: '42%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Budget: 7 500 Ar</span>
                            <span>ROI: 1.1x</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border border-border p-3 rounded-md">
                        <h3 className="text-sm font-medium mb-2">Analyse de l'efficacité</h3>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>- Les campagnes ciblant des DJs internationaux ont le meilleur ROI (3.8x)</p>
                          <p>- Les promotions "Happy Hour" sont rentables avec un faible investissement</p>
                          <p>- Les événements à thème comme "Soirée Masquée" ont un ROI moyen</p>
                          <p>- Campagne "Nouvel An" surbudgétisée avec un faible retour</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Efficacité des promotions</CardTitle>
                    <CardDescription>Impact sur la fréquentation et les ventes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-4">Taux de conversion par type de promotion</h3>
                        <div className="relative w-full aspect-square">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-xs text-center">
                              <div className="font-medium text-lg">+26%</div>
                              <div className="text-muted-foreground">Taux moyen</div>
                            </div>
                          </div>
                          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            <circle r="40" cx="50" cy="50" fill="transparent" stroke="#f1f5f9" strokeWidth="10"></circle>
                            
                            {/* Réduction sur les boissons */}
                            <circle 
                              r="40" 
                              cx="50" 
                              cy="50" 
                              fill="transparent" 
                              stroke="#3b82f6" 
                              strokeWidth="10" 
                              strokeDasharray="251.2" 
                              strokeDashoffset="0"
                            ></circle>
                            
                            {/* Happy Hour */}
                            <circle 
                              r="40" 
                              cx="50" 
                              cy="50" 
                              fill="transparent" 
                              stroke="#10b981" 
                              strokeWidth="10" 
                              strokeDasharray="251.2" 
                              strokeDashoffset="100.5"
                            ></circle>
                            
                            {/* Entrée gratuite */}
                            <circle 
                              r="40" 
                              cx="50" 
                              cy="50" 
                              fill="transparent" 
                              stroke="#f59e0b" 
                              strokeWidth="10" 
                              strokeDasharray="251.2" 
                              strokeDashoffset="151"
                            ></circle>
                            
                            {/* Cadeaux */}
                            <circle 
                              r="40" 
                              cx="50" 
                              cy="50" 
                              fill="transparent" 
                              stroke="#ec4899" 
                              strokeWidth="10" 
                              strokeDasharray="251.2" 
                              strokeDashoffset="201"
                            ></circle>
                          </svg>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-sm bg-blue-500 mr-2"></div>
                            <span className="text-xs">Réduction sur les boissons (40%)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-sm bg-green-500 mr-2"></div>
                            <span className="text-xs">Happy Hour (20%)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-sm bg-amber-500 mr-2"></div>
                            <span className="text-xs">Entrée gratuite (20%)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-sm bg-pink-500 mr-2"></div>
                            <span className="text-xs">Cadeaux/Concours (20%)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Impact des canaux marketing</h3>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs">Instagram</span>
                              <span className="text-xs font-medium">42%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-indigo-500 rounded-full" style={{ width: '42%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs">Stories Instagram</span>
                              <span className="text-xs font-medium">35%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-purple-500 rounded-full" style={{ width: '35%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs">Email</span>
                              <span className="text-xs font-medium">15%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: '15%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs">SMS</span>
                              <span className="text-xs font-medium">8%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-green-500 rounded-full" style={{ width: '8%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-md">
                        <h3 className="text-sm font-medium mb-2">Insights sur les promotions</h3>
                        <ul className="text-xs space-y-1 list-disc pl-4 text-muted-foreground">
                          <li>Les réductions sur les boissons augmentent les dépenses moyennes de 35%</li>
                          <li>Les promotions "Happy Hour" attirent 2.5x plus de clients en début de soirée</li>
                          <li>L'entrée gratuite avant 23h augmente l'affluence générale de 30%</li>
                          <li>Instagram est le canal le plus efficace avec un CPL 60% plus bas</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Plan marketing optimisé</CardTitle>
                    <CardDescription>Recommandations basées sur les données</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left font-medium p-2">Type</th>
                            <th className="text-left font-medium p-2">Canal</th>
                            <th className="text-left font-medium p-2">Timing</th>
                            <th className="text-left font-medium p-2 hidden md:table-cell">Budget</th>
                            <th className="text-left font-medium p-2">ROI prévu</th>
                            <th className="text-left font-medium p-2 hidden md:table-cell">Priorité</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>DJ International</span>
                              </div>
                            </td>
                            <td className="p-2">Instagram + Email</td>
                            <td className="p-2">Mensuel</td>
                            <td className="p-2 hidden md:table-cell">5 000 Ar</td>
                            <td className="p-2">
                              <div className="font-medium text-green-500">3.8x</div>
                            </td>
                            <td className="p-2 hidden md:table-cell">
                              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded px-1.5 py-0.5 inline-block font-medium">Élevée</div>
                            </td>
                          </tr>
                          
                          <tr className="border-b border-border">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>Happy Hour</span>
                              </div>
                            </td>
                            <td className="p-2">Stories Instagram</td>
                            <td className="p-2">Hebdomadaire</td>
                            <td className="p-2 hidden md:table-cell">1 000 Ar</td>
                            <td className="p-2">
                              <div className="font-medium text-green-500">2.5x</div>
                            </td>
                            <td className="p-2 hidden md:table-cell">
                              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded px-1.5 py-0.5 inline-block font-medium">Élevée</div>
                            </td>
                          </tr>
                          
                          <tr className="border-b border-border">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                <span>Ladies Night</span>
                              </div>
                            </td>
                            <td className="p-2">Instagram + SMS</td>
                            <td className="p-2">Bimensuel</td>
                            <td className="p-2 hidden md:table-cell">2 500 Ar</td>
                            <td className="p-2">
                              <div className="font-medium text-green-500">2.2x</div>
                            </td>
                            <td className="p-2 hidden md:table-cell">
                              <div className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs rounded px-1.5 py-0.5 inline-block font-medium">Moyenne</div>
                            </td>
                          </tr>
                          
                          <tr className="border-b border-border">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                <span>Weekend VIP</span>
                              </div>
                            </td>
                            <td className="p-2">Email + SMS</td>
                            <td className="p-2">Mensuel</td>
                            <td className="p-2 hidden md:table-cell">3 000 Ar</td>
                            <td className="p-2">
                              <div className="font-medium text-amber-500">1.8x</div>
                            </td>
                            <td className="p-2 hidden md:table-cell">
                              <div className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs rounded px-1.5 py-0.5 inline-block font-medium">Moyenne</div>
                            </td>
                          </tr>
                          
                          <tr>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                <span>Événement à thème</span>
                              </div>
                            </td>
                            <td className="p-2">Instagram</td>
                            <td className="p-2">Trimestriel</td>
                            <td className="p-2 hidden md:table-cell">4 500 Ar</td>
                            <td className="p-2">
                              <div className="font-medium text-red-500">1.3x</div>
                            </td>
                            <td className="p-2 hidden md:table-cell">
                              <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded px-1.5 py-0.5 inline-block font-medium">Basse</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recommandations IA</CardTitle>
                    <CardDescription>Suggestions générées par notre IA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-3 py-1">
                        <h3 className="text-sm font-medium mb-1">Campagnes à privilégier</h3>
                        <p className="text-xs text-muted-foreground">
                          Concentrez 60% de votre budget marketing sur les campagnes DJ International et Happy Hour qui offrent le meilleur ROI.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-indigo-500 pl-3 py-1">
                        <h3 className="text-sm font-medium mb-1">Optimisation des canaux</h3>
                        <p className="text-xs text-muted-foreground">
                          Réallouez le budget des campagnes SMS (-50%) vers les stories Instagram (+50%) pour un meilleur taux de conversion.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-amber-500 pl-3 py-1">
                        <h3 className="text-sm font-medium mb-1">Ciblage amélioré</h3>
                        <p className="text-xs text-muted-foreground">
                          Ciblez prioritairement la tranche 25-34 ans qui représente 42% de votre clientèle avec des formats visuels courts.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-3 py-1">
                        <h3 className="text-sm font-medium mb-1">Calendrier optimal</h3>
                        <p className="text-xs text-muted-foreground">
                          Lancez vos promotions Happy Hour les mardis et mercredis pour stimuler la fréquentation en début de semaine (+35%).
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-purple-500 pl-3 py-1">
                        <h3 className="text-sm font-medium mb-1">Test recommandé</h3>
                        <p className="text-xs text-muted-foreground">
                          Testez une campagne "After Work" ciblant les professionnels avec un potentiel d'augmentation de 28% le jeudi.
                        </p>
                      </div>
                      
                      <div className="mt-4 bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                        <div className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 w-5 h-5 mt-0.5 mr-2"><circle cx="12" cy="12" r="10"></circle><path d="m8 12 2 2 4-4"></path></svg>
                          <div>
                            <h3 className="text-sm font-medium mb-1">ROI Global Prévu</h3>
                            <p className="text-xs text-muted-foreground">
                              En suivant ces recommandations, vous pouvez augmenter votre ROI marketing global de <span className="font-medium text-blue-500">1.8x à 2.4x</span>, générant environ <span className="font-medium">+32%</span> de revenus additionnels.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default BIDashboardPage;