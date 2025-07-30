import React from 'react';

export const Header: React.FC = () => {
  return (
    <nav className="w-full fixed top-0 left-0 bg-white px-5 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-[1000] flex items-center justify-start gap-4">
      <a href="#" className="flex items-center gap-4 no-underline">
        {/* Logo placeholder - using initials if image fails to load */}
        <div className="w-[70px] h-[70px] bg-gradient-to-br from-[#0b4f6c] to-[#4db6ac] rounded-[10px] flex items-center justify-center text-white font-bold text-xl">
          MG
        </div>
        <h1 className="text-[22px] text-[#0b4f6c] m-0 font-semibold">
          M.G. Amores Medical Clinic
        </h1>
      </a>
      <div className="ml-auto text-right flex items-center gap-3">
        <div className="text-right">
          <div className="font-bold text-blue-600">ADMIN</div>
          <div className="text-gray-500 text-sm">admin</div>
        </div>
        <div className="w-[45px] h-[45px] rounded-full flex items-center justify-center font-medium text-2xl text-white bg-red-500 shadow-[0_2px_8px_rgba(0,0,0,0.15)] cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
          A
        </div>
      </div>
    </nav>
  );
};