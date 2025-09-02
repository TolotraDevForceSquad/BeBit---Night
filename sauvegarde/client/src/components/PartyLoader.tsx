import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PartyLoader() {
  // Animation pour les figures qui dansent
  const [dancerColors] = useState<string[]>([
    "#FF5675", "#FF54B9", "#B254FF", "#754CFF", "#4C6FFF", "#36DBFF", "#2BFFC6"
  ]);
  
  // Effet d'apparition et de disparition des danseurs
  const [visibleDancers, setVisibleDancers] = useState<number[]>([0, 1, 2]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Varier les danseurs visibles pour plus de dynamisme
      const newVisible = [...visibleDancers];
      
      // Supprimer un danseur aléatoire et ajouter un nouveau aléatoirement
      const removeIndex = Math.floor(Math.random() * newVisible.length);
      newVisible.splice(removeIndex, 1);
      
      // Ajouter un nouveau danseur non présent
      let newDancer;
      do {
        newDancer = Math.floor(Math.random() * 5);
      } while (newVisible.includes(newDancer));
      
      newVisible.push(newDancer);
      setVisibleDancers(newVisible);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [visibleDancers]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {/* Titre animé */}
      <motion.div 
        className="mb-8 text-2xl font-bold bg-gradient-to-r from-rose-400 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.5, 1, 0.5],
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity
        }}
      >
        Be bit.
      </motion.div>
      
      {/* Conteneur pour les danseurs */}
      <div className="relative h-40 w-full flex justify-center items-center">
        {/* Cercle pulsant en arrière-plan */}
        <motion.div 
          className="absolute rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity
          }}
          style={{ width: '200px', height: '200px' }}
        />
        
        {/* Danseurs animés */}
        <div className="flex space-x-4 z-10">
          <AnimatePresence>
            {visibleDancers.map((idx) => (
              <Dancer 
                key={idx} 
                color={dancerColors[idx % dancerColors.length]} 
                delay={idx * 0.2}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {/* Lumières stroboscopiques */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          animate={{ 
            opacity: [0, 0.1, 0, 0.2, 0]
          }}
          transition={{ 
            duration: 0.5,
            repeat: Infinity
          }}
          style={{ 
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)'
          }}
        />
      </div>
      
      {/* Texte animé */}
      <motion.div 
        className="text-sm text-muted-foreground mt-6"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Préparation de l'ambiance...
      </motion.div>
    </div>
  );
}

// Composant danseur individuel
type DancerProps = {
  color: string;
  delay: number;
};

function Dancer({ color, delay }: DancerProps) {
  // Animation aléatoire pour chaque danseur
  const animations = [
    // Animation 1: Saut avec rotation
    {
      y: [0, -20, 0],
      rotate: [0, 15, -15, 0],
      scale: [1, 1.1, 1]
    },
    // Animation 2: Mouvement latéral
    {
      x: [0, 10, -10, 0],
      y: [0, -5, 0],
      rotate: [-5, 5, -5]
    },
    // Animation 3: Tourner et sauter
    {
      rotate: [0, 20, -20, 0],
      y: [0, -15, 0]
    },
    // Animation 4: Pulsation
    {
      scale: [1, 1.2, 0.9, 1],
      y: [0, -10, 0]
    },
    // Animation 5: Ondulation
    {
      y: [0, -10, 0],
      rotate: [0, 10, 0, -10, 0],
      scaleY: [1, 1.1, 0.9, 1.1, 1]
    }
  ];
  
  // Choisir une animation aléatoire
  const animIdx = Math.floor(Math.random() * animations.length);
  
  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Figure qui danse */}
      <motion.div 
        className="w-10 h-16 rounded-full relative"
        style={{ backgroundColor: color }}
        animate={animations[animIdx]}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: delay,
        }}
      >
        {/* Tête */}
        <div className="absolute w-8 h-8 rounded-full bg-white left-1 top-1">
          {/* Visage */}
          <div className="flex justify-center items-center h-full">
            <div className="flex space-x-2">
              <div className="w-1 h-1 rounded-full bg-black" />
              <div className="w-1 h-1 rounded-full bg-black" />
            </div>
          </div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-1 rounded-full bg-black" />
        </div>
        
        {/* Corps */}
        <div className="absolute w-6 h-8 rounded-t-full bg-white top-[40%] left-1/2 transform -translate-x-1/2" />
        
        {/* Bras en mouvement */}
        <motion.div
          className="absolute w-2 h-6 rounded-full bg-white -left-1 top-[40%]"
          animate={{ rotate: [-30, 30, -30] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-2 h-6 rounded-full bg-white -right-1 top-[40%]"
          animate={{ rotate: [30, -30, 30] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>
      
      {/* Ombre */}
      <motion.div
        className="w-8 h-2 bg-black/20 rounded-full mt-1"
        animate={{ 
          scale: [1, 0.8, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: delay,
        }}
      />
    </motion.div>
  );
}