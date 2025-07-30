import React from 'react';
import { ClinicHeader } from '../components/navigation/ClinicHeader';
import { LeftSidebar } from '../components/navigation/LeftSidebar';

interface MedicalClinicLayoutProps {
  children: React.ReactNode;
}

export const MedicalClinicLayout: React.FC<MedicalClinicLayoutProps> = ({
  children,
  ...props
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-teal-300" {...props}>
      {/* Header */}
      <ClinicHeader />
      
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content Area - offset by sidebar width */}
      <div className="ml-[200px] pt-[100px]">
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
};