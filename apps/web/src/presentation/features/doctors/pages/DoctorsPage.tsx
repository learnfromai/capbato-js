import React from 'react';
import { MedicalClinicLayout } from '../../../layouts/MedicalClinicLayout';

export const DoctorsPage: React.FC = () => {
  return (
    <MedicalClinicLayout data-testid="doctors-page">
      <div className="bg-white rounded-2xl p-6 shadow-lg min-h-[300px]">
        <h2 className="text-2xl font-bold text-[#0b4f6c] mb-4">Doctors</h2>
        <p className="text-gray-600">Doctors content will be implemented here.</p>
      </div>
    </MedicalClinicLayout>
  );
};