import React from 'react';
import { cn } from '../../../lib/utils';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 w-full bg-white shadow-md z-50 px-5 py-3',
        className
      )}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Logo and branding */}
        <div className="flex items-center gap-4">
          <div className="w-[70px] h-[70px] bg-blue-100 rounded-lg flex items-center justify-center">
            {/* Placeholder for logo */}
            <div className="w-8 h-8 bg-blue-500 rounded"></div>
          </div>
          <h1 className="text-xl font-semibold text-blue-900 m-0">
            M.G. Amores Medical Clinic
          </h1>
        </div>

        {/* Right side - User profile area */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-semibold text-primary text-sm">ADMIN</div>
            <div className="text-muted-foreground text-xs">admin</div>
          </div>
          <div className="w-[45px] h-[45px] bg-red-500 rounded-full flex items-center justify-center text-white font-medium text-lg cursor-pointer hover:scale-105 transition-transform shadow-md">
            A
          </div>
        </div>
      </div>
    </header>
  );
};