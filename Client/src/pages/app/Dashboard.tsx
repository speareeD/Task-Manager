import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <h1 className="text-3xl font-semibold">Dashboard</h1>

      <div className="mt-8 bg-white rounded-xl border p-8">
        <p>Hello, {user?.name}</p>
        <p>{user?.email}</p>
      </div>
    </>
  );
}
