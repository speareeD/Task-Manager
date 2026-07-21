import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '@/pages/Login';
import Invitation from '@/pages/Invitation';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';

import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import Users from '@/pages/admin/Users';

import HomeRedirect from '@/components/HomeRedirect';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import AdminRoute from '@/components/AdminRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        {/* public */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/invitation/:email" element={<Invitation />} />
        </Route>

        {/* authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route index path="/dashboard" element={<Dashboard />} />

          {/* admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<Users />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
