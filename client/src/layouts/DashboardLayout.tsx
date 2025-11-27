import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import { useAuth } from "@/hooks/use-auth";

interface DashboardLayoutProps {
  children: ReactNode;
  activeItem?: string;
}

export default function DashboardLayout({ children, activeItem }: DashboardLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      <header className="md:hidden px-4 py-3 bg-card border-b border-border fixed top-0 left-0 right-0 z-30">
        <div className="flex justify-between items-center">
          <h1 className="font-heading font-bold text-xl">
            <span className="text-primary">Night</span>
            <span className="text-secondary">Connect</span>
          </h1>
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <i className="fas fa-bell text-gray-300"></i>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white overflow-hidden">
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.username} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold">{user?.username.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <Sidebar activeItem={activeItem} />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation activeItem={activeItem} />
    </div>
  );
}
