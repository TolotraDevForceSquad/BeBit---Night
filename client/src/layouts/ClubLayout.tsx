// D:\Projet\BeBit\bebit - new\client\src\components\ClubLayout.tsx
"use client";

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Calendar, 
  Mail, 
  User, 
  Menu, 
  X,
  Music,
  Building,
  LogOut
} from "lucide-react";

interface ClubLayoutProps {
  children: React.ReactNode;
}

const ClubLayouts = ({ children }: sProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location] = useLocation();

  // Récupérer l'utilisateur connecté depuis localStorage
  const currentUser = typeof window !== "undefined" ? 
    JSON.parse(localStorage.getItem("auth_user") || "null") : null;

  const navigation = [
    {
      name: "Événements",
      href: "/club/events",
      icon: Calendar,
      current: location === "/club/events"
    },
    {
      name: "Invitations",
      href: "/club/invitations",
      icon: Mail,
      current: location === "/club/invitations"
    }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar pour desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        {/* Sidebar component */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 border-r border-gray-800">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-pink-500" />
              <span className="text-xl font-bold">BeBit Club</span>
            </div>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href}>
                        <a
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                            item.current
                              ? 'bg-pink-500 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          <item.icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              
              {/* Section utilisateur */}
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-white bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      className="h-8 w-8 rounded-full bg-gray-800"
                      src={currentUser?.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                      alt={currentUser?.firstName}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">
                        {currentUser?.role === "club" ? "Club" : currentUser?.role}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Bouton déconnexion */}
                <button
                  onClick={handleLogout}
                  className="mt-3 flex w-full items-center gap-x-3 px-2 py-2 text-sm font-semibold leading-6 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  Déconnexion
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Header mobile */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 border-b border-gray-800">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex-1 text-sm font-semibold leading-6 text-white">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-pink-500" />
            <span>BeBit Club</span>
          </div>
        </div>
        
        {/* Utilisateur mobile */}
        <div className="flex items-center gap-3">
          <img
            className="h-8 w-8 rounded-full bg-gray-800"
            src={currentUser?.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
            alt={currentUser?.firstName}
          />
        </div>
      </div>

      {/* Sidebar mobile */}
      {isSidebarOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-black/80" onClick={toggleSidebar} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 overflow-y-auto px-6 pb-4 border-r border-gray-800">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Building className="h-8 w-8 text-pink-500" />
                <span className="text-xl font-bold">BeBit Club</span>
              </div>
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400"
                onClick={toggleSidebar}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="mt-8">
              <ul role="list" className="flex flex-col gap-y-4">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <a
                        onClick={toggleSidebar}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                          item.current
                            ? 'bg-pink-500 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Section utilisateur mobile */}
              <div className="mt-8 pt-8 border-t border-gray-800">
                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-white bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      className="h-8 w-8 rounded-full bg-gray-800"
                      src={currentUser?.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                      alt={currentUser?.firstName}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">
                        {currentUser?.role === "club" ? "Club" : currentUser?.role}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="mt-3 flex w-full items-center gap-x-3 px-2 py-2 text-sm font-semibold leading-6 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  Déconnexion
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="lg:pl-64">
        <div className="min-h-screen bg-black">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ClubLayouts;