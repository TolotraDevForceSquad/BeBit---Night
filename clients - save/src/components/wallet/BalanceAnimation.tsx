import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign } from "lucide-react";

interface BalanceAnimationProps {
  balance: number;
  previousBalance?: number;
}

export function BalanceAnimation({ balance, previousBalance }: BalanceAnimationProps) {
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    // Si c'est la première fois ou si le solde n'a pas changé, ne pas animer
    if (previousBalance === undefined || balance === previousBalance) {
      setDisplayBalance(balance);
      return;
    }

    // Déterminer si c'est une augmentation ou une diminution
    setDirection(balance > previousBalance ? "up" : "down");
    setAnimating(true);

    // Animation du compteur (incrémentation/décrémentation progressive)
    let start = previousBalance;
    const diff = balance - previousBalance;
    const duration = 1500; // ms
    const interval = 20; // ms
    const steps = duration / interval;
    const increment = diff / steps;
    
    const timer = setInterval(() => {
      start += increment;
      
      // Vérifier si nous sommes arrivés ou avons dépassé la valeur cible
      if ((increment > 0 && start >= balance) || (increment < 0 && start <= balance)) {
        clearInterval(timer);
        setDisplayBalance(balance);
        setTimeout(() => setAnimating(false), 500); // Laisser l'effet visuel se terminer
      } else {
        setDisplayBalance(start);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [balance, previousBalance]);

  return (
    <div className="relative">
      {/* Affichage du montant */}
      <div className="text-3xl font-bold mt-1">
        {displayBalance.toFixed(2)} Ar
      </div>
      
      {/* Animation de particules pour indiquer l'ajout/retrait de fonds */}
      <AnimatePresence>
        {animating && direction && (
          <motion.div 
            className={`absolute ${direction === "up" ? "bottom-full" : "top-full"} left-0 w-full`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-center">
              <motion.div
                className={`flex items-center justify-center rounded-full p-2 ${
                  direction === "up" 
                    ? "bg-red-100 text-red-500" 
                    : "bg-green-100 text-green-500"
                }`}
                initial={{ y: 0, scale: 0.5, opacity: 0 }}
                animate={{ 
                  y: direction === "up" ? -20 : 20, 
                  scale: 1, 
                  opacity: [0, 1, 0]
                }}
                exit={{ y: direction === "up" ? -30 : 30, opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <span className="text-sm font-medium whitespace-nowrap">
                  {direction === "up" ? "-" : "+"}{Math.abs(balance - (previousBalance || 0)).toFixed(2)} Ar
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}