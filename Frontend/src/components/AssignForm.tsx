// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useForm } from 'react-hook-form';
// import { useAuthStore } from '../context/authStore';

// interface AssignFormProps {
//   onClose: () => void;
//   onSuccess: () => void;
// }

// interface FormData {
//   engineer_id: number;
//   project_id: number;
//   role: string;
//   allocation_percentage: number;
//   start_date: string;
//   end_date: string;
// }

// export default function AssignForm({ onClose, onSuccess }: AssignFormProps) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>();

//   const [engineers, setEngineers] = useState<any[]>([]);
//   const [projects, setProjects] = useState<any[]>([]);
//   const token = useAuthStore((state) => state.token);

//   useEffect(() => {
//     const fetchData = async () => {
//       const engRes = await axios.get('http://localhost:5000/api/engineers', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setEngineers(engRes.data);

//       const projRes = await axios.get('http://localhost:5000/api/projects', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProjects(projRes.data);
//     };
//     fetchData();
//   }, [token]);

//   const onSubmit = async (data: FormData) => {
//     try {
//       await axios.post('http://localhost:5000/api/assignments', data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       onSuccess();
//     } catch (err) {
//       console.error('Assignment failed', err);
//     }
//   };

//   return (
//     <div className="border p-4 bg-white shadow rounded mb-6">
//       <h2 className="text-lg font-semibold mb-4">Assign Engineer</h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block mb-1">Engineer</label>
//           <select {...register('engineer_id', { required: true })} className="w-full border p-2 rounded">
//             {engineers.map((eng) => (
//               <option key={eng.id} value={eng.id}>{eng.name}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block mb-1">Project</label>
//           <select {...register('project_id', { required: true })} className="w-full border p-2 rounded">
//             {projects.map((proj) => (
//               <option key={proj.id} value={proj.id}>{proj.name}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block mb-1">Role</label>
//           <input {...register('role', { required: 'Role is required' })} className="w-full border p-2 rounded" />
//           {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
//         </div>

//         <div>
//           <label className="block mb-1">Allocation %</label>
//           <input
//             type="number"
//             {...register('allocation_percentage', {
//               required: 'Allocation is required',
//               min: { value: 1, message: 'Min 1%' },
//               max: { value: 100, message: 'Max 100%' },
//             })}
//             className="w-full border p-2 rounded"
//           />
//           {errors.allocation_percentage && (
//             <p className="text-red-500 text-sm">{errors.allocation_percentage.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block mb-1">Start Date</label>
//           <input type="date" {...register('start_date', { required: true })} className="w-full border p-2 rounded" />
//           {errors.start_date && <p className="text-red-500 text-sm">Start date is required</p>}
//         </div>

//         <div>
//           <label className="block mb-1">End Date</label>
//           <input type="date" {...register('end_date', { required: true })} className="w-full border p-2 rounded" />
//           {errors.end_date && <p className="text-red-500 text-sm">End date is required</p>}
//         </div>

//         <div className="col-span-2 flex justify-end gap-2 mt-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 rounded"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//           >
//             Assign
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../context/authStore';

interface AssignFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  engineer_id: number;
  project_id: number;
  role: string;
  allocation_percentage: number;
  start_date: string;
  end_date: string;
}

export default function AssignForm({ onClose, onSuccess }: AssignFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [engineers, setEngineers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchData = async () => {
      const engRes = await axios.get('http://localhost:5000/api/engineers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEngineers(engRes.data);

      const projRes = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projRes.data);
    };
    fetchData();
  }, [token]);

  const onSubmit = async (data: FormData) => {
    const payload = {
  engineerId: data.engineer_id,
  projectId: data.project_id,
  allocationPercentage: data.allocation_percentage,
  startDate: data.start_date,
  endDate: data.end_date,
  role: data.role,
};
    try {
      await axios.post('http://localhost:5000/api/assignments', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess();
    } catch (err) {
      console.error('Assignment failed', err);
      alert('❌ Failed to assign engineer');
    }
  };

  return (
    <div className="border p-4 bg-white shadow rounded mb-6">
      <h2 className="text-lg font-semibold mb-4">Assign Engineer</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Engineer</label>
          <select {...register('engineer_id', { required: true })} className="w-full border p-2 rounded">
            <option value="">Select Engineer</option>
            {engineers.map((eng) => (
              <option key={eng.id} value={eng.id}>{eng.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Project</label>
          <select {...register('project_id', { required: true })} className="w-full border p-2 rounded">
            <option value="">Select Project</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>{proj.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Role</label>
          <input {...register('role', { required: 'Role is required' })} className="w-full border p-2 rounded" />
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Allocation %</label>
          <input
            type="number"
            {...register('allocation_percentage', {
              required: 'Allocation is required',
              min: { value: 1, message: 'Min 1%' },
              max: { value: 100, message: 'Max 100%' },
            })}
            className="w-full border p-2 rounded"
          />
          {errors.allocation_percentage && (
            <p className="text-red-500 text-sm">{errors.allocation_percentage.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Start Date</label>
          <input type="date" {...register('start_date', { required: true })} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block mb-1">End Date</label>
          <input type="date" {...register('end_date', { required: true })} className="w-full border p-2 rounded" />
        </div>

        <div className="col-span-2 flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Assign
          </button>
        </div>
      </form>
    </div>
  );
}

