
import React from "react";
import { healthTips } from "../utils/handwashingSteps";
import { Info } from "lucide-react";

const HealthTips: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

      <div className="flex items-center space-x-2 text-blue-500 mb-4">
        <Info size={20} />
        <h3 className="font-medium text-lg">Consejos Sanitarios</h3>
      </div>
      
      <ul className="space-y-3">
        {healthTips.map((tip, index) => (
          <li key={index} className="flex items-center text-sm text-gray-600">
            <div className="bg-blue-50 p-1 rounded-full mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="m5 12 5 5L20 7" />
              </svg>
            </div>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HealthTips;
