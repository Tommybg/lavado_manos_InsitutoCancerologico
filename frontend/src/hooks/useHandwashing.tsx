
import { useState, useEffect, useCallback } from "react";
import { handwashingSteps } from "../utils/handwashingSteps";
import { toast } from "@/components/ui/use-toast";

export const useHandwashing = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Function to start the handwashing process
  const startProcess = useCallback(() => {
    setIsActive(true);
    setCurrentStep(1);
    setCompletedSteps([]);
    setTimeRemaining(60);
    setShowSuccess(false);
    
    toast({
      title: "Proceso iniciado",
      description: "Siga las instrucciones en pantalla.",
      duration: 3000,
    });
  }, []);
  
  // Function to reset the handwashing process
  const resetProcess = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setCompletedSteps([]);
    setTimeRemaining(60);
    setShowSuccess(false);
  }, []);

  // Effect for timer and step progression
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          // Calculate which step we should be on based on time remaining
          // Each step is 10 seconds (60 / 6 = 10)
          const stepsShouldBeCompleted = Math.floor((60 - newTime) / 10);
          const newCurrentStep = Math.min(stepsShouldBeCompleted + 1, 6);
          
          // Update current step if needed
          if (newCurrentStep !== currentStep) {
            setCurrentStep(newCurrentStep);
            
            // Add the previous step to completed steps
            if (newCurrentStep > 1) {
              setCompletedSteps(prev => {
                const prevStep = newCurrentStep - 1;
                if (!prev.includes(prevStep)) {
                  return [...prev, prevStep];
                }
                return prev;
              });
            }
          }
          
          return newTime;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      // Process completed
      setCompletedSteps([1, 2, 3, 4, 5, 6]);
      setShowSuccess(true);
      
      toast({
        title: "¡Lavado de manos exitoso!",
        description: "Ha completado correctamente todos los pasos.",
        duration: 5000,
      });
      
      // Reset after 5 seconds
      setTimeout(() => {
        resetProcess();
      }, 5000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeRemaining, currentStep, resetProcess]);
  
  return {
    isActive,
    currentStep,
    completedSteps,
    timeRemaining,
    showSuccess,
    startProcess,
    resetProcess
  };
};
