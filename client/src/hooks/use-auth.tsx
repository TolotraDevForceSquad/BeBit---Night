import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User as SelectUser, InsertUser, UserRole } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, RegisterData>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

type RegisterData = InsertUser & {
  confirmPassword: string;
};

// Create a default context value to avoid the null check
const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: false,
  error: null,
  loginMutation: {} as UseMutationResult<SelectUser, Error, LoginData>,
  logoutMutation: {} as UseMutationResult<void, Error, void>,
  registerMutation: {} as UseMutationResult<SelectUser, Error, RegisterData>,
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      
      // Redirect based on user role
      if (user.role === "admin") {
        setLocation("/admin");
      } else if (user.role === "artist") {
        setLocation("/artist");
      } else if (user.role === "club") {
        setLocation("/club");
      } else {
        setLocation("/");
      }
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Échec de connexion",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      // Verify passwords match
      if (data.password !== data.confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }
      
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...credentials } = data;
      
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      
      // Redirect based on user role
      if (user.role === "admin") {
        setLocation("/admin");
      } else if (user.role === "artist") {
        setLocation("/artist");
      } else if (user.role === "club") {
        setLocation("/club");
      } else {
        setLocation("/");
      }
      
      toast({
        title: "Inscription réussie",
        description: `Bienvenue, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Échec d'inscription",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      setLocation("/auth");
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Échec de déconnexion",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const authContextValue: AuthContextType = {
    user: user ?? null,
    isLoading,
    error,
    loginMutation,
    logoutMutation,
    registerMutation,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
