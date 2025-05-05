import { ReactNode } from "react";
import { useMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";

interface ResponsiveLayoutProps {
  children: ReactNode;
  activeItem?: string;
  showNavigation?: boolean;
  sidebarContent?: ReactNode;
  headerContent?: ReactNode;
}

export default function ResponsiveLayout({
  children,
  activeItem,
  showNavigation = true,
  sidebarContent,
  headerContent
}: ResponsiveLayoutProps) {
  const isMobile = useMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* En-tête mobile */}
      {isMobile && headerContent && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm p-4">
          {headerContent}
        </header>
      )}
      
      {/* Contenu principal avec sidebar pour desktop */}
      <div className="flex-1 flex">
        {/* Sidebar pour la version desktop */}
        {!isMobile && showNavigation && (
          <aside className="hidden md:block w-64 border-r p-4 shrink-0">
            <Sidebar activeItem={activeItem} />
            
            {/* Contenu additionnel de la sidebar */}
            {sidebarContent && (
              <div className="mt-6">
                {sidebarContent}
              </div>
            )}
          </aside>
        )}
        
        {/* Contenu principal */}
        <main className="flex-1 p-4">
          {/* En-tête desktop */}
          {!isMobile && headerContent && (
            <header className="mb-6">
              {headerContent}
            </header>
          )}
          
          {/* Contenu de la page */}
          <div>
            {children}
          </div>
        </main>
      </div>
      
      {/* Navigation mobile */}
      {isMobile && showNavigation && (
        <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur-sm">
          <MobileNavigation activeItem={activeItem} />
        </div>
      )}
    </div>
  );
}