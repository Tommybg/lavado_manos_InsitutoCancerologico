import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import Header from "./components/Header";
import CameraFeed from "./components/CameraFeed";
import StepGuide from "./components/StepGuide";

const queryClient = new QueryClient();

const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStepComplete = (step: number) => {
    if (step < 6) {
      setCurrentStep(step + 1);
    } else {
      // Handle completion of all steps
      console.log('All steps completed!');
    }
  };

  const handleStepError = (step: number, message: string) => {
    setShowError(true);
    setErrorMessage(message);
    setTimeout(() => setShowError(false), 3000);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Header />
        <CameraFeed 
          onStepComplete={handleStepComplete}
          currentStep={currentStep}
          onStepError={handleStepError}
        />
        <StepGuide currentStep={currentStep} />
        {showError && (
          <div className="fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded">
            {errorMessage}
          </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
