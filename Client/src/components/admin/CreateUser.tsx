import { useState } from 'react';
import { register } from '@/services/authService';

interface Props {
  onCreated: () => Promise<void>;
}

export default function CreateUser({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const [invitationUrl, setInvitationUrl] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    if (!name.trim() || !email.trim()) return;

    try {
      setLoading(true);
      setError('');
      setInvitationUrl('');
      setCopied(false);

      const result = await register({
        name,
        email,
        isAdmin,
      });

      setInvitationUrl(result.url);

      setName('');
      setEmail('');
      setIsAdmin(false);

      await onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function copyInvitation() {
    if (!invitationUrl) return;

    await navigator.clipboard.writeText(invitationUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <>
      <tr className="border-t bg-gray-50">
        <td className="p-2">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </td>

        <td className="p-2">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void handleCreate();
              }
            }}
          />
        </td>

        <td className="p-2">
          <select
            className="border rounded px-3 py-2"
            value={isAdmin ? 'admin' : 'user'}
            onChange={(e) => setIsAdmin(e.target.value === 'admin')}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </td>

        <td className="p-2 text-right">
          <button
            disabled={loading}
            onClick={() => void handleCreate()}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </td>
      </tr>

      {error && (
        <tr>
          <td colSpan={4} className="p-4">
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-600">
              {error}
            </div>
          </td>
        </tr>
      )}

      {invitationUrl && (
        <tr>
          <td colSpan={4} className="p-4">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <p className="text-sm font-medium text-green-700 mb-3">
                Invitation created successfully
              </p>

              <div className="flex gap-2">
                <input
                  readOnly
                  value={invitationUrl}
                  className="flex-1 px-3 py-2 border rounded bg-white"
                />

                <button
                  type="button"
                  onClick={copyInvitation}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
