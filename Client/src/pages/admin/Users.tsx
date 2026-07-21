import { useCallback, useEffect, useState } from 'react';
import { getUsers } from '@/services/userService';
import type { User } from '@/types';

import UserList from '@/components/admin/UserList';
import CreateUser from '@/components/admin/CreateUser';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  const refreshUsers = useCallback(async () => {
    const data = await getUsers();
    setUsers(data);
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    void refreshUsers();
  }, [refreshUsers]);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Users</h1>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            <CreateUser onCreated={refreshUsers} />
            <UserList users={users} onDeleted={refreshUsers} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
