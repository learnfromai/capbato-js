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
    it('should apply hover styles when mouse enters a navigation item', () => {
      renderWithProviders(<MedicalClinicSidebar />);
      
      // Debug the rendered output
      screen.debug();
      
      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toBeInTheDocument();
      
      // Initial state should not have hover styles
      expect(dashboardLink).toHaveStyle({
        backgroundColor: 'transparent',
        color: '#666'
      });
      
      // Simulate mouse enter
      fireEvent.mouseEnter(dashboardLink!);
      
      // Should have hover styles
      expect(dashboardLink).toHaveStyle({
        backgroundColor: '#f8f9fa',
        color: '#4db6ac'
      });
    });

    it('should remove hover styles when mouse leaves a navigation item', () => {
      renderWithProviders(<MedicalClinicSidebar />);
      
      const dashboardLink = screen.getByText('Dashboard').closest('button');
      expect(dashboardLink).toBeInTheDocument();
      
      // Simulate mouse enter and then leave
      fireEvent.mouseEnter(dashboardLink!);
      fireEvent.mouseLeave(dashboardLink!);
      
      // Should return to normal styles
      expect(dashboardLink).toHaveStyle({
        backgroundColor: 'transparent',
        color: '#666'
      });
    });

    it('should apply hover styles to both icon and text', () => {
      renderWithProviders(<MedicalClinicSidebar />);
      
      const dashboardLink = screen.getByText('Dashboard').closest('button');
      const dashboardIcon = screen.getByTestId('icon-fas fa-tachometer-alt');
      const dashboardText = screen.getByText('Dashboard');
      
      // Simulate mouse enter
      fireEvent.mouseEnter(dashboardLink!);
      
      // Both icon and text should have hover color
      expect(dashboardIcon).toHaveStyle({ color: '#4db6ac' });
      expect(dashboardText).toHaveStyle({ color: '#4db6ac' });
    });

    it('should not apply hover styles to active item', () => {
      // Mock useLocation to return dashboard path
      const mockUseLocation = vi.fn(() => ({ pathname: '/dashboard' }));
      vi.doMock('react-router-dom', () => ({
        ...vi.importActual('react-router-dom'),
        useLocation: mockUseLocation,
      }));
      
      renderWithProviders(<MedicalClinicSidebar />);
      
      const dashboardLink = screen.getByText('Dashboard').closest('button');
      
      // Active item should have active styles, not hover styles
      expect(dashboardLink).toHaveStyle({
        backgroundColor: '#e8f5e8',
        color: '#4db6ac'
      });
      
      // Hover should not change active item styles
      fireEvent.mouseEnter(dashboardLink!);
      expect(dashboardLink).toHaveStyle({
        backgroundColor: '#e8f5e8',
        color: '#4db6ac'
      });
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
  });
});