import { NavLink, Outlet, useParams } from 'react-router-dom';

export default function ProjectLayout() {
  const { projectId } = useParams();

  const project = {
    id: projectId,
    name: 'Website Redesign',
    description: 'Redesigning the company website',
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `pb-3 border-b-2 transition ${
      isActive ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'
    }`;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">{project.name}</h1>
        <p className="mt-2 text-gray-500">{project.description}</p>
      </div>

      <nav className="flex gap-8 border-b mb-8">
        <NavLink end to={`/projects/${project.id}`} className={linkClass}>
          Overview
        </NavLink>

        <NavLink to={`/projects/${project.id}/tasks`} className={linkClass}>
          Tasks
        </NavLink>

        <NavLink to={`/projects/${project.id}/members`} className={linkClass}>
          Members
        </NavLink>

        <NavLink to={`/projects/${project.id}/settings`} className={linkClass}>
          Settings
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
}
