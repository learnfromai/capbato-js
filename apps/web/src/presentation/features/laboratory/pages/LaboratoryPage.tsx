import React from 'react';
import { MedicalClinicLayout } from '../../../layouts/MedicalClinicLayout';

export const LaboratoryPage: React.FC = () => {
  return (
    <MedicalClinicLayout data-testid="laboratory-page">
      <div className="bg-white rounded-2xl p-6 shadow-lg min-h-[300px]">
        <h2 className="text-2xl font-bold text-[#0b4f6c] mb-4">Laboratory</h2>
        <p className="text-gray-600">Laboratory content will be implemented here.</p>
      </div>
    </MedicalClinicLayout>
  );
};