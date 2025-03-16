
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
  rowLayout?: boolean;
}

const StepIndicator = ({ 
  step, 
  label, 
  icon: Icon, 
  status, 
  progress, 
  position, 
  totalSteps,
  rowLayout = false 
}: StepIndicatorProps) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate position in semicircle if not in row layout
  const angle = (Math.PI / (totalSteps - 1)) * position;
  const centerX = 50; // percent
  const centerY = 85; // percent
  const distance = 40; // percent from center
  
  const x = centerX + distance * Math.cos(angle);
  const y = centerY - distance * Math.sin(angle);
  
  return (
    <div 
      className={cn(
        "step-indicator transition-all duration-300",
        status === STEP_STATUS.ACTIVE && "scale-110 z-10",
        status === STEP_STATUS.COMPLETED && "scale-105",
        rowLayout ? "relative" : "absolute"
      )}
      style={
        rowLayout 
          ? undefined 
          : {
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }
      }
    >
      <div className="relative">
        <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-md">
          {/* Background circle */}
          <circle 
            className={cn(
              "fill-white stroke-gray-200 stroke-[6]"
            )}
            cx="50" 
            cy="50" 
            r={radius}
          />
          
          {/* Progress circle */}
          <circle 
            className={cn(
              "fill-transparent transition-all duration-300 stroke-[6]",
              status === STEP_STATUS.ACTIVE && "stroke-step-active",
              status === STEP_STATUS.COMPLETED && "stroke-step-completed",
              status === STEP_STATUS.PENDING && "stroke-gray-300"
            )}
            cx="50" 
            cy="50" 
            r={radius}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "center",
            }}
          />
        </svg>
        
        {/* Step icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon 
            className={cn(
              "w-7 h-7",
              status === STEP_STATUS.ACTIVE && "text-step-active",
              status === STEP_STATUS.COMPLETED && "text-step-completed",
              status === STEP_STATUS.PENDING && "text-gray-400"
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
