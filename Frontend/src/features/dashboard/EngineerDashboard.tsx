// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuthStore } from '../../context/authStore';
// import { AssignmentE, Project } from '../../types';

// export default function EngineerDashboard() {
//   const token = useAuthStore((state) => state.token);
//   const user = useAuthStore((state) => state.user);
//   const [assignments, setAssignmentEs] = useState<AssignmentE[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [getAssignmentNum , setGetAssignmentNum] = useState();
//   const port = process.env.REACT_APP_API_BASE_URL ||'http://localhost:5000/api';

//   const {id,name} = user as { id?: string; _id?: string; engineerId?: string; name?: string };
//   // console.log(id,name, user);
//   useEffect(() => {
//     const fetchAssignmentEs = async () => {
//       const res = await axios.get(`${port}/assignments`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setGetAssignmentNum(res.data[0]?.engineer_id)
//       const engineerAssignmentEs = res.data.filter((a: AssignmentE) => a.engineerId === user?._id);
//       // console.log(engineerAssignmentEs,"engineerAssignmentEs")
//       setAssignmentEs(engineerAssignmentEs);
//     };

//     const fetchProjects = async () => {
//       const res = await axios.get(`${port}/projects`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProjects(res.data);
//     };

//     fetchAssignmentEs();
//     fetchProjects();
//   }, [token, user?._id]);

//   const getProjectName = (projectId: string) => {
//     return projects.find((p) => p._id.toString() === projectId.toString())?.name || 'Unknown';
//   };
//   // console.log(getAssignmentNum !==id,"...",assignments.length===0 )
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">My AssignmentEs</h1>
//       {(assignments.length > 0 && getAssignmentNum !==id )? (
//         <p>No assignments found.</p>
//       ) : (
//         <ul className="space-y-4">
//           {assignments.map((a) => (
//             <li key={a._id} className="border rounded p-4">
//               <h2 className="font-semibold text-lg">{getProjectName(a.project_id)}</h2>
//               <p className="text-sm">Role: {a.role}</p>
//               <p className="text-sm">Allocation: {a.allocation_percentage}%</p>
//               <p className="text-sm">From: {a.start_date.slice(0, 10)}</p>
//               <p className="text-sm"> To: {a.end_date.slice(0, 10)}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';
import { AssignmentE, Project } from '../../types';

export default function EngineerDashboard() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [assignments, setAssignments] = useState<AssignmentE[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [getAssignmentNum, setGetAssignmentNum] = useState();
  const port =  'http://localhost:5000/api';

  const { id, name } = user as { id?: string; _id?: string; engineerId?: string; name?: string };

  useEffect(() => {
    const fetchAssignments = async () => {
      const res = await axios.get(`${port}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGetAssignmentNum(res.data[0]?.engineer_id);
      const engineerAssignments = res.data.filter((a: AssignmentE) => a.engineerId === user?._id);
      setAssignments(engineerAssignments);
    };

    const fetchProjects = async () => {
      const res = await axios.get(`${port}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    };

    fetchAssignments();
    fetchProjects();
  }, [token, user?._id]);

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p._id.toString() === projectId.toString())?.name || 'Unknown';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Assignments</h1>
      
      {(assignments.length === 0 || getAssignmentNum !== id) ? (
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <p className="text-gray-600">No assignments found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((a) => (
            <div key={a._id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h2 className="font-semibold text-lg text-gray-800 mb-2">{getProjectName(a.project_id)}</h2>
              
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
                    <p className="text-sm text-gray-800">{a.start_date.slice(0, 10)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">End:</span>
                    <p className="text-sm text-gray-800">{a.end_date.slice(0, 10)}</p>
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



