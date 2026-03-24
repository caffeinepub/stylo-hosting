import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { Dashboard } from "./pages/Dashboard";
import { LandingPage } from "./pages/LandingPage";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center animate-pulse">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {identity ? <Dashboard /> : <LandingPage />}
      <Toaster />
    </>
  );
}
