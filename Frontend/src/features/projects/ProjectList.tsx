import { useEffect, useState } from 'react';
import { Project } from '../../types';
import {
  fetchProjects,
  deleteProject,
  updateProject,
} from '../../services/api';
import { useAuthStore } from '../../context/authStore';

// Toast notification component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700';

  return (
    <div className={`fixed top-4 right-4 border-l-4 p-4 rounded shadow-lg ${bgColor} z-50`}>
      <div className="flex items-center">
        <span className="mr-2">{type === 'success' ? '✓' : '⚠'}</span>
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
    </div>
  );
};

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Project>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6); // Number of projects per page
  const token = useAuthStore((state) => state.token);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    const loadProjects = async () => {
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchProjects(token);
        setProjects(res.data);
        showToast('Projects loaded successfully', 'success');
      } catch (err) {
        console.error('Failed to load projects', err);
        setError('Failed to load projects. Please try again.');
        showToast('Failed to load projects', 'error');
      } finally {
        setIsLoading(false);
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
      showToast('Project deleted successfully', 'success');
      
      // Reset to first page if the last item on the current page was deleted
      if (filteredProjects.length % projectsPerPage === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error('Failed to delete project', err);
      showToast('Failed to delete project', 'error');
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
      endDate: project.endDate,
    });
    setEditingProjectId(project._id);
  };

  const handleUpdate = async () => {
    if (!token || editingProjectId === null) return;
    try {
      const res = await updateProject(editingProjectId, editData, token);
      setProjects(projects.map((p) =>
        p._id === editingProjectId ? res.data : p
      ));
      setEditingProjectId(null);
      showToast('Project updated successfully', 'success');
      const afterUpdate = await fetchProjects(token);
      setProjects(afterUpdate.data);
    } catch (err) {
      console.error('Update failed', err);
      showToast('Failed to update project', 'error');
    }
  };

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const statusColors = {
    planning: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-purple-100 text-purple-800',
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Project Dashboard</h2>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && filteredProjects.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p>No projects found. {searchTerm ? 'Try a different search term.' : 'Create a new project to get started.'}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProjects.map((p) => (
          <div key={p._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* ... (rest of your project card rendering logic remains the same) ... */}
            {p._id === editingProjectId ? (
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Edit Project</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Project Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editData.description || ''}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Project Description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                    <input
                      type="number"
                      value={editData.teamSize || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, teamSize: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Team Size"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editData.status || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, status: e.target.value as Project['status'] })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={editData.startDate || ''}
                      onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={editData.endDate || ''}
                      onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button 
                    onClick={() => setEditingProjectId(null)} 
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdate} 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">{p.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[p.status]}`}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-4">ID: {p._id}</p>

                <p className="text-gray-600 mb-4 line-clamp-3">{p.description || 'No description provided'}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>Team: {p.teamSize} members</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Skills: {p.requiredSkills?.join(', ') || 'None specified'}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {p.startDate ? new Date(p.startDate).toLocaleDateString() : 'No start date'} - 
                      {p.endDate ? new Date(p.endDate).toLocaleDateString() : 'No end date'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 border-t pt-4">
                  <button 
                    onClick={() => handleEdit(p)} 
                    className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(p._id)} 
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {filteredProjects.length > projectsPerPage && (
        <div className="flex justify-center mt-8">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-l-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-300' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 border-t border-b ${currentPage === number ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-gray-300`}
              >
                {number}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-r-md border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 border-gray-300' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Show current page info */}
      {filteredProjects.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Showing {indexOfFirstProject + 1}-{Math.min(indexOfLastProject, filteredProjects.length)} of {filteredProjects.length} projects
        </div>
      )}
    </div>
  );
}