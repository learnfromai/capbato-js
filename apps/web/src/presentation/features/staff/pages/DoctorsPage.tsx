import React from 'react';
import { Box } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { DoctorsTable, CustomCalendar } from '../components';
import { ScheduleEntry } from '../types';

// Dummy schedule data for July 2025
const dummySchedules: ScheduleEntry[] = [
  {
    date: '2025-07-02',
    note: '9:00 AM - 5:00 PM',
    details: 'Dr. John Doe'
  },
  {
    date: '2025-07-03',
    note: '8:00 AM - 4:00 PM',
    details: 'Dr. Alice Smith'
  },
  {
    date: '2025-07-16',
    note: '9:00 AM - 5:00 PM',
    details: 'Dr. Alice Smith'
  },
  {
    date: '2025-07-28',
    note: '9:00 AM - 5:00 PM',
    details: 'Dr. John Doe'
  },
  {
    date: '2025-07-30',
    note: '8:30 AM - 4:30 PM',
    details: 'Dr. Alice Smith'
  }
];

export const DoctorsPage: React.FC = () => {
  const handleEditSchedule = () => {
    console.log('Edit schedule clicked');
    // TODO: Implement edit schedule functionality
  };

  return (
    <MedicalClinicLayout>
      <Box
        style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          minHeight: 'calc(100vh - 140px)'
        }}
      >
        {/* Doctors Table - Now uses real API data */}
        <DoctorsTable />
        
        {/* Doctor's Schedule Calendar */}
        <CustomCalendar 
          schedules={dummySchedules} 
          onEdit={handleEditSchedule}
        />
      </Box>
    </MedicalClinicLayout>
  );
};
