export default function ProjectTasks() {
  const tasks = [
    {
      id: 1,
      title: 'Design Landing Page',
      status: 'In Progress',
    },
    {
      id: 2,
      title: 'Create Login API',
      status: 'Done',
    },
    {
      id: 3,
      title: 'Dashboard UI',
      status: 'Todo',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Tasks</h2>

        <button className="bg-black text-white px-4 py-2 rounded-lg">New Task</button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Task</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t">
                <td className="p-4">{task.title}</td>
                <td className="p-4">{task.status}</td>

                <td className="p-4 text-right">
                  <button className="text-sm px-3 py-1 border rounded">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
