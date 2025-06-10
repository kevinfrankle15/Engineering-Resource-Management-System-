import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';
import { AssignmentE, Project } from '../../types';

export default function EngineerDashboard() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const [assignments, setAssignments] = useState<AssignmentE[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const port = process.env.REACT_APP_API_BASE_URL ||'http://localhost:5000/api';
  const engineerId = user?._id || user?.id || user?.engineerId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentsRes, projectsRes] = await Promise.all([
          axios.get(`${port}/assignments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${port}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const filteredAssignments = assignmentsRes.data.filter(
          (a: AssignmentE) => a.engineer_id === engineerId
        );

        setAssignments(filteredAssignments);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error('Failed to fetch assignments or projects', error);
      }
    };

    if (token && engineerId) {
      fetchData();
    }
  }, [token, engineerId]);

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p._id.toString() === projectId.toString())?.name || 'Unknown';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Assignments</h1>

      {assignments.length === 0 ? (
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <p className="text-gray-600">No assignments found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((a) => (
            <div
              key={a._id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold text-lg text-gray-800 mb-2">
                {getProjectName(a.project_id)}
              </h2>

              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">Role:</span>
                  <p className="text-sm text-gray-800">{a.role}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">Allocation:</span>
                  <p className="text-sm text-gray-800">{a.allocation_percentage}%</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Start:</span>
                    <p className="text-sm text-gray-800">{new Date(a.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">End:</span>
                    <p className="text-sm text-gray-800">{new Date(a.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
