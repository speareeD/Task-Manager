import type { User } from '@/types';
import { deleteUser } from '@/services/userService';

interface Props {
  users: User[];
  onDeleted: () => Promise<void>;
}

export default function UserList({ users, onDeleted }: Props) {
  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await deleteUser(id);
      await onDeleted();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user.');
    }
  }

  return (
    <>
      {users.map((user) => (
        <tr key={user.id} className="border-t">
          <td className="p-4">{user.name}</td>

          <td className="p-4">{user.email}</td>

          <td className="p-4">{user.isAdmin ? 'Admin' : 'User'}</td>

          <td className="p-4 text-right">
            <button
              onClick={() => void handleDelete(user.id)}
              className="px-3 py-1 border rounded text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
