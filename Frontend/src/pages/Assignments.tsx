// import { useEffect, useState } from 'react';
// import { useAuthStore } from '../context/authStore';
// import axios from 'axios';
// import AssignForm from '../components/AssignForm';
// import AssignmentForm from '../features/assignment/AssignmentForm';

// interface Assignment {
//   id: number;
//   engineer_id: number;
//   project_id: number;
//   role: string;
//   allocation_percentage: number;
//   start_date: string;
//   end_date: string;
//   engineer_name: string;
//   project_name: string;
// }

// export default function Assignments() {
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const token = useAuthStore((state) => state.token);
//   const port = process.env.REACT_APP_API_BASE_URL ||'http://localhost:5000/api';

//   const fetchAssignments = async () => {
//     try {
//       const res = await axios.get(`${port}/assignments`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAssignments(res.data);
//     } catch (err) {
//       console.error('Failed to load assignments', err);
//     }
//   };

//   useEffect(() => {
//     fetchAssignments();
//   }, [token]);

//   const handleAssignClick = () => {
//     setShowForm(true);
//   };
//   // console.log(assignments,"assignments")
//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-bold">Engineer Assignments</h1>
//         <button
//           onClick={handleAssignClick}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Assign Engineer
//         </button>
//       </div>

//       {showForm && (
//         <AssignmentForm
//           onClose={() => setShowForm(false)}
//           onSuccess={() => {
//             fetchAssignments();
//             setShowForm(false);
//           }}
//         />
//       )}

//       <table className="w-full table-auto border border-gray-300 mt-6">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-2">Engineer </th>
//             <th className="p-2">Project </th>
//             <th className="p-2">Role</th>
//             <th className="p-2">Allocation %</th>
//             <th className="p-2">Start Date</th>
//             <th className="p-2">End Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {assignments.map((a) => (
//             <tr key={a.id} className="border-t">
//               <td className="p-2">{a.engineer_name}</td>
//               <td className="p-2">{a.project_name}</td>
//               <td className="p-2">{a.role}</td>
//               <td className="p-2">{a.allocation_percentage}%</td>
//               <td className="p-2">{a.start_date}</td>
//               <td className="p-2">{a.end_date}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { useAuthStore } from '../context/authStore';
import axios from 'axios';
import AssignmentForm from '../features/assignment/AssignmentForm';

interface Assignment {
  id: number;
  engineer_id: number;
  project_id: number;
  role: string;
  allocation_percentage: number;
  start_date: string;
  end_date: string;

}


export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [engineers, setEngineers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);


  const token = useAuthStore((state) => state.token);

   const port = process.env.REACT_APP_API_BASE_URL ||'http://localhost:5000/api';
   useEffect(() => {
    const fetchData = async () => {
      const engRes = await axios.get(`${port}/engineers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEngineers(engRes.data);

      const projRes = await axios.get(`${port}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projRes.data);

      // Send data back to parent
    };

    fetchData();
  }, [token]);
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${port}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load assignments', err);
      setError('Failed to load assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [token]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Engineer Assignments</h1>
          <p className="text-gray-600 mt-1">Manage engineer allocations to projects</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          <span className="font-bold text-lg">+</span>
          Assign Engineer
        </button>
      </div>

      {showForm && (
        <AssignmentForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchAssignments();
            setShowForm(false);
          }}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={fetchAssignments}
            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Retry
          </button>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-700">No assignments found. Create your first assignment.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border rounded shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engineer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allocation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map((a) => (
                <tr key={a.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {engineers.filter((obj)=>obj.id === a.engineer_id)[0]?.name||'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {projects.filter((obj)=>obj._id == a.project_id)[0]?.name||'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">{a.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${a.allocation_percentage < 50 ? 'bg-yellow-500' : 'bg-blue-600'}`}
                        style={{ width: `${a.allocation_percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 mt-1 block">
                      {a.allocation_percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{new Date(a.start_date).toLocaleDateString()}</div>
                    <div>{new Date(a.end_date).toLocaleDateString()}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
