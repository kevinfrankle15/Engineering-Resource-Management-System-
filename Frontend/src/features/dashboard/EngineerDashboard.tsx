import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';
import { AssignmentE, Project } from '../../types';

export default function EngineerDashboard() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
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
      }  finally {
        setLoading(false);
      }
    };

    if (token && engineerId) {
      fetchData();
    }
  }, [token, engineerId]);

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p._id.toString() === projectId.toString())?.name || 'Unknown';
  };

  const getProjectDescription = (projectId: string) => {
    return projects.find((p) => p._id.toString() === projectId.toString())?.description || 'No description available';
  }
  
  const getProjectStatus = (projectId: string) => {
    return projects.find((p) => p._id.toString() === projectId.toString())?.status || 'Unknown';
  }

   const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    // <div className="p-6 max-w-6xl mx-auto">
    //   <h1 className="text-2xl font-bold text-gray-800 mb-6">My Assignments</h1>

    //   {assignments.length === 0 ? (
    //     <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
    //       <p className="text-gray-600">No assignments found.</p>
    //     </div>
    //   ) : (
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    //       {assignments.map((a) => (
    //         <div
    //           key={a._id}
    //           className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
    //         >
    //           <h2 className="font-semibold text-lg text-gray-800 mb-2">
    //             {getProjectName(a.project_id)}
    //           </h2>

    //           <div className="space-y-2">
    //             <div>
    //               <span className="text-sm font-medium text-gray-600">Role:</span>
    //               <p className="text-sm text-gray-800">{a.role}</p>
    //             </div>

    //             <div>
    //               <span className="text-sm font-medium text-gray-600">Allocation:</span>
    //               <p className="text-sm text-gray-800">{a.allocation_percentage}%</p>
    //             </div>

    //             <div className="grid grid-cols-2 gap-2">
    //               <div>
    //                 <span className="text-sm font-medium text-gray-600">Start:</span>
    //                 <p className="text-sm text-gray-800">{new Date(a.start_date).toLocaleDateString()}</p>
    //               </div>
    //               <div>
    //                 <span className="text-sm font-medium text-gray-600">End:</span>
    //                 <p className="text-sm text-gray-800">{new Date(a.end_date).toLocaleDateString()}</p>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   )}
    // </div>
        <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Assignments</h1>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-blue-600">
            <span className="font-medium">Total Assignments:</span> {assignments.length}
          </p>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No assignments</h3>
          <p className="mt-1 text-gray-500">You currently don't have any project assignments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((a) => (
            <div
              key={a._id}
              className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="font-bold text-xl text-gray-800 truncate">
                  {getProjectName(a.project_id)}
                </h2>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(getProjectStatus(a.project_id))}`}>
                  {getProjectStatus(a.project_id)}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {getProjectDescription(a.project_id)}
              </p>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-500">Allocation</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {a.allocation_percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${a.allocation_percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <div>
                    <span className="text-xs font-medium text-gray-500 block">Role</span>
                    <span className="text-sm font-medium text-gray-800">{a.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-gray-500 block">Start Date</span>
                    <span className="text-sm font-medium text-gray-800">
                      {new Date(a.start_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <span className="text-xs font-medium text-gray-500 block">Project ID</span>
                    <span className="text-sm font-mono text-gray-600 truncate max-w-[100px] inline-block">
                      {a.project_id}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-gray-500 block">End Date</span>
                    <span className="text-sm font-medium text-gray-800">
                      {new Date(a.end_date).toLocaleDateString()}
                    </span>
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
