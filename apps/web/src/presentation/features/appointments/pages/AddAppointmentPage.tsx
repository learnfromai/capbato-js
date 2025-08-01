import React, { useState } from 'react';
import { Box, Container, Paper, Title, Group, Button, Text, Alert } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { AddAppointmentForm } from '../components';
import type { AddAppointmentFormData } from '@nx-starter/application-shared';

/**
 * AddAppointmentPage component provides a dedicated page for adding new appointments
 * with proper form handling and user feedback.
 */
export const AddAppointmentPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (data: AddAppointmentFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Simulate API call with mock delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful submission
      console.log('Appointment created:', data);
      
      // Show success message
      setSuccessMessage(`Appointment for ${data.patientName} has been scheduled successfully.`);

      // In a real app, you would navigate back to appointments list
      console.log('Appointment successfully created:', {
        patientName: data.patientName,
        reasonForVisit: data.reasonForVisit,
        date: data.date,
        time: data.time,
        doctorId: data.doctorId,
      });

    } catch (err) {
      console.error('Error creating appointment:', err);
      setError('Failed to create appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // In a real app, this would navigate back to the appointments list
    console.log('Cancel appointment creation');
    window.history.back();
  };

  return (
    <MedicalClinicLayout>
      <Container size="md" py="xl">
        <Paper 
          shadow="lg" 
          radius="lg" 
          p="xl" 
          style={{
            background: 'white',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            minHeight: '600px'
          }}
        >
          <Group justify="space-between" mb="lg">
            <Title order={2} c="blue.7">
              Add New Appointment
            </Title>
            <Button
              variant="subtle"
              color="gray"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </Group>

          <Text size="sm" c="dimmed" mb="xl">
            Fill in the details below to schedule a new appointment.
          </Text>

          {successMessage && (
            <Alert color="green" mb="md" onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          )}

          <AddAppointmentForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </Paper>
      </Container>
    </MedicalClinicLayout>
  );
};