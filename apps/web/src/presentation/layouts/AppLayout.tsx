import React from 'react';
import { Header } from '../components/navigation/Header';
import { Sidebar } from '../components/navigation/Sidebar';
import { cn } from '../../lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  className,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'min-h-screen bg-gradient-to-br from-blue-300 to-teal-400',
        className
      )}
      {...props}
    >
      {/* Header */}
      <Header />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <main className="ml-[220px] mr-5 mt-[120px] mb-5">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
};