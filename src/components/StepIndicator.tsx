
import React from "react";
import { STEP_STATUS, StepStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StepIndicatorProps {
  step: number;
  label: string;
  icon: LucideIcon;
  status: StepStatus;
  progress: number;
  position: number;
  totalSteps: number;
}

const StepIndicator = ({ 
  step, 
  label, 
  icon: Icon, 
  status, 
  progress, 
  position, 
  totalSteps 
}: StepIndicatorProps) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate position in semicircle
  const angle = (Math.PI / (totalSteps - 1)) * position;
  const centerX = 50; // percent
  const centerY = 85; // percent
  const distance = 40; // percent from center
  
  const x = centerX + distance * Math.cos(angle);
  const y = centerY - distance * Math.sin(angle);
  
  return (
    <div 
      className={cn(
        "step-indicator absolute transition-all duration-300",
        status === STEP_STATUS.ACTIVE && "scale-110 z-10",
        status === STEP_STATUS.COMPLETED && "scale-105"
      )}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle 
            className="step-circle-bg"
            cx="50" 
            cy="50" 
            r={radius}
          />
          
          {/* Progress circle */}
          <circle 
            className={cn(
              "progress-circle",
              status === STEP_STATUS.ACTIVE && "stroke-step-active",
              status === STEP_STATUS.COMPLETED && "stroke-step-completed"
            )}
            cx="50" 
            cy="50" 
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
            style={{
              "--initial-offset": `${circumference}`,
              "--target-offset": `${circumference * (1 - progress / 100)}`,
            } as React.CSSProperties}
          />
        </svg>
        
        {/* Step number and icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className={cn(
              "text-xl font-semibold mb-1",
              status === STEP_STATUS.ACTIVE && "text-step-active",
              status === STEP_STATUS.COMPLETED && "text-step-completed",
              status === STEP_STATUS.PENDING && "text-step-pending"
            )}
          >
            {step}
          </div>
          <Icon 
            className={cn(
              "w-5 h-5",
              status === STEP_STATUS.ACTIVE && "text-step-active",
              status === STEP_STATUS.COMPLETED && "text-step-completed",
              status === STEP_STATUS.PENDING && "text-step-pending"
            )}
          />
        </div>
      </div>
      
      {/* Step label below */}
      <div 
        className={cn(
          "absolute top-full mt-2 text-sm font-medium text-center w-24 -translate-x-1/2 left-1/2",
          status === STEP_STATUS.ACTIVE && "text-primary font-semibold",
          status === STEP_STATUS.COMPLETED && "text-step-completed",
          status === STEP_STATUS.PENDING && "text-muted-foreground"
        )}
      >
        {label}
      </div>
    </div>
  );
};

export default StepIndicator;
