import React from 'react';
import { Card, Text, Box, Grid } from '@mantine/core';
import { PatientDetailsData } from '../../types/patient-details.types';

interface PatientInfoTabProps {
  data: PatientDetailsData;
}

export const PatientInfoTab: React.FC<PatientInfoTabProps> = ({ data }) => {
  const { patient, guardian } = data;

  return (
    <Grid gutter="md">
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="lg" fw={600} mb="md" c="teal">
            Patient Information
          </Text>
          
          <Box>
            <Box mb="sm">
              <Text size="sm" fw={500} span>Patient #: </Text>
              <Text size="sm" span>{patient.patientNumber}</Text>
            </Box>
            
            <Box mb="sm">
              <Text size="sm" fw={500} span>Full Name: </Text>
              <Text size="sm" span>{patient.fullName}</Text>
            </Box>
            
            <Box mb="sm">
              <Text size="sm" fw={500} span>Gender: </Text>
              <Text size="sm" span>{patient.gender}</Text>
            </Box>
            
            <Box mb="sm">
              <Text size="sm" fw={500} span>Age: </Text>
              <Text size="sm" span>{patient.age}</Text>
            </Box>
            
            <Box mb="sm">
              <Text size="sm" fw={500} span>Date of Birth: </Text>
              <Text size="sm" span>{patient.dateOfBirth}</Text>
            </Box>
            
            <Box mb="sm">
              <Text size="sm" fw={500} span>Contact Number: </Text>
              <Text size="sm" span>{patient.contactNumber}</Text>
            </Box>
            
            <Box mb="sm">
              <Text size="sm" fw={500} span>Address: </Text>
              <Text size="sm" span>{patient.address}</Text>
            </Box>
          </Box>
        </Card>
      </Grid.Col>
      
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="lg" fw={600} mb="md" c="teal">
            Guardian Details
          </Text>
          
          {guardian ? (
            <Box>
              <Box mb="sm">
                <Text size="sm" fw={500} span>Full Name: </Text>
                <Text size="sm" span>{guardian.fullName}</Text>
              </Box>
              
              <Box mb="sm">
                <Text size="sm" fw={500} span>Gender: </Text>
                <Text size="sm" span>{guardian.gender}</Text>
              </Box>
              
              <Box mb="sm">
                <Text size="sm" fw={500} span>Relationship: </Text>
                <Text size="sm" span>{guardian.relationship}</Text>
              </Box>
              
              <Box mb="sm">
                <Text size="sm" fw={500} span>Contact Number: </Text>
                <Text size="sm" span>{guardian.contactNumber}</Text>
              </Box>
              
              <Box mb="sm">
                <Text size="sm" fw={500} span>Address: </Text>
                <Text size="sm" span>{guardian.address}</Text>
              </Box>
            </Box>
          ) : (
            <Text size="sm" c="gray.6">No guardian information available</Text>
          )}
        </Card>
      </Grid.Col>
    </Grid>
  );
};