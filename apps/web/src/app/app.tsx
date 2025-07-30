import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TodoPage } from '../presentation/features/todo';
import { AboutPage } from '../presentation/features/about';
import { LoginPage } from '../presentation/features/login';
import { DashboardPage } from '../presentation/features/dashboard';
import { AppointmentsPage } from '../presentation/features/appointments';
import { PatientsPage } from '../presentation/features/patients';
import { LaboratoryPage } from '../presentation/features/laboratory';
import { PrescriptionsPage } from '../presentation/features/prescriptions';
import { DoctorsPage } from '../presentation/features/doctors';
import { AccountsPage } from '../presentation/features/accounts';
import { AuthGuard } from '../presentation/components/auth';
import { ClinicLayout } from '../presentation/layouts';
import { useAuthStore } from '../infrastructure/state/AuthStore';
import '../styles.css';

function App() {
  const { checkAuthState } = useAuthStore();

  // Initialize authentication state on app startup
  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Protected routes - require authentication */}
        <Route path="/dashboard" element={
          <AuthGuard requireAuth={true}>
            <ClinicLayout>
              <DashboardPage />
            </ClinicLayout>
          </AuthGuard>
        } />
        <Route path="/appointments" element={
          <AuthGuard requireAuth={true}>
            <ClinicLayout>
              <AppointmentsPage />
            </ClinicLayout>
          </AuthGuard>
        } />
        <Route path="/patients" element={
          <AuthGuard requireAuth={true}>
            <ClinicLayout>
              <PatientsPage />
            </ClinicLayout>
          </AuthGuard>
        } />
        <Route path="/laboratory" element={
          <AuthGuard requireAuth={true}>
            <ClinicLayout>
              <LaboratoryPage />
            </ClinicLayout>
          </AuthGuard>
        } />
        <Route path="/prescriptions" element={
          <AuthGuard requireAuth={true}>
            <ClinicLayout>
              <PrescriptionsPage />
            </ClinicLayout>
          </AuthGuard>
        } />
        <Route path="/doctors" element={
          <AuthGuard requireAuth={true}>
            <ClinicLayout>
              <DoctorsPage />
            </ClinicLayout>
          </AuthGuard>
        } />
        <Route path="/accounts" element={
          <AuthGuard requireAuth={true}>
            <ClinicLayout>
              <AccountsPage />
            </ClinicLayout>
          </AuthGuard>
        } />

        {/* Legacy routes - keeping the original todo and about pages */}
        <Route path="/" element={
          <AuthGuard requireAuth={true}>
            <ClinicLayout>
              <DashboardPage />
            </ClinicLayout>
          </AuthGuard>
        } />
        <Route path="/todo" element={
          <AuthGuard requireAuth={true}>
            <TodoPage />
          </AuthGuard>
        } />
        <Route path="/about" element={
          <AuthGuard requireAuth={true}>
            <AboutPage />
          </AuthGuard>
        } />
        
        {/* Public routes - redirect authenticated users away */}
        <Route path="/login" element={
          <AuthGuard requireAuth={false}>
            <LoginPage />
          </AuthGuard>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
