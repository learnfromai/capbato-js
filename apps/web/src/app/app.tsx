import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../presentation/features/login';
import { AuthGuard } from '../presentation/components/auth';
import { Layout } from '../presentation/components/layout';
import { DashboardPage } from '../presentation/features/dashboard';
import { AppointmentsPage } from '../presentation/features/appointments';
import { PatientsPage } from '../presentation/features/patients';
import { LaboratoryPage } from '../presentation/features/laboratory';
import { PrescriptionsPage } from '../presentation/features/prescriptions';
import { DoctorsPage } from '../presentation/features/doctors';
import { AccountsPage } from '../presentation/features/accounts';
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
        <Route path="/" element={
          <AuthGuard requireAuth={true}>
            <Layout>
              <DashboardPage />
            </Layout>
          </AuthGuard>
        } />
        <Route path="/appointments" element={
          <AuthGuard requireAuth={true}>
            <Layout>
              <AppointmentsPage />
            </Layout>
          </AuthGuard>
        } />
        <Route path="/patients" element={
          <AuthGuard requireAuth={true}>
            <Layout>
              <PatientsPage />
            </Layout>
          </AuthGuard>
        } />
        <Route path="/laboratory" element={
          <AuthGuard requireAuth={true}>
            <Layout>
              <LaboratoryPage />
            </Layout>
          </AuthGuard>
        } />
        <Route path="/prescriptions" element={
          <AuthGuard requireAuth={true}>
            <Layout>
              <PrescriptionsPage />
            </Layout>
          </AuthGuard>
        } />
        <Route path="/doctors" element={
          <AuthGuard requireAuth={true}>
            <Layout>
              <DoctorsPage />
            </Layout>
          </AuthGuard>
        } />
        <Route path="/accounts" element={
          <AuthGuard requireAuth={true}>
            <Layout>
              <AccountsPage />
            </Layout>
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
