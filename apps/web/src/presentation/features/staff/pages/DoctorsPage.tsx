import React, { useState } from 'react';
import { Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MedicalClinicLayout } from '../../../components/layout';
import { Modal } from '../../../components/common';
import { DoctorsTable, CustomCalendar, UpdateDoctorScheduleForm } from '../components';
import { Doctor, ScheduleEntry, UpdateDoctorScheduleFormData } from '../types';

// Dummy data for doctors
const dummyDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. John Doe',
    specialization: 'Cardiology',
    contactNumber: '123456789'
  },
  {
    id: '2',
    name: 'Dr. Alice Smith',
    specialization: 'Pediatrics',
    contactNumber: '098765432'
  },
];

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
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditSchedule = () => {
    console.log('Edit schedule clicked');
    open(); // Open the modal
  };

  const handleScheduleSubmit = async (data: UpdateDoctorScheduleFormData) => {
    setIsLoading(true);
    try {
      // Mock API call - simulate saving to backend
      console.log('Saving schedule:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success
      console.log('Schedule saved successfully');
      
      // TODO: Update the schedules array with the new data
      // For now, just close the modal
      close();
    } catch (error) {
      console.error('Error saving schedule:', error);
      // TODO: Handle error display
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    close();
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
        {/* Doctors Table */}
        <DoctorsTable doctors={dummyDoctors} />
        
        {/* Doctor's Schedule Calendar */}
        <CustomCalendar 
          schedules={dummySchedules} 
          onEdit={handleEditSchedule}
        />
      </Box>

      {/* Update Doctor Schedule Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title=""
        size="sm"
        customStyles={{
          body: {
            padding: '20px',
          }
        }}
      >
        <UpdateDoctorScheduleForm
          onSubmit={handleScheduleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </Modal>
    </MedicalClinicLayout>
  );
};
