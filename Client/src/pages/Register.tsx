import { useState } from 'react';
import { register } from '@/services/authService';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      const result = await register({ name, email, password });
      alert('Registration successful');
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-semibold text-center mb-6">Create account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
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
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-black font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
