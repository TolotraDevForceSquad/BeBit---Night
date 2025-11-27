import PartyLoader from "./PartyLoader";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

export default function LoadingSpinner({ fullScreen = false, message }: LoadingSpinnerProps) {
  // Utiliser le nouveau PartyLoader avec les animations de danse
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'h-64'}`}>
      <PartyLoader />
      {message && (
        <p className="text-muted-foreground mt-4 text-center">{message}</p>
      )}
    </div>
  );
}