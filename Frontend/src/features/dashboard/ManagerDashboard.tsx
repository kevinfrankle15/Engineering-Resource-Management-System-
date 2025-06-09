
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuthStore } from '../../context/authStore';
// import { User, Assignment } from '../../types';
// import CapacityBar from '../../components/CapacityBar';
// import SkillTags from '../../components/SkillTags';
// import AssignmentForm from '../assignment/AssignmentForm';
// import ProjectForm from '../projects/ProjectForm';

// export default function ManagerDashboard() {
//   const [engineers, setEngineers] = useState<User[]>([]);
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const token = useAuthStore((state) => state.token);

//   useEffect(() => {
//     const fetchEngineers = async () => {
//       const res = await axios.get('http://localhost:5000/api/engineers', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setEngineers(res.data);
//     };

//     const fetchAssignments = async () => {
//       const res = await axios.get('http://localhost:5000/api/assignments', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAssignments(res.data);
//     };

//     fetchEngineers();
//     fetchAssignments();
//   }, [token]);

//   const getUsedCapacity = (engineerId: string) => {
//     return assignments
//       .filter(a => a.engineerId === engineerId)
//       .reduce((sum, a) => sum + a.allocationPercentage, 0);
//   };

//   const handleDelete = async (assignmentId: string) => {
//     // eslint-disable-next-line no-restricted-globals
//     if (!confirm('Are you sure you want to delete this assignment?')) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/assignments/${assignmentId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAssignments(assignments.filter((a) => a._id !== assignmentId));
//     } catch (err) {
//       console.error('Delete failed', err);
//       alert('Failed to delete assignment');
//     }
//   };

//   return (
//     <div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <AssignmentForm />
//         <ProjectForm />
//       </div>

//       <h2 className="text-xl font-semibold mb-2">Team Overview</h2>
//       <div className="space-y-4">
//         {engineers.map((eng) => {
//           const used = getUsedCapacity(eng._id);
//           const engAssignments = assignments.filter(a => a.engineerId === eng._id);
//           return (
//             <div key={eng._id} className="border p-4 rounded">
//               <div className="flex justify-between">
//                 <div>
//                   <p className="font-semibold">{eng.name} ({eng.seniority})</p>
//                   <SkillTags skills={eng.skills} />
//                 </div>
//                 <div className="text-sm text-right">
//                   <p>{used}% allocated</p>
//                   <CapacityBar used={used} max={eng.maxCapacity} />
//                 </div>
//               </div>
//               {engAssignments.length > 0 && (
//                 <div className="mt-2">
//                   <p className="text-xs font-medium mb-1">Assignments:</p>
//                   {engAssignments.map((a) => (
//                     <div key={a._id} className="text-xs border rounded p-2 mb-1 flex justify-between items-center">
//                       <span>{a.role} — {a.allocationPercentage}%</span>
//                       <button
//                         onClick={() => handleDelete(a._id)}
//                         className="text-red-500 hover:underline"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';
import { User, Assignment } from '../../types';
import CapacityBar from '../../components/CapacityBar';
import SkillTags from '../../components/SkillTags';
import AssignmentForm from '../assignment/AssignmentForm';
import ProjectForm from '../projects/ProjectForm';

export default function ManagerDashboard() {
  const [engineers, setEngineers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const token = useAuthStore((state) => state.token);
  const port = process.env.REACT_APP_API_BASE_URL ||'http://localhost:5000/api';

  useEffect(() => {
    const fetchEngineers = async () => {
      const res = await axios.get(`${port}/engineers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEngineers(res.data);
    };

    const fetchAssignments = async () => {
      const res = await axios.get(`${port}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data);
    };

    fetchEngineers();
    fetchAssignments();
  }, [token,port]);

  const getUsedCapacity = (engineerId: string) => {
    return assignments
      .filter(a => a.engineerId === engineerId)
      .reduce((sum, a) => sum + a?.allocationPercentage, 0);
  };

  const handleDelete = async (assignmentId: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await axios.delete(`${port}/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(assignments.filter((a) => a._id !== assignmentId));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete assignment');
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
  };

  const handleUpdate = async (updated: Assignment) => {
    try {
      const res = await axios.put(`${port}/assignments/${updated._id}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(assignments.map((a) => (a._id === updated._id ? res.data : a)));
      setEditingAssignment(null);
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update assignment');
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ProjectForm />
        <AssignmentForm />
      </div>

      <h2 className="text-xl font-semibold mb-2">Team Overview</h2>
      <div className="space-y-4">
        {engineers.map((eng) => {
          const used = getUsedCapacity(eng._id);
          const engAssignments = assignments.filter(a => a.engineerId === eng._id);
          return (
            <div key={eng._id} className="border p-4 rounded">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{eng.name} ({eng.seniority})</p>
                  <SkillTags skills={eng.skills} />
                </div>
                <div className="text-sm text-right">
                  <p>{used}% allocated</p>
                  <CapacityBar used={used} max={eng.maxCapacity} />
                </div>
              </div>
              {engAssignments.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium mb-1">Assignments:</p>
                  {engAssignments.map((a) => (
                    <div key={a._id} className="text-xs border rounded p-2 mb-1">
                      {editingAssignment?._id === a._id ? (
                        <div className="space-y-1">
                          <input
                            className="border rounded px-2 py-1 text-xs w-full"
                            value={editingAssignment?.role}
                            onChange={(e) =>
                              setEditingAssignment({ ...editingAssignment, role: e.target.value })
                            }
                          />
                          <input
                            className="border rounded px-2 py-1 text-xs w-full"
                            type="number"
                            value={editingAssignment?.allocationPercentage}
                            onChange={(e) =>
                              setEditingAssignment({
                                ...editingAssignment,
                                allocationPercentage: Number(e.target.value),
                              })
                            }
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => editingAssignment && handleUpdate(editingAssignment)}
                              className="text-green-600 hover:underline text-xs"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingAssignment(null)}
                              className="text-gray-500 hover:underline text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span>{a.role} — {a?.allocationPercentage ||''}%</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(a)}
                              className="text-blue-500 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(a._id)}
                              className="text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
