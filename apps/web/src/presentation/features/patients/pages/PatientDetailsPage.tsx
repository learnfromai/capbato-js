import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Tabs, Button, Text, Group } from '@mantine/core';
import { IconUser, IconFileText, IconCalendarCheck, IconPill, IconFlask, IconArrowLeft } from '@tabler/icons-react';
import { MedicalClinicLayout } from '../../../components/layout';
import { PatientInfoTab } from '../components/PatientInfoTab';
import { AppointmentsTab } from '../components/AppointmentsTab';
import { PlaceholderTab } from '../components/PlaceholderTab';

export const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('patient-info');

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
          position: 'relative'
        }}
      >
        <Tabs value={activeTab} onTabChange={setActiveTab} w="100%">
          <Tabs.List style={{ marginBottom: '30px' }}>
            <Tabs.Tab
              value="patient-info"
              leftSection={<IconUser size={16} />}
              style={{
                flex: '1 1 auto',
                backgroundColor: activeTab === 'patient-info' ? '#4db6ac' : '#e0f2f1',
                color: activeTab === 'patient-info' ? 'white' : '#00695c',
                border: 'none',
                fontWeight: 'bold',
                borderRadius: '8px',
                margin: '0 4px'
              }}
            >
              Patient Info
            </Tabs.Tab>
            <Tabs.Tab
              value="medical-records"
              leftSection={<IconFileText size={16} />}
              style={{
                flex: '1 1 auto',
                backgroundColor: activeTab === 'medical-records' ? '#4db6ac' : '#e0f2f1',
                color: activeTab === 'medical-records' ? 'white' : '#00695c',
                border: 'none',
                fontWeight: 'bold',
                borderRadius: '8px',
                margin: '0 4px'
              }}
            >
              Medical Records
            </Tabs.Tab>
            <Tabs.Tab
              value="appointments"
              leftSection={<IconCalendarCheck size={16} />}
              style={{
                flex: '1 1 auto',
                backgroundColor: activeTab === 'appointments' ? '#4db6ac' : '#e0f2f1',
                color: activeTab === 'appointments' ? 'white' : '#00695c',
                border: 'none',
                fontWeight: 'bold',
                borderRadius: '8px',
                margin: '0 4px'
              }}
            >
              Appointments
            </Tabs.Tab>
            <Tabs.Tab
              value="prescriptions"
              leftSection={<IconPill size={16} />}
              style={{
                flex: '1 1 auto',
                backgroundColor: activeTab === 'prescriptions' ? '#4db6ac' : '#e0f2f1',
                color: activeTab === 'prescriptions' ? 'white' : '#00695c',
                border: 'none',
                fontWeight: 'bold',
                borderRadius: '8px',
                margin: '0 4px'
              }}
            >
              Prescriptions
            </Tabs.Tab>
            <Tabs.Tab
              value="laboratories"
              leftSection={<IconFlask size={16} />}
              style={{
                flex: '1 1 auto',
                backgroundColor: activeTab === 'laboratories' ? '#4db6ac' : '#e0f2f1',
                color: activeTab === 'laboratories' ? 'white' : '#00695c',
                border: 'none',
                fontWeight: 'bold',
                borderRadius: '8px',
                margin: '0 4px'
              }}
            >
              Laboratories
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="patient-info">
            <PatientInfoTab patientId={id} />
          </Tabs.Panel>

          <Tabs.Panel value="medical-records">
            <PlaceholderTab title="Medical Records" />
          </Tabs.Panel>

          <Tabs.Panel value="appointments">
            <AppointmentsTab patientId={id} />
          </Tabs.Panel>

          <Tabs.Panel value="prescriptions">
            <PlaceholderTab title="Prescriptions" />
          </Tabs.Panel>

          <Tabs.Panel value="laboratories">
            <PlaceholderTab title="Laboratory Requests" />
          </Tabs.Panel>
        </Tabs>

        {/* Go Back Button */}
        <Group
          justify="center"
          style={{
            position: 'fixed',
            bottom: '30px',
            left: '230px',
            right: '30px',
            zIndex: 100
          }}
        >
          <Button
            leftSection={<IconArrowLeft size={16} />}
            onClick={handleGoBack}
            style={{
              backgroundColor: '#4db6ac',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '8px',
              padding: '10px 20px'
            }}
          >
            Go Back
          </Button>
        </Group>
      </Box>
    </MedicalClinicLayout>
  );
};