import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Tabs, Button, Grid, Text, Table, Alert, Loader } from '@mantine/core';
import { IconUser, IconNotes, IconCalendar, IconPrescription, IconFlask, IconArrowLeft } from '@tabler/icons-react';
import { MedicalClinicLayout } from '../../../components/layout';
import { usePatientDetailsViewModel } from '../view-models/usePatientDetailsViewModel';
import { PatientDetails, GuardianDetails, Appointment } from '../types';

const PatientInfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box
    style={{
      background: 'transparent',
      padding: 0,
      borderRadius: 0,
      border: 'none',
      boxShadow: 'none',
      textAlign: 'left'
    }}
  >
    <Text
      style={{
        marginBottom: '20px',
        color: '#004f6e',
        fontSize: '20px',
        fontWeight: 'bold',
        borderBottom: '2px solid #4db6ac',
        paddingBottom: '8px'
      }}
    >
      {title}
    </Text>
    {children}
  </Box>
);

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <Text style={{ fontSize: '15px', margin: '8px 0', color: '#333' }}>
    <strong>{label}:</strong> {value}
  </Text>
);

const PatientInfoTab: React.FC<{ patient: PatientDetails }> = ({ patient }) => {
  const formatAddress = (address: any) => {
    if (typeof address === 'string') return address;
    return `${address.street}, ${address.city}, ${address.province} ${address.zipCode}`;
  };

  return (
    <Grid style={{ gap: '50px', maxWidth: '100%', margin: 0, padding: '0 20px' }}>
      <Grid.Col span={6}>
        <PatientInfoCard title="Patient Information">
          <InfoRow label="Patient #" value={patient.patientNumber} />
          <InfoRow label="Full Name" value={patient.fullName} />
          <InfoRow label="Gender" value={patient.gender} />
          <InfoRow label="Age" value={patient.age} />
          <InfoRow label="Date of Birth" value={new Date(patient.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
          <InfoRow label="Contact Number" value={patient.phoneNumber} />
          <InfoRow label="Address" value={formatAddress(patient.address)} />
        </PatientInfoCard>
      </Grid.Col>
      <Grid.Col span={6}>
        <PatientInfoCard title="Guardian Details">
          {patient.guardian ? (
            <>
              <InfoRow label="Full Name" value={patient.guardian.fullName} />
              <InfoRow label="Gender" value={patient.guardian.gender} />
              <InfoRow label="Relationship" value={patient.guardian.relationship} />
              <InfoRow label="Contact Number" value={patient.guardian.contactNumber} />
              <InfoRow label="Address" value={patient.guardian.address} />
            </>
          ) : (
            <Text style={{ fontSize: '15px', color: '#666' }}>No guardian information available</Text>
          )}
        </PatientInfoCard>
      </Grid.Col>
    </Grid>
  );
};

const AppointmentsTab: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = ((h + 11) % 12 + 1);
    return `${hour12}:${minute} ${suffix}`;
  };

  return (
    <Box style={{ padding: '0 20px' }}>
      <Text
        style={{
          color: '#004f6e',
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          marginTop: 0,
          borderBottom: '2px solid #4db6ac',
          paddingBottom: '8px'
        }}
      >
        Appointments
      </Text>
      <Table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '12px',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        <Table.Thead style={{ background: '#dbeeff' }}>
          <Table.Tr>
            <Table.Th style={{ padding: '12px', textAlign: 'center', color: '#0047ab', fontWeight: 600 }}>Date</Table.Th>
            <Table.Th style={{ padding: '12px', textAlign: 'center', color: '#0047ab', fontWeight: 600 }}>Time</Table.Th>
            <Table.Th style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', color: '#0047ab', fontWeight: 600 }}>Reason for Visit</Table.Th>
            <Table.Th style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', color: '#0047ab', fontWeight: 600 }}>Lab Tests Done</Table.Th>
            <Table.Th style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', color: '#0047ab', fontWeight: 600 }}>Prescriptions</Table.Th>
            <Table.Th style={{ padding: '12px', textAlign: 'center', color: '#0047ab', fontWeight: 600 }}>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {appointments.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                No appointments found.
              </Table.Td>
            </Table.Tr>
          ) : (
            appointments.map((appointment) => (
              <Table.Tr key={appointment.id}>
                <Table.Td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                  {formatDate(appointment.date)}
                </Table.Td>
                <Table.Td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                  {formatTime(appointment.time)}
                </Table.Td>
                <Table.Td style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', borderBottom: '1px solid #ddd' }}>
                  {appointment.reasonForVisit}
                </Table.Td>
                <Table.Td style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', borderBottom: '1px solid #ddd' }}>
                  {appointment.labTestsDone}
                </Table.Td>
                <Table.Td style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', borderBottom: '1px solid #ddd' }}>
                  {appointment.prescriptions}
                </Table.Td>
                <Table.Td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                  {appointment.status}
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

const PlaceholderTab: React.FC<{ title: string }> = ({ title }) => (
  <Box style={{ padding: '0 20px' }}>
    <Text
      style={{
        color: '#004f6e',
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '20px',
        marginTop: 0,
        borderBottom: '2px solid #4db6ac',
        paddingBottom: '8px'
      }}
    >
      {title}
    </Text>
    <Text style={{ fontSize: '16px', color: '#666' }}>
      {title} functionality will be implemented in future iterations.
    </Text>
  </Box>
);

export const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patient, isLoading, error, hasError, clearError } = usePatientDetailsViewModel(id);

  const handleGoBack = () => {
    navigate('/patients');
  };

  if (isLoading) {
    return (
      <MedicalClinicLayout>
        <Box
          style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            minHeight: 'calc(100vh - 140px)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <Loader size="lg" />
          <Text mt="md" style={{ color: '#666' }}>Loading patient details...</Text>
        </Box>
      </MedicalClinicLayout>
    );
  }

  if (hasError || !patient) {
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
          <Alert 
            color="red" 
            title="Patient Not Found"
            onClose={clearError}
            withCloseButton
          >
            {error || `The patient with ID "${id}" could not be found.`}
          </Alert>
          <Button 
            leftSection={<IconArrowLeft size={16} />}
            onClick={handleGoBack}
            style={{
              marginTop: '20px',
              background: '#4db6ac',
              color: 'white'
            }}
          >
            Go Back to Patients
          </Button>
        </Box>
      </MedicalClinicLayout>
    );
  }

  return (
    <MedicalClinicLayout>
      <Box
        style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          minHeight: 'calc(100vh - 140px)',
          position: 'relative',
          marginBottom: '80px'
        }}
      >
        <Tabs
          defaultValue="patient-info"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Tabs.List
            style={{
              background: 'transparent',
              padding: 0,
              borderRadius: 0,
              boxShadow: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'nowrap',
              gap: '8px',
              overflowX: 'auto',
              marginBottom: '30px'
            }}
          >
            <Tabs.Tab
              value="patient-info"
              leftSection={<IconUser size={16} />}
              style={{
                flex: '1 1 auto',
                textAlign: 'center',
                background: '#e0f2f1',
                color: '#00695c',
                border: 'none',
                padding: '10px 15px',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '110px',
                whiteSpace: 'nowrap'
              }}
            >
              Patient Info
            </Tabs.Tab>
            <Tabs.Tab
              value="medical-records"
              leftSection={<IconNotes size={16} />}
              style={{
                flex: '1 1 auto',
                textAlign: 'center',
                background: '#e0f2f1',
                color: '#00695c',
                border: 'none',
                padding: '10px 15px',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '110px',
                whiteSpace: 'nowrap'
              }}
            >
              Medical Records
            </Tabs.Tab>
            <Tabs.Tab
              value="appointments"
              leftSection={<IconCalendar size={16} />}
              style={{
                flex: '1 1 auto',
                textAlign: 'center',
                background: '#e0f2f1',
                color: '#00695c',
                border: 'none',
                padding: '10px 15px',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '110px',
                whiteSpace: 'nowrap'
              }}
            >
              Appointments
            </Tabs.Tab>
            <Tabs.Tab
              value="prescriptions"
              leftSection={<IconPrescription size={16} />}
              style={{
                flex: '1 1 auto',
                textAlign: 'center',
                background: '#e0f2f1',
                color: '#00695c',
                border: 'none',
                padding: '10px 15px',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '110px',
                whiteSpace: 'nowrap'
              }}
            >
              Prescriptions
            </Tabs.Tab>
            <Tabs.Tab
              value="laboratories"
              leftSection={<IconFlask size={16} />}
              style={{
                flex: '1 1 auto',
                textAlign: 'center',
                background: '#e0f2f1',
                color: '#00695c',
                border: 'none',
                padding: '10px 15px',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '110px',
                whiteSpace: 'nowrap'
              }}
            >
              Laboratories
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="patient-info">
            <PatientInfoTab patient={patient} />
          </Tabs.Panel>

          <Tabs.Panel value="medical-records">
            <PlaceholderTab title="Medical Records" />
          </Tabs.Panel>

          <Tabs.Panel value="appointments">
            <AppointmentsTab appointments={patient.appointments || []} />
          </Tabs.Panel>

          <Tabs.Panel value="prescriptions">
            <PlaceholderTab title="Prescriptions" />
          </Tabs.Panel>

          <Tabs.Panel value="laboratories">
            <PlaceholderTab title="Laboratory Requests" />
          </Tabs.Panel>
        </Tabs>
      </Box>

      {/* Go Back Button */}
      <Box
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100
        }}
      >
        <Button
          leftSection={<IconArrowLeft size={16} />}
          onClick={handleGoBack}
          style={{
            padding: '12px 24px',
            background: '#4db6ac',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          Go Back
        </Button>
      </Box>
    </MedicalClinicLayout>
  );
};