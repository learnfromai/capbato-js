import React from 'react';

export const ClinicHeader: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-[1000] flex items-center justify-between px-5 py-2.5 h-[100px]">
      {/* Left side - Logo and Clinic Name */}
      <div className="flex items-center gap-4">
        <div className="w-[70px] h-[70px] bg-blue-100 rounded-lg flex items-center justify-center">
          {/* Placeholder for logo */}
          <div className="text-2xl font-bold text-blue-600">MG</div>
        </div>
        <h1 className="text-xl font-normal text-[#0b4f6c] m-0">
          M.G. Amores Medical Clinic
        </h1>
      </div>

      {/* Right side - User info and profile avatar */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-bold text-blue-600">ADMIN</div>
          <div className="text-gray-500 text-sm">admin</div>
        </div>
        <div className="w-[45px] h-[45px] bg-red-500 rounded-full flex items-center justify-center text-white font-medium text-xl cursor-pointer shadow-md hover:scale-105 transition-transform">
          A
        </div>
      </div>
    </nav>
  );
};