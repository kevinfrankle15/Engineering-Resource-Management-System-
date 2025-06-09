import { useEffect, useState } from 'react';
import { Project } from '../../types';
import {
  fetchProjects,
  deleteProject,
  updateProject,
} from '../../services/api';
import { useAuthStore } from '../../context/authStore';

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Project>>({});
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const loadProjects = async () => {
      if (!token) return;
      try {
        const res = await fetchProjects(token);
        setProjects(res.data);
      } catch (err) {
        console.error('Failed to load projects', err);
      }
    };

    loadProjects();
  }, [token]);

  const handleDelete = async (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (!token || !confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id, token);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditData({
      name: project.name,
      description: project.description,
      status: project.status,
      requiredSkills: project.requiredSkills,
      teamSize: project.teamSize,
       startDate: project.startDate,
       endDate: project.endDate
    });
    setEditingProjectId(project._id);
    
  };

const handleUpdate = async () => {
  if (!token || editingProjectId === null) return;
  // console.log(editingProjectId)
  // console.log(editData)
  try {
    const res = await updateProject(editingProjectId, editData, token);
    setProjects(projects.map((p) =>
      p._id === editingProjectId ? res.data : p
    ));
    setEditingProjectId(null);
  } catch (err) {
    console.error('Update failed', err);
    alert('Failed to update project');
  }
};

 console.log(projects)
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      {projects.map((p) => (
        <div key={p._id} className="border rounded p-4 shadow space-y-2">
          {p._id === editingProjectId ? (
           <div className="space-y-2">
  <input
    value={editData.name || ''}
    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
    className="input w-full"
    placeholder="Project Name"
  />
  <textarea
    value={editData.description || ''}
    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
    className="input w-full"
    placeholder="Project Description"
  />
  <input
    type="number"
    value={editData.teamSize || ''}
    onChange={(e) =>
      setEditData({ ...editData, teamSize: parseInt(e.target.value) })
    }
    className="input w-full"
    placeholder="Team Size"
  />
  <input
    type="date"
    value={editData.startDate || ''}
    onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
    className="input w-full"
    placeholder="Start Date"
  />
  <input
    type="date"
    value={editData.endDate || ''}
    onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
    className="input w-full"
    placeholder="End Date"
  />
  <select
    value={editData.status || ''}
    onChange={(e) =>
      setEditData({ ...editData, status: e.target.value as Project['status'] })
    }
    className="input w-full"
  >
    <option value="planning">Planning</option>
    <option value="active">Active</option>
    <option value="completed">Completed</option>
  </select>
  <div className="flex gap-2">
    <button onClick={handleUpdate} className="btn btn-success">
      Save
    </button>
    <button onClick={() => setEditingProjectId(null)} className="btn btn-ghost">
      Cancel
    </button>
  </div>
</div>

          ) : (
            <>
              <h3 className="font-bold text-lg">{p.name}</h3>
              <p className="text-sm text-gray-600">Status: {p.status}</p>
              <p className="text-sm">Description: {p.description || 'N/A'}</p>
              <p className="text-sm">
                Skills: {p.requiredSkills?.join(', ') || 'None'}
              </p>
              <p className="text-sm">
  Start: {p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : 'N/A'}
</p>
<p className="text-sm">
  End: {p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : 'N/A'}
</p>

              <p className="text-sm">Team Size: {p.teamSize}</p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => handleEdit(p)} className="text-blue-500 hover:underline text-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline text-sm">
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
