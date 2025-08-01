import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Tabs, Card, Grid, Text, Table, Button, Group } from '@mantine/core';
import { 
  IconUser, 
  IconNotes, 
  IconCalendarEvent, 
  IconPrescription, 
  IconFlask,
  IconArrowLeft 
} from '@tabler/icons-react';
import { MedicalClinicLayout } from '../../../components/layout';
import { mockPatientDetails } from '../data/mockPatientDetails';
import { PatientDetails, PatientAppointment } from '../types';

export const PatientDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In a real app, this would fetch data based on the ID
  const patient: PatientDetails = mockPatientDetails;

  const handleGoBack = () => {
    navigate('/patients');
  };

  const renderPatientInfo = () => (
    <Grid>
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md">
          <Card.Section p="md">
            <Text fw={600} size="lg" mb="md">Patient Information</Text>
            <Box>
              <Text mb="xs"><strong>Patient #:</strong> {patient.patientNumber}</Text>
              <Text mb="xs"><strong>Full Name:</strong> {patient.fullName}</Text>
              <Text mb="xs"><strong>Gender:</strong> {patient.gender}</Text>
              <Text mb="xs"><strong>Age:</strong> {patient.age}</Text>
              <Text mb="xs"><strong>Date of Birth:</strong> {patient.dateOfBirth}</Text>
              <Text mb="xs"><strong>Contact Number:</strong> {patient.phoneNumber}</Text>
              <Text mb="xs">
                <strong>Address:</strong> {patient.address.street}, {patient.address.city}, {patient.address.province} {patient.address.zipCode}
              </Text>
            </Box>
          </Card.Section>
        </Card>
      </Grid.Col>
      
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md">
          <Card.Section p="md">
            <Text fw={600} size="lg" mb="md">Guardian Details</Text>
            <Box>
              <Text mb="xs"><strong>Full Name:</strong> {patient.guardian?.fullName || 'N/A'}</Text>
              <Text mb="xs"><strong>Gender:</strong> {patient.guardian?.gender || 'N/A'}</Text>
              <Text mb="xs"><strong>Relationship:</strong> {patient.guardian?.relationship || 'N/A'}</Text>
              <Text mb="xs"><strong>Contact Number:</strong> {patient.guardian?.phoneNumber || 'N/A'}</Text>
              <Text mb="xs"><strong>Address:</strong> {patient.guardian?.address || 'N/A'}</Text>
            </Box>
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );

  const renderAppointments = () => (
    <Card shadow="sm" padding="lg" radius="md">
      <Card.Section p="md">
        <Text fw={600} size="lg" mb="md">Appointments</Text>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Time</Table.Th>
              <Table.Th>Reason for Visit</Table.Th>
              <Table.Th>Lab Tests Done</Table.Th>
              <Table.Th>Prescriptions</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {patient.appointments?.map((appointment: PatientAppointment) => (
              <Table.Tr key={appointment.id}>
                <Table.Td>{appointment.date}</Table.Td>
                <Table.Td>{appointment.time}</Table.Td>
                <Table.Td>{appointment.reasonForVisit}</Table.Td>
                <Table.Td>{appointment.labTestsDone}</Table.Td>
                <Table.Td>{appointment.prescriptions}</Table.Td>
                <Table.Td>{appointment.status}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card.Section>
    </Card>
  );

  const renderPlaceholderTab = (title: string) => (
    <Card shadow="sm" padding="lg" radius="md">
      <Card.Section p="md">
        <Text fw={600} size="lg">{title}</Text>
        <Text c="dimmed" mt="md">Content coming soon...</Text>
      </Card.Section>
    </Card>
  );

  return (
    <MedicalClinicLayout>
      <Box
        style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          minHeight: 'calc(100vh - 140px)',
          position: 'relative'
        }}
      >
        <Tabs defaultValue="patient-info" orientation="horizontal">
          <Tabs.List grow>
            <Tabs.Tab value="patient-info" leftSection={<IconUser size={16} />}>
              Patient Info
            </Tabs.Tab>
            <Tabs.Tab value="medical-records" leftSection={<IconNotes size={16} />}>
              Medical Records
            </Tabs.Tab>
            <Tabs.Tab value="appointments" leftSection={<IconCalendarEvent size={16} />}>
              Appointments
            </Tabs.Tab>
            <Tabs.Tab value="prescriptions" leftSection={<IconPrescription size={16} />}>
              Prescriptions
            </Tabs.Tab>
            <Tabs.Tab value="laboratories" leftSection={<IconFlask size={16} />}>
              Laboratories
            </Tabs.Tab>
          </Tabs.List>

          <Box mt="xl">
            <Tabs.Panel value="patient-info">
              {renderPatientInfo()}
            </Tabs.Panel>

            <Tabs.Panel value="medical-records">
              {renderPlaceholderTab('Medical Records')}
            </Tabs.Panel>

            <Tabs.Panel value="appointments">
              {renderAppointments()}
            </Tabs.Panel>

            <Tabs.Panel value="prescriptions">
              {renderPlaceholderTab('Prescriptions')}
            </Tabs.Panel>

            <Tabs.Panel value="laboratories">
              {renderPlaceholderTab('Laboratory Requests')}
            </Tabs.Panel>
          </Box>
        </Tabs>

        <Group justify="center" mt="xl">
          <Button 
            leftSection={<IconArrowLeft size={16} />}
            variant="filled"
            color="teal"
            onClick={handleGoBack}
          >
            Go Back
          </Button>
        </Group>
      </Box>
    </MedicalClinicLayout>
  );
};