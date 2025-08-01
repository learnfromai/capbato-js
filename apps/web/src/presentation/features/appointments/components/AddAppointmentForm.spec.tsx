import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { AddAppointmentForm } from './AddAppointmentForm';

// Mock the mock data module
vi.mock('../data/mockData', () => ({
  searchPatients: vi.fn(() => []),
  getDoctorSelectOptions: vi.fn(() => [
    { value: 'doc-001', label: 'Dr. Maria Santos - General Medicine' }
  ]),
  getTimeSlotSelectOptions: vi.fn(() => [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' }
  ])
}));

// Wrapper component with Mantine provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MantineProvider>
    {children}
  </MantineProvider>
);

describe('AddAppointmentForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = (props = {}) => {
    return render(
      <AddAppointmentForm
        onSubmit={mockOnSubmit}
        isLoading={false}
        {...props}
      />,
      { wrapper: TestWrapper }
    );
  };

  it('renders form title', () => {
    renderForm();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Add Appointment');
  });

  it('renders submit button', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /add appointment/i })).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    renderForm({ isLoading: true });
    
    const submitButton = screen.getByRole('button', { name: /adding appointment/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('displays error message when provided', () => {
    const errorMessage = 'Something went wrong';
    renderForm({ error: errorMessage });
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows time slot availability notice', () => {
    renderForm();
    expect(screen.getByText(/all time slots are full for this day/i)).toBeInTheDocument();
  });
});