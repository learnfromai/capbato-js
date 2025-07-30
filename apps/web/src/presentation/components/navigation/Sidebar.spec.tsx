import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from './Sidebar';

const SidebarWithRouter: React.FC = () => (
  <BrowserRouter>
    <Sidebar />
  </BrowserRouter>
);

describe('Sidebar Component', () => {
  it('renders all navigation items', () => {
    render(<SidebarWithRouter />);
    
    expect(screen.getByTestId('nav-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('nav-appointments')).toBeInTheDocument();
    expect(screen.getByTestId('nav-patients')).toBeInTheDocument();
    expect(screen.getByTestId('nav-laboratory')).toBeInTheDocument();
    expect(screen.getByTestId('nav-prescriptions')).toBeInTheDocument();
    expect(screen.getByTestId('nav-doctors')).toBeInTheDocument();
    expect(screen.getByTestId('nav-accounts')).toBeInTheDocument();
  });

  it('renders navigation links with correct labels', () => {
    render(<SidebarWithRouter />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Appointments')).toBeInTheDocument();
    expect(screen.getByText('Patients')).toBeInTheDocument();
    expect(screen.getByText('Laboratory')).toBeInTheDocument();
    expect(screen.getByText('Prescriptions')).toBeInTheDocument();
    expect(screen.getByText('Doctors')).toBeInTheDocument();
    expect(screen.getByText('Accounts')).toBeInTheDocument();
  });

  it('has correct href attributes for navigation links', () => {
    render(<SidebarWithRouter />);
    
    expect(screen.getByTestId('nav-dashboard')).toHaveAttribute('href', '/dashboard');
    expect(screen.getByTestId('nav-appointments')).toHaveAttribute('href', '/appointments');
    expect(screen.getByTestId('nav-patients')).toHaveAttribute('href', '/patients');
    expect(screen.getByTestId('nav-laboratory')).toHaveAttribute('href', '/laboratory');
    expect(screen.getByTestId('nav-prescriptions')).toHaveAttribute('href', '/prescriptions');
    expect(screen.getByTestId('nav-doctors')).toHaveAttribute('href', '/doctors');
    expect(screen.getByTestId('nav-accounts')).toHaveAttribute('href', '/accounts');
  });
});