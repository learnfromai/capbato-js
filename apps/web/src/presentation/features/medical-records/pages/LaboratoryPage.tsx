import React from 'react';
import { Box, Button } from '@mantine/core';
import { Icon } from '../../../components/common';
import { DataTable, DataTableHeader, TableColumn } from '../../../components/common/DataTable';
import { MedicalClinicLayout } from '../../../components/layout';
import { LaboratoryResult } from '../types';

// Dummy data for laboratory results
const dummyLaboratoryResults: LaboratoryResult[] = [
  {
    id: '1',
    patientNumber: '2025-R3',
    patientName: 'Raj Va Riego',
    testType: 'Complete Blood Count (CBC)',
    datePerformed: '2025-07-28',
    status: 'Pending'
  },
  {
    id: '2',
    patientNumber: '2025-R1',
    patientName: 'Soleil Cervantes Riego',
    testType: 'Blood Chemistry',
    datePerformed: '2025-07-27',
    status: 'Pending'
  },
  {
    id: '3',
    patientNumber: '2025-R2',
    patientName: 'Ali Mercadejas Riego',
    testType: 'Urinalysis',
    datePerformed: '2025-07-26',
    status: 'Completed',
    results: 'Normal ranges'
  }
];

export const LaboratoryPage: React.FC = () => {
  const handleAddTest = () => {
    console.log('Add laboratory test clicked');
    // TODO: Implement add laboratory test functionality
  };

  const handleViewResult = (result: LaboratoryResult) => {
    console.log('View result:', result);
    // TODO: Implement view result functionality
  };

  const getStatusBadge = (status: LaboratoryResult['status']) => {
    const styles = {
      'Pending': {
        background: '#ffcc80',
        color: '#8c5000',
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block'
      },
      'Completed': {
        background: '#b9f6ca',
        color: '#006400',
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block'
      },
      'In Progress': {
        background: '#bbdefb',
        color: '#0d47a1',
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block'
      }
    };

    const defaultStyle = {
      background: '#e0e0e0',
      color: '#424242',
      padding: '5px 10px',
      borderRadius: '5px',
      fontWeight: 'bold',
      display: 'inline-block'
    };

    return (
      <span style={styles[status] || defaultStyle}>
        {status}
      </span>
    );
  };

  // Define columns for the DataTable - matching legacy structure
  const columns: TableColumn<LaboratoryResult>[] = [
    {
      key: 'patientNumber',
      header: 'Patient #',
      width: '25%',
      align: 'center',
      searchable: true
    },
    {
      key: 'patientName',
      header: 'Patient\'s Name',
      width: '35%',
      align: 'left',
      searchable: true
    },
    {
      key: 'status',
      header: 'Status',
      width: '20%',
      align: 'center',
      searchable: true,
      render: (value: LaboratoryResult['status']) => getStatusBadge(value)
    },
    {
      key: 'id',
      header: 'Results',
      width: '20%',
      align: 'center',
      searchable: false,
      render: (value: string, record: LaboratoryResult) => (
        <Button
          size="sm"
          onClick={() => handleViewResult(record)}
        >
          <Icon icon="fas fa-eye" style={{ marginRight: '6px' }} />
          View
        </Button>
      )
    }
  ];

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
        <DataTableHeader 
          title="Laboratory"
          onAddItem={handleAddTest}
          addButtonText="Add Lab Test"
          addButtonIcon="fas fa-flask"
        />
        
        <DataTable
          data={dummyLaboratoryResults}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search laboratory results by patient or status..."
          emptyStateMessage="No laboratory results found"
        />
      </Box>
    </MedicalClinicLayout>
  );
};
