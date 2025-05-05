import { ReactNode } from "react";
import { useMobile } from "@/hooks/use-mobile";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";

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
  headerContent,
}: ResponsiveLayoutProps) {
  const isMobile = useMobile();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header */}
      {isMobile && headerContent && (
        <header className="fixed top-0 left-0 right-0 bg-card z-40 border-b border-border safe-top">
          <div className="mobile-pt px-4 py-2 flex items-center justify-between">
            {headerContent}
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        {!isMobile && <Sidebar activeItem={activeItem} />}

        {/* Content Area */}
        <main className={`flex-1 ${isMobile ? 'mobile-pb' : 'ml-64'} ${isMobile && headerContent ? 'mt-16' : ''}`}>
          {!isMobile && headerContent && (
            <header className="bg-card border-b border-border p-4 z-10 sticky top-0">
              {headerContent}
            </header>
          )}
          
          <div className={isMobile ? 'mobile-container' : 'container py-6'}>
            {sidebarContent && !isMobile && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">{children}</div>
                <div className="lg:col-span-1">{sidebarContent}</div>
              </div>
            )}
            
            {(!sidebarContent || isMobile) && children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      {isMobile && showNavigation && <MobileNavigation activeItem={activeItem} />}
    </div>
  );
}