import React from 'react';
import { Container, Paper, Title } from '@mantine/core';
import { AddAppointmentForm } from '../components/AddAppointmentForm';
import type { AddAppointmentFormData } from '@nx-starter/application-shared';

/**
 * Demo component to test the AddAppointmentForm in isolation
 */
export const AddAppointmentDemo: React.FC = () => {
  const handleSubmit = async (data: AddAppointmentFormData) => {
    console.log('Form submitted:', data);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Appointment created for ${data.patientName}`);
  };

  return (
    <Container size="md" py="xl">
      <Paper shadow="md" radius="md" p="xl">
        <Title order={2} mb="lg">
          Add Appointment Form Demo
        </Title>
        <AddAppointmentForm
          onSubmit={handleSubmit}
          isLoading={false}
        />
      </Paper>
    </Container>
  );
};