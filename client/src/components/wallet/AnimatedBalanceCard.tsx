import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, ArrowDown, Plus } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BalanceAnimation } from "./BalanceAnimation";

interface AnimatedBalanceCardProps {
  balance: number;
  totalDeposited: number;
  totalSpent: number;
  onWithdraw: () => void;
  onDeposit: () => void;
}

export function AnimatedBalanceCard({
  balance,
  totalDeposited,
  totalSpent,
  onWithdraw,
  onDeposit
}: AnimatedBalanceCardProps) {
  const [previousBalance, setPreviousBalance] = useState<number | undefined>(undefined);
  const [isFirstRender, setIsFirstRender] = useState(true);
  
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    
    setPreviousBalance(balance);
  }, [balance, isFirstRender]);

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  const statsVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (custom: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: 0.4 + (custom * 0.1),
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <Card className="bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground overflow-hidden">
        <CardContent className="pt-6 relative">
          <div className="flex justify-between">
            <div>
              <p className="text-sm opacity-80">Solde actuel</p>
              <BalanceAnimation balance={balance} previousBalance={previousBalance} />
            </div>
            <motion.div 
              className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
            >
              <DollarSign className="h-6 w-6" />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <motion.div 
              custom={0}
              variants={statsVariants}
            >
              <p className="text-xs opacity-80">Total déposé</p>
              <p className="text-lg font-medium">{totalDeposited.toFixed(2)} Ar</p>
            </motion.div>
            <motion.div 
              custom={1}
              variants={statsVariants}
            >
              <p className="text-xs opacity-80">Total dépensé</p>
              <p className="text-lg font-medium">{totalSpent.toFixed(2)} Ar</p>
            </motion.div>
          </div>
          
          {/* Particules d'arrière-plan pour un effet visuel */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <AnimatePresence>
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-white/5 rounded-full"
                  initial={{
                    x: Math.random() * 100 + "%",
                    y: Math.random() * 100 + "%",
                    scale: Math.random() * 2 + 0.5,
                    opacity: 0
                  }}
                  animate={{
                    x: Math.random() * 100 + "%",
                    y: Math.random() * 100 + "%",
                    opacity: [0, 0.1, 0],
                    scale: Math.random() * 2 + 0.5,
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: Math.random() * 5
                  }}
                  style={{
                    width: (Math.random() * 40 + 10) + "px",
                    height: (Math.random() * 40 + 10) + "px",
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
        <CardFooter className="bg-black/10 p-4 mt-4">
          <div className="grid grid-cols-2 gap-2 w-full">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="secondary" 
                className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
                onClick={onWithdraw}
              >
                <ArrowDown className="h-4 w-4 mr-2" />
                Retirer
              </Button>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="default" 
                className="w-full bg-white text-primary border-0 hover:bg-white/90"
                onClick={onDeposit}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}