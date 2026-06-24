import { useState } from 'react';
import { login, saveToken } from '@services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      const result = await login({ email, password });
      saveToken(result.token);
      alert('Login successful');
      window.location.href = '/dashboard';
    } catch (error: any) {
      setError(error.message || "Something went wrong")
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a href="/register" className="text-black font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
