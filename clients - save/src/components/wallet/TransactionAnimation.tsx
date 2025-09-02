import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowDown, ArrowUp, Wallet, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

// Type pour les transactions
export type Transaction = {
  id: number;
  date: string;
  amount: number;
  type: "deposit" | "withdrawal" | "purchase" | "refund";
  description: string;
  status: "completed" | "pending" | "failed";
  reference?: string;
  eventId?: number;
  eventTitle?: string;
  isNew?: boolean; // Pour marquer les nouvelles transactions
};

interface TransactionAnimationProps {
  transaction: Transaction;
  onAnimationComplete?: () => void;
}

export function TransactionAnimation({ 
  transaction, 
  onAnimationComplete 
}: TransactionAnimationProps) {
  // Formater la date
  const formattedDate = format(new Date(transaction.date), "d MMM yyyy, HH'h'mm", { locale: fr });
  
  // Déterminer l'icône, la couleur et le préfixe selon le type de transaction
  let icon = <Wallet className="h-5 w-5" />;
  let colorClass = "bg-gray-100 text-gray-700";
  let amountPrefix = "";
  
  if (transaction.type === "deposit" || transaction.type === "refund") {
    icon = <ArrowDown className="h-5 w-5" />;
    colorClass = "bg-green-100 text-green-700";
    amountPrefix = "+";
  } else if (transaction.type === "withdrawal") {
    icon = <ArrowUp className="h-5 w-5" />;
    colorClass = "bg-red-100 text-red-700";
    amountPrefix = "-";
  } else if (transaction.type === "purchase") {
    icon = <CreditCard className="h-5 w-5" />;
    colorClass = "bg-amber-100 text-amber-700";
    amountPrefix = "-";
  }
  
  // Déterminer la couleur du statut
  let statusColorClass = "bg-green-100 text-green-700";
  if (transaction.status === "pending") {
    statusColorClass = "bg-yellow-100 text-yellow-700";
  } else if (transaction.status === "failed") {
    statusColorClass = "bg-red-100 text-red-700";
  }

  const variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0,
      x: "-100%",
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      className={`flex items-center justify-between p-3 border rounded-lg ${transaction.isNew ? 'border-primary' : ''}`}
      onAnimationComplete={() => onAnimationComplete?.()}
      layout
    >
      <div className="flex items-center">
        <motion.div 
          className={`h-10 w-10 rounded-full ${colorClass} flex items-center justify-center mr-3`}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {icon}
        </motion.div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>{formattedDate}</span>
            
            {transaction.status === "pending" && (
              <Badge variant="outline" className={`ml-2 text-[10px] px-1 ${statusColorClass}`}>
                En attente
              </Badge>
            )}
            
            {transaction.status === "failed" && (
              <Badge variant="outline" className={`ml-2 text-[10px] px-1 ${statusColorClass}`}>
                Échouée
              </Badge>
            )}
          </div>
          
          {transaction.reference && (
            <div className="text-xs text-muted-foreground mt-1">
              Réf: {transaction.reference}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-right">
        <motion.p 
          className={`font-bold ${
            transaction.type === "deposit" || transaction.type === "refund" 
              ? "text-green-600" 
              : transaction.type === "purchase" || transaction.type === "withdrawal" 
                ? "text-red-600" 
                : ""
          }`}
          initial={{ scale: 1 }}
          animate={transaction.isNew ? { 
            scale: [1, 1.2, 1],
            transition: { duration: 0.5, times: [0, 0.5, 1] }
          } : {}}
        >
          {amountPrefix}{transaction.amount.toFixed(2)} €
        </motion.p>
        
        {transaction.eventId && (
          <Link to={`/event/${transaction.eventId}`} className="text-xs text-blue-600 hover:underline">
            Voir l'événement
          </Link>
        )}
      </div>
      
      {/* Effet de paillettes pour les nouvelles transactions */}
      {transaction.isNew && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 rounded-lg bg-primary/10 border-2 border-primary" />
        </motion.div>
      )}
    </motion.div>
  );
}