import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { Login } from '@/pages/auth/Login';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { DoctorsList } from '@/pages/doctors/DoctorsList';
import { SpecialtiesList } from '@/pages/specialties/SpecialtiesList';
import { ServicesList } from '@/pages/services/ServicesList';
import { AppointmentsList } from '@/pages/appointments/AppointmentsList';
import { ContactList } from '@/pages/contact/ContactList';
import { Settings } from '@/pages/settings/Settings';
import { NotFound } from '@/pages/not-found/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Route */}
      <Route path="/login" element={<Login />} />

      {/* Redirect root to admin */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="doctors" element={<DoctorsList />} />
          <Route path="specialties" element={<SpecialtiesList />} />
          <Route path="services" element={<ServicesList />} />
          <Route path="appointments" element={<AppointmentsList />} />
          <Route path="contacts" element={<ContactList />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

