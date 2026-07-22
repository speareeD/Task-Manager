import { NavLink } from 'react-router-dom';

export default function Projects() {
  const projects = [
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Acme Inc.',
      status: 'Active',
      tasks: 12,
      members: 5,
    },
    {
      id: 2,
      name: 'Mobile App',
      description: 'Internal project',
      status: 'Completed',
      tasks: 34,
      members: 8,
    },
    {
      id: 3,
      name: 'CRM Migration',
      description: 'Legacy system replacement',
      status: 'In Progress',
      tasks: 7,
      members: 3,
    },
  ];
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Projects</h1>

        <button className="px-5 py-2 bg-black text-white rounded-lg">New Project</button>
      </div>

      <div className="flex gap-4 mb-6">
        <input placeholder="Search projects..." className="flex-1 border rounded-lg px-4 py-2" />

        <select className="border rounded-lg px-4">
          <option>All</option>
          <option>Active</option>
          <option>Completed</option>
        </select>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white border rounded-xl p-6 hover:shadow-sm transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">{project.name}</h2>

                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                    {project.status}
                  </span>
                </div>

                <p className="text-gray-500 mt-2">{project.description}</p>

                <div className="flex gap-6 mt-4 text-sm text-gray-500">
                  <span>{project.tasks} Tasks</span>
                  <span>{project.members} Members</span>
                </div>
              </div>

              <div className="flex gap-2">
                <NavLink to={'/projects/' + project.id} className="px-4 py-2 border rounded-lg">
                  View
                </NavLink>

                <NavLink
                  to={'/projects/' + project.id + '/settings'}
                  className="px-4 py-2 bg-black text-white rounded-lg"
                >
                  Edit
                </NavLink>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
