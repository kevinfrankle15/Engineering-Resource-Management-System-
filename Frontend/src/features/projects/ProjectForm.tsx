// import { useForm } from 'react-hook-form';
// import { createProject } from '../../services/api';

// interface ProjectFormInput {
//   name: string;
//   description: string;
//   startDate: string;
//   endDate: string;
//   requiredSkills: string;
//   teamSize: number;
//   status: 'planning' | 'active' | 'completed';
// }

// export default function ProjectForm() {
//   const { register, handleSubmit, reset } = useForm<ProjectFormInput>();

//   const onSubmit = async (data: ProjectFormInput) => {
//     const payload = {
//       ...data,
//       requiredSkills: data.requiredSkills.split(',').map(skill => skill.trim())
//     };
//     try {
//       console.log(payload)
//       await createProject(payload);
//       alert('Project created');
//       reset();
//     } catch (err) {
//       alert('Error creating project');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="border p-4 rounded space-y-3">
//       <h3 className="font-semibold text-lg">Create Project</h3>
//       <input {...register('name')} placeholder="Project Name" className="input w-full" />
//       <textarea {...register('description')} placeholder="Description" className="input w-full" />
//       <input type="date" {...register('startDate')} className="input w-full" />
//       <input type="date" {...register('endDate')} className="input w-full" />
//       <input {...register('requiredSkills')} placeholder="Required Skills (comma-separated)" className="input w-full" />
//       <input type="number" {...register('teamSize')} placeholder="Team Size" className="input w-full" />
//       <select {...register('status')} className="input w-full">
//         <option value="planning">Planning</option>
//         <option value="active">Active</option>
//         <option value="completed">Completed</option>
//       </select>
//       <button type="submit" className="btn btn-primary w-full">Create Project</button>
//     </form>
//   );
// }


import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../context/authStore';
import { createProject } from '../../services/api';

interface ProjectFormInput {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  requiredSkills: string;
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
}

export default function ProjectForm() {
  const { register, handleSubmit, reset } = useForm<ProjectFormInput>();
  const token = useAuthStore((state) => state.token);

  const onSubmit = async (data: ProjectFormInput) => {
    const payload = {
    name: data.name,
    description: data.description,
    start_date: data.startDate,           // match backend snake_case
    end_date: data.endDate,
    required_skills: data.requiredSkills.split(',').map(skill => skill.trim()), // array
    team_size: Number(data.teamSize),
    status: data.status || 'planning',
  };

    try {
      await createProject(payload, token!);
      alert('Project created');
      reset();
    } catch (err) {
      console.error(err);
      alert('Error creating project');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border p-4 rounded space-y-3">
      <h3 className="font-semibold text-lg">Create Project</h3>
      <input {...register('name')} placeholder="Project Name" className="input w-full" />
      <textarea {...register('description')} placeholder="Description" className="input w-full" />
      <input type="date" {...register('startDate')} className="input w-full" />
      <input type="date" {...register('endDate')} className="input w-full" />
      <input {...register('requiredSkills')} placeholder="Required Skills (comma-separated)" className="input w-full" />
      <input type="number" {...register('teamSize')} placeholder="Team Size" className="input w-full" />
      <select {...register('status')} className="input w-full">
        <option value="planning">Planning</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      <button type="submit" className="btn btn-primary w-full">Create Project</button>
    </form>
  );
}
