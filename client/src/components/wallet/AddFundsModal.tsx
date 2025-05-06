import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CreditCard, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddFundsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFunds: (amount: number) => void;
}

export function AddFundsModal({ open, onOpenChange, onAddFunds }: AddFundsModalProps) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
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
      
      // Simuler le traitement du paiement
      setTimeout(() => {
        setProcessing(false);
        setStep(3);
        
        // Déclencher l'action d'ajout au solde
        onAddFunds(parseFloat(amount));
      }, 1500);
    }
  };
  
  // Réinitialiser l'état quand le modal est fermé
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => {
        setAmount("");
        setPaymentMethod("card");
        setStep(1);
        setProcessing(false);
      }, 300);
    }
  };
  
  // Préréglages des montants
  const presetAmounts = [10, 20, 50, 100];
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Ajouter des fonds"}
            {step === 2 && "Confirmer le paiement"}
            {step === 3 && "Fonds ajoutés !"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          {/* Étape 1: Saisie du montant */}
          {step === 1 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Montant (Ar)</Label>
                <Input
                  id="amount"
                  placeholder="Entrez un montant"
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="text-lg"
                />
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
                  >
                    {preset} Ar
                  </motion.button>
                ))}
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="payment-method">Méthode de paiement</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="Sélectionnez une méthode de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Visa ****4242</SelectItem>
                    <SelectItem value="bank">Compte bancaire</SelectItem>
                    <SelectItem value="new-card">Ajouter une carte</SelectItem>
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
                    <p className="text-sm text-muted-foreground">Vous allez ajouter</p>
                    <p className="text-2xl font-bold">{parseFloat(amount).toFixed(2)} Ar</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Méthode de paiement</span>
                    <span className="font-medium flex items-center">
                      <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                      {paymentMethod === "card" ? "Visa ****4242" : "Compte bancaire"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Frais</span>
                    <span className="font-medium">0.00 Ar</span>
                  </div>
                  <div className="flex justify-between font-medium mt-4">
                    <span>Total</span>
                    <span>{parseFloat(amount).toFixed(2)} Ar</span>
                  </div>
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
                <h3 className="text-xl font-semibold mb-2">Transaction réussie!</h3>
                <p className="text-muted-foreground mb-4">
                  {parseFloat(amount).toFixed(2)} Ar ont été ajoutés à votre portefeuille.
                </p>
              </motion.div>
            </div>
          )}
          
          <DialogFooter>
            {step === 1 && (
              <Button type="submit" disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}>
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
                  "Confirmer le paiement"
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