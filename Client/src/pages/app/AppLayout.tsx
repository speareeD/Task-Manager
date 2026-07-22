import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

export default function AppLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  function handleLogout() {
    logout();
    navigate('/login');
  }
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 text-2xl font-semibold">Task Manager</div>

        <nav className="flex-1 flex flex-col">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-6 py-4 ${isActive ? 'bg-gray-800' : 'hover:bg-gray-900'}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `px-6 py-4 ${isActive ? 'bg-gray-800' : 'hover:bg-gray-900'}`
            }
          >
            Projects
          </NavLink>
        </nav>

        <div className="border-t border-gray-800 p-6">
          <p className="text-sm">{user?.name}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>

          {user?.isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="mt-4 w-full rounded-lg border-2 border-white text-white py-2 hover:bg-white hover:text-black"
            >
              Admin Panel
            </button>
          )}

          <button
            onClick={handleLogout}
            className="mt-4 w-full rounded-lg bg-white text-black py-2"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
