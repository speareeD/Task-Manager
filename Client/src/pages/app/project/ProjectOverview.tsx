export default function ProjectOverview() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-gray-500">Tasks</h2>
          <p className="text-4xl font-bold mt-2">24</p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-gray-500">Members</h2>
          <p className="text-4xl font-bold mt-2">5</p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-gray-500">Completed</h2>
          <p className="text-4xl font-bold mt-2">18</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

        <div className="space-y-3 text-gray-600">
          <p>John completed "Create Login"</p>
          <p>Alice added "Landing Page"</p>
          <p>Mike joined the project</p>
        </div>
      </div>
    </div>
  );
}
