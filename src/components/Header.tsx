
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 text-white p-2 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-droplets"
            >
              <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
              <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-medium text-gray-800">Monitor de Lavado de Manos</h1>
            <p className="text-sm text-gray-500">Sistema de Seguimiento de Higiene de Manos</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Personal Hospitalario</span>
          <div className="bg-blue-100 text-blue-800 rounded-md px-2 py-1 text-sm font-medium">
            PH
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
