import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { checkInvitation, activateAccount } from '@/services/authService';

export default function Invitation() {
  const { email } = useParams();
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState('');
  const [name, setName] = useState('');

  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const result = await checkInvitation(email!);

        setUserEmail(result.email);
        setName(result.name);
      } catch {
        navigate('/');
      }
    }

    load();
  }, [email, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== repeat) {
      setError("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      setError('');

      await activateAccount({
        email: userEmail,
        password,
      });

      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow border">
        <h1 className="text-2xl font-semibold text-center mb-4">Welcome {name}</h1>

        <p className="mb-4 text-gray-500">{userEmail}</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Repeat password"
            className="w-full px-4 py-3 border rounded-lg"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            required
          />

          <button disabled={loading} className="w-full py-3 bg-black text-white rounded-lg">
            {loading ? 'Activating...' : 'Activate account'}
          </button>
        </form>
      </div>
    </div>
  );
}
