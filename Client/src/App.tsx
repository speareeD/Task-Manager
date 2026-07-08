import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '@/pages/Login';
import Invite from '@/pages/Invite';
import Dashboard from '@/pages/Dashboard';
import HomeRedirect from '@/components/HomeRedirect';
import NotFound from '@/pages/NotFound';
import Invitation from '@/pages/Invitation';

import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import AdminRoute from '@/components/AdminRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/invitation/:email" element={<Invitation />} />

        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/invite" element={<Invite />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
