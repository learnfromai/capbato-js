import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

const HeaderWithRouter: React.FC = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
);

describe('Header Component', () => {
  it('renders the clinic name', () => {
    render(<HeaderWithRouter />);
    expect(screen.getByText('M.G. Amores Medical Clinic')).toBeInTheDocument();
  });

  it('displays admin user information', () => {
    render(<HeaderWithRouter />);
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('shows the user avatar', () => {
    render(<HeaderWithRouter />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});