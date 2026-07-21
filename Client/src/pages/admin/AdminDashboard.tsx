import { graphqlClient } from '@/lib/graphql';
import { gql } from 'graphql-request';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    tasks: 0,
  });

  async function getAdminStats() {
    const token = localStorage.getItem('token');

    return graphqlClient.request(
      gql`
        query AdminStats {
          adminStats {
            users
            projects
            tasks
          }
        }
      `,
      {},
      {
        Authorization: `Bearer ${token}`,
      },
    );
  }

  useEffect(() => {
    getAdminStats().then((res) => {
      setStats(res.adminStats);
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-gray-500">Users</h2>
          <p className="text-4xl font-bold mt-2">{stats.users}</p>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-gray-500">Projects</h2>
          <p className="text-4xl font-bold mt-2">{stats.projects}</p>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-gray-500">Tasks</h2>
          <p className="text-4xl font-bold mt-2">{stats.tasks}</p>
        </div>
      </div>
    </div>
  );
}
