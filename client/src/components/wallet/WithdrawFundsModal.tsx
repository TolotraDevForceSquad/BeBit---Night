import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Building2, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WithdrawFundsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWithdrawFunds: (amount: number) => void;
  maxAmount: number;
}

export function WithdrawFundsModal({ 
  open, 
  onOpenChange, 
  onWithdrawFunds,
  maxAmount
}: WithdrawFundsModalProps) {
  const [amount, setAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  // Gérer la soumission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }
    
    if (step === 2) {
      setProcessing(true);
      
      // Simuler le traitement du retrait
      setTimeout(() => {
        setProcessing(false);
        setStep(3);
        
        // Déclencher l'action de retrait
        onWithdrawFunds(parseFloat(amount));
      }, 1500);
    }
  };
  
  // Réinitialiser l'état quand le modal est fermé
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => {
        setAmount("");
        setWithdrawMethod("bank");
        setStep(1);
        setProcessing(false);
      }, 300);
    }
  };
  
  // Préréglages des montants
  const presetAmounts = [10, 20, 50, 100];
  
  // Vérifier si le montant est valide
  const isAmountValid = amount !== "" && 
                        !isNaN(parseFloat(amount)) && 
                        parseFloat(amount) > 0 && 
                        parseFloat(amount) <= maxAmount;
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Retirer des fonds"}
            {step === 2 && "Confirmer le retrait"}
            {step === 3 && "Fonds retirés !"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          {/* Étape 1: Saisie du montant */}
          {step === 1 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Montant (€)</Label>
                <Input
                  id="amount"
                  placeholder="Entrez un montant"
                  type="number"
                  min="1"
                  max={maxAmount}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Solde disponible: {maxAmount.toFixed(2)} €
                </p>
                
                {parseFloat(amount) > maxAmount && (
                  <p className="text-xs text-red-500 mt-1">
                    Le montant ne peut pas dépasser votre solde disponible
                  </p>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {presetAmounts.map((preset) => (
                  <motion.button
                    key={preset}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1.5 rounded-md border ${
                      parseFloat(amount) === preset
                        ? "bg-primary text-white border-primary"
                        : "bg-muted hover:bg-muted/90 border-border"
                    }`}
                    onClick={() => setAmount(preset.toString())}
                    disabled={preset > maxAmount}
                  >
                    {preset}€
                  </motion.button>
                ))}
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="withdraw-method">Méthode de retrait</Label>
                <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                  <SelectTrigger id="withdraw-method">
                    <SelectValue placeholder="Sélectionnez une méthode de retrait" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Compte bancaire FR76 **** **** 3456</SelectItem>
                    <SelectItem value="card">Carte Visa ****4242</SelectItem>
                    <SelectItem value="new-method">Ajouter une méthode</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {/* Étape 2: Confirmation */}
          {step === 2 && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Vous allez retirer</p>
                    <p className="text-2xl font-bold">{parseFloat(amount).toFixed(2)} €</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <ArrowDown className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Méthode de retrait</span>
                    <span className="font-medium flex items-center">
                      <Building2 className="h-3.5 w-3.5 mr-1.5" />
                      {withdrawMethod === "bank" ? "Compte bancaire" : "Carte Visa ****4242"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Frais</span>
                    <span className="font-medium">0.00 €</span>
                  </div>
                  <div className="flex justify-between font-medium mt-4">
                    <span>Total</span>
                    <span>{parseFloat(amount).toFixed(2)} €</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                  <p>Le retrait peut prendre 1-3 jours ouvrables selon votre banque.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Étape 3: Succès */}
          {step === 3 && (
            <div className="py-8 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center mb-4"
              >
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-2">Retrait demandé !</h3>
                <p className="text-muted-foreground mb-4">
                  Votre demande de retrait de {parseFloat(amount).toFixed(2)} € a été traitée avec succès.
                </p>
                <p className="text-xs text-muted-foreground">
                  Le montant sera crédité sur votre {withdrawMethod === "bank" ? "compte bancaire" : "carte bancaire"} dans les prochains jours.
                </p>
              </motion.div>
            </div>
          )}
          
          <DialogFooter>
            {step === 1 && (
              <Button type="submit" disabled={!isAmountValid}>
                Continuer
              </Button>
            )}
            
            {step === 2 && (
              <Button type="submit" disabled={processing}>
                {processing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                    />
                    Traitement en cours...
                  </>
                ) : (
                  "Confirmer le retrait"
                )}
              </Button>
            )}
            
            {step === 3 && (
              <Button type="button" onClick={() => handleOpenChange(false)}>
                Fermer
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}