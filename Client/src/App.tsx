import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '@/pages/Login';
import Invitation from '@/pages/Invitation';
import NotFound from '@/pages/NotFound';

import AppLayout from '@/pages/app/AppLayout';
import Dashboard from '@/pages/app/Dashboard';
import Projects from '@/pages/app/Projects';

import ProjectLayout from '@/pages/app/project/ProjectLayout';
import ProjectOverview from '@/pages/app/project/ProjectOverview';
import ProjectTasks from '@/pages/app/project/ProjectTasks';
import ProjectMembers from '@/pages/app/project/ProjectMembers';
import ProjectSettings from '@/pages/app/project/ProjectSettings';

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
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectLayout />}>
              <Route index element={<ProjectOverview />} />
              <Route path="tasks" element={<ProjectTasks />} />
              <Route path="members" element={<ProjectMembers />} />
              <Route path="settings" element={<ProjectSettings />} />
            </Route>
          </Route>

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
