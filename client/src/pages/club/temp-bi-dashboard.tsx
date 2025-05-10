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
              <Card>
                <CardHeader>
                  <CardTitle>Analyse de la fréquentation</CardTitle>
                  <CardDescription>Cette section sera disponible prochainement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Section en développement</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Cette fonctionnalité sera bientôt disponible avec des analyses démographiques, les heures de pointe et les tendances de fréquentation.
                    </p>
                  </div>
                </CardContent>
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
                <CardContent>
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Section en développement</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Cette fonctionnalité sera bientôt disponible avec des analyses de campagnes, l'efficacité des promotions et les recommandations marketing.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default BIDashboardPage;