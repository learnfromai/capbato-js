import React from 'react';

export const Header: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Left side - Logo and Clinic Name */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
          {/* Placeholder logo - can be replaced with actual logo */}
          <div className="w-12 h-12 bg-blue-500 rounded-md flex items-center justify-center">
            <span className="text-white text-xl font-bold">MG</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-blue-900 mb-0">
          M.G. Amores Medical Clinic
        </h1>
      </div>

      {/* Right side - User Info Placeholder */}
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="font-bold text-blue-600">ADMIN</div>
          <div className="text-gray-500 text-sm">admin</div>
        </div>
        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">A</span>
        </div>
      </div>
    </nav>
  );
};