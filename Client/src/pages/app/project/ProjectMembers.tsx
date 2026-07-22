export default function ProjectMembers() {
  const members = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Owner',
    },
    {
      id: 2,
      name: 'Alice Smith',
      role: 'Developer',
    },
    {
      id: 3,
      name: 'Mike Brown',
      role: 'Designer',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Members</h2>

        <button className="bg-black text-white px-4 py-2 rounded-lg">Invite Member</button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Role</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-t">
                <td className="p-4">{member.name}</td>
                <td className="p-4">{member.role}</td>

                <td className="p-4 text-right">
                  <button className="text-sm px-3 py-1 border rounded">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
