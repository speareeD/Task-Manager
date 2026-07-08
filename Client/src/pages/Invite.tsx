import { useState } from 'react';
import { register } from '@/services/authService';

export default function Invite() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [invitationUrl, setInvitationUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setInvitationUrl('');
      setCopied(false);

      const result = await register({
        name,
        email,
        isAdmin: false,
      });

      setInvitationUrl(result.url);

      setName('');
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function copyInvitation() {
    await navigator.clipboard.writeText(invitationUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">Invite user</h1>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {invitationUrl && (
          <div className="mb-5 rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm font-medium text-green-700 mb-2">Invitation created</p>

            <div className="flex gap-2">
              <input
                readOnly
                value={invitationUrl}
                className="
                  flex-1
                  px-3
                  py-2
                  text-sm
                  border
                  rounded-lg
                  bg-white
                "
              />

              <button
                type="button"
                onClick={copyInvitation}
                className="
                  px-4
                  py-2
                  bg-green-600
                  text-white
                  rounded-lg
                  hover:bg-green-700
                  transition
                "
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>

            <input
              className="
                w-full
                px-4
                py-3
                border
                rounded-lg
                focus:ring-2
                focus:ring-black
                outline-none
              "
              placeholder="John Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>

            <input
              className="
                w-full
                px-4
                py-3
                border
                rounded-lg
                focus:ring-2
                focus:ring-black
                outline-none
              "
              placeholder="john@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="
              w-full
              py-3
              bg-black
              text-white
              rounded-lg
              hover:bg-gray-900
              transition
              disabled:opacity-50
            "
          >
            {loading ? 'Creating invitation...' : 'Create invitation'}
          </button>
        </form>
      </div>
    </div>
  );
}
