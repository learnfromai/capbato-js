import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Tabs, Card, Text, Grid, Table } from '@mantine/core';
import { IconUser, IconNotes, IconCalendarCheck, IconPill, IconFlask, IconArrowLeft } from '@tabler/icons-react';
import { MedicalClinicLayout } from '../../../components/layout';

// Mock data for demonstration
const MOCK_PATIENT_DATA = {
  '2025-A1': {
    patient: {
      patientNumber: '2025-A1',
      fullName: 'Lilienne Altamirano Alleje',
      gender: 'Male',
      age: 123,
      dateOfBirth: 'March 2, 2025',
      contactNumber: '2147483647',
      address: 'Ph 4 Pkg 5 Blk 34 Lot 17'
    },
    guardian: {
      fullName: 'Anjela Depanes',
      gender: 'Male',
      relationship: 'Aaa',
      contactNumber: '9083421788',
      address: 'Ph 4 Pkg 5 Blk 34 Lot 17'
    },
    appointments: [
      {
        date: 'June 29, 2025',
        time: '11:00 AM',
        reasonForVisit: 'Consultation',
        labTestsDone: 'N/A',
        prescriptions: 'N/A',
        status: 'Confirmed'
      },
      {
        date: 'May 21, 2025',
        time: '8:00 AM',
        reasonForVisit: 'Consultation',
        labTestsDone: 'N/A',
        prescriptions: 'N/A',
        status: 'Confirmed'
      },
      {
        date: 'May 20, 2025',
        time: '8:00 AM',
        reasonForVisit: 'Consultation',
        labTestsDone: 'N/A',
        prescriptions: 'N/A',
        status: 'Confirmed'
      }
    ]
  }
};

export const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const patientData = MOCK_PATIENT_DATA[id as keyof typeof MOCK_PATIENT_DATA];
  
  if (!patientData) {
    return (
      <MedicalClinicLayout>
        <Box p="md">
          <Text>Patient not found</Text>
          <Button onClick={() => navigate('/patients')} leftSection={<IconArrowLeft />}>
            Go Back
          </Button>
        </Box>
      </MedicalClinicLayout>
    );
  }

  const handleGoBack = () => {
    navigate('/patients');
  };

  return (
    <MedicalClinicLayout>
      <Box
        style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          minHeight: 'calc(100vh - 140px)',
        }}
      >
        <Tabs defaultValue="patient-info" variant="pills">
          <Tabs.List style={{ marginBottom: '20px' }}>
            <Tabs.Tab 
              value="patient-info" 
              leftSection={<IconUser size={16} />}
              style={{
                backgroundColor: '#4FD1C7',
                color: 'white',
                border: 'none',
                fontWeight: 'bold'
              }}
            >
              Patient Info
            </Tabs.Tab>
            <Tabs.Tab 
              value="medical-records" 
              leftSection={<IconNotes size={16} />}
              style={{
                backgroundColor: '#E9ECEF',
                color: '#6C757D',
                border: 'none'
              }}
            >
              Medical Records
            </Tabs.Tab>
            <Tabs.Tab 
              value="appointments" 
              leftSection={<IconCalendarCheck size={16} />}
              style={{
                backgroundColor: '#E9ECEF',
                color: '#6C757D',
                border: 'none'
              }}
            >
              Appointments
            </Tabs.Tab>
            <Tabs.Tab 
              value="prescriptions" 
              leftSection={<IconPill size={16} />}
              style={{
                backgroundColor: '#E9ECEF',
                color: '#6C757D',
                border: 'none'
              }}
            >
              Prescriptions
            </Tabs.Tab>
            <Tabs.Tab 
              value="laboratories" 
              leftSection={<IconFlask size={16} />}
              style={{
                backgroundColor: '#E9ECEF',
                color: '#6C757D',
                border: 'none'
              }}
            >
              Laboratories
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="patient-info">
            <Grid>
              <Grid.Col span={6}>
                <Card withBorder shadow="sm" radius="md" p="lg">
                  <Text size="lg" fw={600} mb="md" c="#1A5E63">Patient Information</Text>
                  <Box>
                    <Text mb="xs"><strong>Patient #:</strong> {patientData.patient.patientNumber}</Text>
                    <Text mb="xs"><strong>Full Name:</strong> {patientData.patient.fullName}</Text>
                    <Text mb="xs"><strong>Gender:</strong> {patientData.patient.gender}</Text>
                    <Text mb="xs"><strong>Age:</strong> {patientData.patient.age}</Text>
                    <Text mb="xs"><strong>Date of Birth:</strong> {patientData.patient.dateOfBirth}</Text>
                    <Text mb="xs"><strong>Contact Number:</strong> {patientData.patient.contactNumber}</Text>
                    <Text mb="xs"><strong>Address:</strong> {patientData.patient.address}</Text>
                  </Box>
                </Card>
              </Grid.Col>
              
              <Grid.Col span={6}>
                <Card withBorder shadow="sm" radius="md" p="lg">
                  <Text size="lg" fw={600} mb="md" c="#1A5E63">Guardian Details</Text>
                  <Box>
                    <Text mb="xs"><strong>Full Name:</strong> {patientData.guardian.fullName}</Text>
                    <Text mb="xs"><strong>Gender:</strong> {patientData.guardian.gender}</Text>
                    <Text mb="xs"><strong>Relationship:</strong> {patientData.guardian.relationship}</Text>
                    <Text mb="xs"><strong>Contact Number:</strong> {patientData.guardian.contactNumber}</Text>
                    <Text mb="xs"><strong>Address:</strong> {patientData.guardian.address}</Text>
                  </Box>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="medical-records">
            <Text size="lg" fw={600} c="#1A5E63">Medical Records</Text>
            <Text c="dimmed" mt="md">Medical records functionality coming soon...</Text>
          </Tabs.Panel>

          <Tabs.Panel value="appointments">
            <Text size="lg" fw={600} mb="md" c="#1A5E63">Appointments</Text>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr style={{ backgroundColor: '#E3F2FD' }}>
                  <Table.Th style={{ color: '#1976D2', fontWeight: 'bold' }}>Date</Table.Th>
                  <Table.Th style={{ color: '#1976D2', fontWeight: 'bold' }}>Time</Table.Th>
                  <Table.Th style={{ color: '#1976D2', fontWeight: 'bold' }}>Reason for Visit</Table.Th>
                  <Table.Th style={{ color: '#1976D2', fontWeight: 'bold' }}>Lab Tests Done</Table.Th>
                  <Table.Th style={{ color: '#1976D2', fontWeight: 'bold' }}>Prescriptions</Table.Th>
                  <Table.Th style={{ color: '#1976D2', fontWeight: 'bold' }}>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {patientData.appointments.map((appointment, index) => (
                  <Table.Tr key={index}>
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
          </Tabs.Panel>

          <Tabs.Panel value="prescriptions">
            <Text size="lg" fw={600} c="#1A5E63">Prescriptions</Text>
            <Text c="dimmed" mt="md">Prescriptions functionality coming soon...</Text>
          </Tabs.Panel>

          <Tabs.Panel value="laboratories">
            <Text size="lg" fw={600} c="#1A5E63">Laboratory Requests</Text>
            <Text c="dimmed" mt="md">Laboratory requests functionality coming soon...</Text>
          </Tabs.Panel>
        </Tabs>
        
        <Box mt="xl" style={{ textAlign: 'center' }}>
          <Button 
            onClick={handleGoBack}
            leftSection={<IconArrowLeft />}
            style={{
              backgroundColor: '#4FD1C7',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px'
            }}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </MedicalClinicLayout>
  );
};