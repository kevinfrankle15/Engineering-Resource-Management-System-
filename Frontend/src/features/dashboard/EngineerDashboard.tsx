import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';
import { AssignmentE, Project } from '../../types';

export default function EngineerDashboard() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [assignments, setAssignmentEs] = useState<AssignmentE[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [getAssignmentNum , setGetAssignmentNum] = useState();
  const port = process.env.REACT_APP_API_BASE_URL ||'http://localhost:5000/api';

  const {id,name} = user as { id?: string; _id?: string; engineerId?: string; name?: string };
  console.log(id,name, user);
  useEffect(() => {
    const fetchAssignmentEs = async () => {
      const res = await axios.get(`${port}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGetAssignmentNum(res.data[0].engineer_id)
      const engineerAssignmentEs = res.data.filter((a: AssignmentE) => a.engineerId === user?._id);
      console.log(engineerAssignmentEs,"engineerAssignmentEs")
      setAssignmentEs(engineerAssignmentEs);
    };

    const fetchProjects = async () => {
      const res = await axios.get(`${port}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    };

    fetchAssignmentEs();
    fetchProjects();
  }, [token, user?._id]);

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p._id.toString() === projectId.toString())?.name || 'Unknown';
  };
  console.log(getAssignmentNum !==id,"...",assignments.length===0 )
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My AssignmentEs</h1>
      {(assignments.length > 0 && getAssignmentNum !==id )? (
        <p>No assignments found.</p>
      ) : (
        <ul className="space-y-4">
          {assignments.map((a) => (
            <li key={a._id} className="border rounded p-4">
              <h2 className="font-semibold text-lg">{getProjectName(a.project_id)}</h2>
              <p className="text-sm">Role: {a.role}</p>
              <p className="text-sm">Allocation: {a.allocation_percentage}%</p>
              <p className="text-sm">From: {a.start_date.slice(0, 10)}</p>
              <p className="text-sm"> To: {a.end_date.slice(0, 10)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}






