
import { useState, useEffect, useCallback } from "react";
import { WASHING_STEPS, STEP_STATUS, StepStatus, TOTAL_DURATION } from "@/lib/constants";
import { toast } from "sonner";

interface StepState {
  id: number;
  status: StepStatus;
  progress: number; // 0 to 100
}

export function useHandWashingSteps() {
  const [steps, setSteps] = useState<StepState[]>(() => 
    WASHING_STEPS.map(step => ({
      id: step.id,
      status: STEP_STATUS.PENDING,
      progress: 0,
    }))
  );
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_DURATION);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const currentStep = WASHING_STEPS[currentStepIndex];
  
  const startProcess = useCallback(() => {
    setIsRunning(true);
    // Set first step as active
    setSteps(prevSteps => 
      prevSteps.map((step, index) => 
        index === 0 
          ? { ...step, status: STEP_STATUS.ACTIVE } 
          : step
      )
    );
  }, []);
  
  const resetProcess = useCallback(() => {
    setIsRunning(false);
    setCurrentStepIndex(0);
    setTimeRemaining(TOTAL_DURATION);
    setIsCompleted(false);
    setSteps(WASHING_STEPS.map(step => ({
      id: step.id,
      status: STEP_STATUS.PENDING,
      progress: 0,
    })));
  }, []);
  
  // Simulate step detection (in a real app, this would be triggered by AI detection)
  useEffect(() => {
    if (!isRunning || isCompleted) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = Math.max(0, prev - 0.1);
        return newTime;
      });
      
      // Calculate which step we should be on based on time
      const elapsedTime = TOTAL_DURATION - timeRemaining;
      let timeSum = 0;
      let newStepIndex = 0;
      
      for (let i = 0; i < WASHING_STEPS.length; i++) {
        timeSum += WASHING_STEPS[i].durationInSeconds;
        if (elapsedTime <= timeSum) {
          newStepIndex = i;
          break;
        }
      }
      
      // If step changed, update step statuses
      if (newStepIndex !== currentStepIndex) {
        setCurrentStepIndex(newStepIndex);
        
        setSteps(prevSteps => 
          prevSteps.map((step, index) => {
            if (index < newStepIndex) {
              return { 
                ...step, 
                status: STEP_STATUS.COMPLETED, 
                progress: 100 
              };
            } else if (index === newStepIndex) {
              return {
                ...step,
                status: STEP_STATUS.ACTIVE,
                progress: 0 // Will start progressing now
              };
            }
            return step;
          })
        );
      }
      
      // Calculate progress for current step
      if (currentStep) {
        const stepStartTime = WASHING_STEPS.slice(0, currentStepIndex)
          .reduce((sum, s) => sum + s.durationInSeconds, 0);
        
        const stepElapsedTime = elapsedTime - stepStartTime;
        const stepProgress = Math.min(
          100, 
          (stepElapsedTime / currentStep.durationInSeconds) * 100
        );
        
        setSteps(prevSteps => 
          prevSteps.map((step, index) => 
            index === currentStepIndex 
              ? { ...step, progress: stepProgress } 
              : step
          )
        );
      }
      
      // Check if process is completed
      if (timeRemaining <= 0.1) {
        setIsRunning(false);
        setIsCompleted(true);
        setSteps(prevSteps => 
          prevSteps.map(step => ({
            ...step,
            status: STEP_STATUS.COMPLETED,
            progress: 100
          }))
        );
        toast.success("¡Lavado de manos completado correctamente!");
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [isRunning, currentStepIndex, timeRemaining, isCompleted, currentStep]);
  
  const overallProgress = isCompleted 
    ? 100 
    : (TOTAL_DURATION - timeRemaining) / TOTAL_DURATION * 100;
  
  return {
    steps,
    currentStepIndex,
    currentStep,
    isRunning,
    timeRemaining,
    isCompleted,
    startProcess,
    resetProcess,
    overallProgress
  };
}
