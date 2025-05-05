import { useState, useEffect } from "react";

/**
 * Hook pour détecter si l'utilisateur est sur un appareil mobile
 * @param breakpoint La largeur en pixels en dessous de laquelle on considère que c'est un appareil mobile (par défaut 768px)
 * @returns true si l'utilisateur est sur mobile, false sinon
 */
export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    // Fonction pour mettre à jour l'état en fonction de la largeur de l'écran
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Ajouter un écouteur d'événement pour le redimensionnement
    window.addEventListener("resize", handleResize);

    // Nettoyage
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isMobile;
}