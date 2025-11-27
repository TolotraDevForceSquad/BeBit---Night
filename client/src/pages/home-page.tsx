import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function HomePage() {
  const { user } = useAuth();

  // Redirect based on user role
  if (user) {
    if (user.role === "admin") {
      return <Redirect to="/admin" />;
    } else if (user.role === "artist") {
      return <Redirect to="/artist" />;
    } else if (user.role === "club") {
      return <Redirect to="/club" />;
    } else {
      return <Redirect to="/" />;
    }
  }

  // If no user is logged in, redirect to auth
  return <Redirect to="/auth" />;
}
