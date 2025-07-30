import React from 'react';
import { Header } from '../components/navigation/Header';
import { Sidebar } from '../components/navigation/Sidebar';

interface ClinicLayoutProps {
  children: React.ReactNode;
}

export const ClinicLayout: React.FC<ClinicLayoutProps> = ({ children, ...props }) => {
  return (
    <div 
      className="min-h-screen relative font-[Segoe_UI,Tahoma,Geneva,Verdana,sans-serif] bg-gradient-to-br from-[rgb(109,174,218)] to-[#4db6ac] pt-[100px] m-0"
      {...props}
    >
      {/* Blurred background overlay */}
      <div className="absolute top-0 left-0 w-full h-full min-h-full bg-inherit bg-cover blur-[10px] -z-10" />
      
      <Header />
      <Sidebar />
      
      {/* Main content area with left margin for sidebar */}
      <div className="ml-[220px] mr-5 mt-5 mb-5 max-w-[calc(100%-240px)] box-border">
        {children}
      </div>
    </div>
  );
};