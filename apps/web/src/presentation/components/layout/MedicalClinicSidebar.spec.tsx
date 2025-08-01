import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { vi } from 'vitest';
import { MedicalClinicSidebar } from './MedicalClinicSidebar';

// Mock the Icon component
vi.mock('../common', () => ({
  Icon: ({ icon, style }: { icon: string; style: any }) => (
    <span data-testid={`icon-${icon}`} style={style}>
      {icon}
    </span>
  ),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MantineProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </MantineProvider>
  );
};

describe('MedicalClinicSidebar', () => {
  describe('hover functionality', () => {
    it('should apply hover styles to both icon and text', () => {
      renderWithProviders(<MedicalClinicSidebar />);
      
      const dashboardLink = screen.getByText('Dashboard').closest('a');
      const dashboardIcon = screen.getByTestId('icon-fas fa-tachometer-alt');
      const dashboardText = screen.getByText('Dashboard');
      
      // Simulate mouse enter
      fireEvent.mouseEnter(dashboardLink!);
      
      // Both icon and text should have hover color
      expect(dashboardIcon).toHaveStyle({ color: '#4db6ac' });
      expect(dashboardText).toHaveStyle({ color: '#4db6ac' });
    });

    it('should handle mouse enter and leave events', () => {
      renderWithProviders(<MedicalClinicSidebar />);
      
      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toBeInTheDocument();
      
      // Should not throw errors when hover events are triggered
      expect(() => {
        fireEvent.mouseEnter(dashboardLink!);
        fireEvent.mouseLeave(dashboardLink!);
      }).not.toThrow();
    });
  });

  describe('navigation items', () => {
    it('should render all navigation items', () => {
      renderWithProviders(<MedicalClinicSidebar />);
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Appointments')).toBeInTheDocument();
      expect(screen.getByText('Patients')).toBeInTheDocument();
      expect(screen.getByText('Laboratory')).toBeInTheDocument();
      expect(screen.getByText('Prescriptions')).toBeInTheDocument();
      expect(screen.getByText('Doctors')).toBeInTheDocument();
      expect(screen.getByText('Accounts')).toBeInTheDocument();
    });

    it('should have proper NavLink components', () => {
      renderWithProviders(<MedicalClinicSidebar />);
      
      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');
      
      const appointmentsLink = screen.getByText('Appointments').closest('a');
      expect(appointmentsLink).toHaveAttribute('href', '/appointments');
    });

    it('should render icons for all navigation items', () => {
      renderWithProviders(<MedicalClinicSidebar />);
      
      expect(screen.getByTestId('icon-fas fa-tachometer-alt')).toBeInTheDocument();
      expect(screen.getByTestId('icon-fas fa-calendar-check')).toBeInTheDocument();
      expect(screen.getByTestId('icon-fas fa-users')).toBeInTheDocument();
      expect(screen.getByTestId('icon-fas fa-flask')).toBeInTheDocument();
      expect(screen.getByTestId('icon-fas fa-prescription-bottle')).toBeInTheDocument();
      expect(screen.getByTestId('icon-fas fa-user-md')).toBeInTheDocument();
      expect(screen.getByTestId('icon-fas fa-users-cog')).toBeInTheDocument();
    });
  });
});