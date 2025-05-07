import { Suspense } from "react";
import SimpleAuth from "./pages/simple-auth";

function App() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin text-primary">Chargement...</div>
      </div>
    }>
      <div>
        <SimpleAuth />
      </div>
    </Suspense>
  );
}

export default App;