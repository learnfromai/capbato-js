import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';

const AppLayoutWithRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <AppLayout>{children}</AppLayout>
  </BrowserRouter>
);

describe('AppLayout Component', () => {
  it('renders children content', () => {
    render(
      <AppLayoutWithRouter>
        <div data-testid="test-content">Test Content</div>
      </AppLayoutWithRouter>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('includes header and sidebar components', () => {
    render(
      <AppLayoutWithRouter>
        <div>Content</div>
      </AppLayoutWithRouter>
    );
    
    // Check if header content is present
    expect(screen.getByText('M.G. Amores Medical Clinic')).toBeInTheDocument();
    
    // Check if sidebar navigation is present
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Appointments')).toBeInTheDocument();
  });
});