import { useNavigate } from 'react-router-dom';
import { logout } from '@/services/authService';
import { getCurrentUser } from '@/services/tokenService';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="h-16 bg-white border-b flex items-center justify-between px-8">
        <div className="text-xl font-semibold">Task Manager</div>

        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-600">Hello, {user?.unique_name}</div>

          <button onClick={handleLogout} className="px-4 py-2 bg-black text-white rounded-lg">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="bg-white rounded-2xl border p-8">
          <h1 className="text-3xl font-semibold">Dashboard</h1>

          <div className="mt-4 text-gray-600">
            <p>Hello, {user?.unique_name}</p>
            <p>{user?.email}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
