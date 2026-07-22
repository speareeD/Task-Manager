export default function ProjectSettings() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold mb-8">Project Settings</h2>

      <div className="bg-white border rounded-xl p-6 space-y-6">
        <div>
          <label className="block mb-2 font-medium">Project Name</label>

          <input defaultValue="Website Redesign" className="w-full border rounded-lg px-4 py-2" />
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>

          <textarea
            rows={4}
            defaultValue="Redesigning the company website."
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="flex gap-4">
          <button className="bg-black text-white px-5 py-2 rounded-lg">Save Changes</button>

          <button className="border border-red-500 text-red-500 px-5 py-2 rounded-lg">
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
}
