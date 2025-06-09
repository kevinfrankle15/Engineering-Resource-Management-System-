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
    // <form onSubmit={handleSubmit(onSubmit)} className="border p-4 rounded space-y-3">
    //   <h3 className="font-semibold text-lg">Create Project</h3>
    //   <input {...register('name')} placeholder="Project Name" className="input w-full" />
    //   <textarea {...register('description')} placeholder="Description" className="input w-full" />
    //   <input type="date" {...register('startDate')} className="input w-full" />
    //   <input type="date" {...register('endDate')} className="input w-full" />
    //   <input {...register('requiredSkills')} placeholder="Required Skills (comma-separated)" className="input w-full" />
    //   <input type="number" {...register('teamSize')} placeholder="Team Size" className="input w-full" />
    //   <select {...register('status')} className="input w-full">
    //     <option value="planning">Planning</option>
    //     <option value="active">Active</option>
    //     <option value="completed">Completed</option>
    //   </select>
    //   <button type="submit" className="btn btn-primary w-full">Create Project</button>
    // </form>
    <form onSubmit={handleSubmit(onSubmit)} className="border border-gray-200 p-4 rounded-lg bg-white">
  <h3 className="font-semibold text-xl text-gray-800 mb-4">Create New Project</h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name*</label>
        <input 
          {...register('name')} 
          placeholder="Awesome Project" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
        <textarea 
          {...register('description')} 
          placeholder="Describe your project goals, vision, and key objectives..." 
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills*</label>
        <input 
          {...register('requiredSkills')} 
          placeholder="React, Node.js, UI/UX, Python, etc." 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
      </div>
    </div>

    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
          <input 
            type="date" 
            {...register('startDate')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date*</label>
          <input 
            type="date" 
            {...register('endDate')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Team Size*</label>
        <input 
          type="number" 
          {...register('teamSize')} 
          placeholder="5" 
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Status*</label>
        <select 
          {...register('status')} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="planning">planning</option>
          <option value="active">active</option>
          <option value="completed">completed</option>
        </select>
      </div>
    </div>
  </div>

  <div className="flex justify-end gap-2 mt-6">

    <button 
      type="submit" 
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
    >
      Create Project
    </button>
  </div>
</form>
  );
}
