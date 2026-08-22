import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from '@/admin/lib/AuthContext';
import RequireAuth from '@/admin/components/RequireAuth';
import LoginPage from '@/admin/pages/LoginPage';
import DashboardPage from '@/admin/pages/DashboardPage';
import BookingsListPage from '@/admin/pages/BookingsListPage';
import BookingDetailPage from '@/admin/pages/BookingDetailPage';
import SettingsPage from '@/admin/pages/SettingsPage';
import TestimonialsAdminPage from '@/admin/pages/TestimonialsAdminPage';
import PackagesAdminPage from '@/admin/pages/PackagesAdminPage';
import ServicesAdminPage from '@/admin/pages/ServicesAdminPage';
import PortfolioAdminPage from '@/admin/pages/PortfolioAdminPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<RequireAuth><DashboardPage /></RequireAuth>} />
          <Route path="/admin/bookings" element={<RequireAuth><BookingsListPage /></RequireAuth>} />
          <Route path="/admin/bookings/:id" element={<RequireAuth><BookingDetailPage /></RequireAuth>} />
          <Route path="/admin/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
          <Route path="/admin/content/testimonials" element={<RequireAuth><TestimonialsAdminPage /></RequireAuth>} />
          <Route path="/admin/content/packages" element={<RequireAuth><PackagesAdminPage /></RequireAuth>} />
          <Route path="/admin/content/services" element={<RequireAuth><ServicesAdminPage /></RequireAuth>} />
          <Route path="/admin/content/portfolio" element={<RequireAuth><PortfolioAdminPage /></RequireAuth>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
