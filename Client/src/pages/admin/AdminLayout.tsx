import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-black text-white">
        <div className="p-6 text-2xl font-semibold">Admin</div>

        <nav className="flex flex-col">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `px-6 py-4 ${isActive ? 'bg-gray-800' : 'hover:bg-gray-900'}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `px-6 py-4 ${isActive ? 'bg-gray-800' : 'hover:bg-gray-900'}`
            }
          >
            Users
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
