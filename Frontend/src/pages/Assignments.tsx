import { useEffect, useState } from 'react';
import { useAuthStore } from '../context/authStore';
import axios from 'axios';
import AssignForm from '../components/AssignForm';

interface Assignment {
  id: number;
  engineer_id: number;
  project_id: number;
  role: string;
  allocation_percentage: number;
  start_date: string;
  end_date: string;
  engineer_name: string;
  project_name: string;
}

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const token = useAuthStore((state) => state.token);
  const port = process.env.REACT_APP_API_BASE_URL ||'http://localhost:5000/api';

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`${port}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data);
    } catch (err) {
      console.error('Failed to load assignments', err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [token]);

  const handleAssignClick = () => {
    setShowForm(true);
  };
  // console.log(assignments,"assignments")
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Engineer Assignments</h1>
        <button
          onClick={handleAssignClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Assign Engineer
        </button>
      </div>

      {showForm && (
        <AssignForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchAssignments();
            setShowForm(false);
          }}
        />
      )}

      <table className="w-full table-auto border border-gray-300 mt-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Engineer </th>
            <th className="p-2">Project </th>
            <th className="p-2">Role</th>
            <th className="p-2">Allocation %</th>
            <th className="p-2">Start Date</th>
            <th className="p-2">End Date</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="p-2">{a.engineer_name}</td>
              <td className="p-2">{a.project_name}</td>
              <td className="p-2">{a.role}</td>
              <td className="p-2">{a.allocation_percentage}%</td>
              <td className="p-2">{a.start_date}</td>
              <td className="p-2">{a.end_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
