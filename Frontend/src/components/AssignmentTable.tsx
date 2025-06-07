import { Assignment, Project } from '../types';

interface Props {
  assignments: Assignment[];
  projects: Project[];
}

export default function AssignmentTable({ assignments, projects }: Props) {
 const getProjectName = (projectId: string) =>
  projects.find(p => p._id.toString() === projectId)?.name || 'Unknown';

  return (
    <table className="w-full border text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">Project</th>
          <th className="p-2">Role</th>
          <th className="p-2">Allocation</th>
          <th className="p-2">Start</th>
          <th className="p-2">End</th>
        </tr>
      </thead>
      <tbody>
        {assignments.map((a) => (
          <tr key={a._id} className="border-t">
            <td className="p-2">{getProjectName(a.projectId)}</td>
            <td className="p-2">{a.role}</td>
            <td className="p-2">{a.allocationPercentage}%</td>
            <td className="p-2">{a.startDate}</td>
            <td className="p-2">{a.endDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}