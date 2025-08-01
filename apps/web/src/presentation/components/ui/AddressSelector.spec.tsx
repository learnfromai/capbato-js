import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { useAddressSelector } from '../../hooks';
import { AddressSelector } from './AddressSelector';
import type { ProvinceDto, CityDto, BarangayDto } from '@nx-starter/application-shared';

// Mock the custom hook
jest.mock('../../hooks', () => ({
  useAddressSelector: jest.fn(),
}));

const mockUseAddressSelector = useAddressSelector as jest.MockedFunction<typeof useAddressSelector>;

// Test data
const mockProvinces: ProvinceDto[] = [
  { code: 'province1', name: 'Province 1' },
  { code: 'province2', name: 'Province 2' },
];

const mockCities: CityDto[] = [
  { code: 'city1', name: 'City 1' },
  { code: 'city2', name: 'City 2' },
];

const mockBarangays: BarangayDto[] = [
  { code: 'barangay1', name: 'Barangay 1' },
  { code: 'barangay2', name: 'Barangay 2' },
];

// Wrapper component for tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('AddressSelector', () => {
  const mockProvinceProps = {
    value: '',
    onChange: jest.fn(),
    error: undefined,
    disabled: false,
  };

  const mockCityProps = {
    value: '',
    onChange: jest.fn(),
    error: undefined,
    disabled: false,
  };

  const mockBarangayProps = {
    value: '',
    onChange: jest.fn(),
    error: undefined,
    disabled: false,
  };

  const mockAddressData = {
    provinces: mockProvinces,
    cities: mockCities,
    barangays: mockBarangays,
    isLoadingProvinces: false,
    isLoadingCities: false,
    isLoadingBarangays: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all address selection fields', () => {
    render(
      <TestWrapper>
        <AddressSelector
          provinceProps={mockProvinceProps}
          cityProps={mockCityProps}
          barangayProps={mockBarangayProps}
          addressData={mockAddressData}
        />
      </TestWrapper>
    );

    expect(screen.getByLabelText(/province/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city\/municipality/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/barangay/i)).toBeInTheDocument();
  });

  it('should show loading state for provinces', () => {
    const loadingData = {
      ...mockAddressData,
      isLoadingProvinces: true,
    };

    render(
      <TestWrapper>
        <AddressSelector
          provinceProps={mockProvinceProps}
          cityProps={mockCityProps}
          barangayProps={mockBarangayProps}
          addressData={loadingData}
        />
      </TestWrapper>
    );

    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
  });

  it('should disable city field when no province is selected', () => {
    const disabledCityProps = {
      ...mockCityProps,
      disabled: true,
    };

    render(
      <TestWrapper>
        <AddressSelector
          provinceProps={mockProvinceProps}
          cityProps={disabledCityProps}
          barangayProps={mockBarangayProps}
          addressData={mockAddressData}
        />
      </TestWrapper>
    );

    const cityInput = screen.getByLabelText(/city\/municipality/i);
    expect(cityInput).toBeDisabled();
  });

  it('should display error message', () => {
    const errorData = {
      ...mockAddressData,
      error: 'Failed to load address data',
    };

    render(
      <TestWrapper>
        <AddressSelector
          provinceProps={mockProvinceProps}
          cityProps={mockCityProps}
          barangayProps={mockBarangayProps}
          addressData={errorData}
        />
      </TestWrapper>
    );

    expect(screen.getByText(/failed to load address data/i)).toBeInTheDocument();
  });

  it('should call onChange when province is selected', async () => {
    const mockOnChange = jest.fn();
    const provinceProps = {
      ...mockProvinceProps,
      onChange: mockOnChange,
    };

    render(
      <TestWrapper>
        <AddressSelector
          provinceProps={provinceProps}
          cityProps={mockCityProps}
          barangayProps={mockBarangayProps}
          addressData={mockAddressData}
        />
      </TestWrapper>
    );

    const provinceSelect = screen.getByLabelText(/province/i);
    fireEvent.click(provinceSelect);

    await waitFor(() => {
      const option = screen.getByText('Province 1');
      fireEvent.click(option);
    });

    expect(mockOnChange).toHaveBeenCalledWith('province1');
  });

  it('should show proper placeholders for disabled fields', () => {
    const disabledCityProps = {
      ...mockCityProps,
      disabled: true,
    };

    const disabledBarangayProps = {
      ...mockBarangayProps,
      disabled: true,
    };

    render(
      <TestWrapper>
        <AddressSelector
          provinceProps={mockProvinceProps}
          cityProps={disabledCityProps}
          barangayProps={disabledBarangayProps}
          addressData={mockAddressData}
        />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText(/select province first/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/select city first/i)).toBeInTheDocument();
  });

  it('should handle field errors correctly', () => {
    const provincePropsWithError = {
      ...mockProvinceProps,
      error: 'Province is required',
    };

    const cityPropsWithError = {
      ...mockCityProps,
      error: 'City is required',
    };

    render(
      <TestWrapper>
        <AddressSelector
          provinceProps={provincePropsWithError}
          cityProps={cityPropsWithError}
          barangayProps={mockBarangayProps}
          addressData={mockAddressData}
        />
      </TestWrapper>
    );

    expect(screen.getByText(/province is required/i)).toBeInTheDocument();
    expect(screen.getByText(/city is required/i)).toBeInTheDocument();
  });
});