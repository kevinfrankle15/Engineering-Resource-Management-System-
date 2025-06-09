import { useForm } from 'react-hook-form';
import { createAssignment } from '../../services/api';
import { useAuthStore } from '../../context/authStore';

interface AssignmentFormInput {
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
  role: string;
}
interface AssignFormProps {
  onClose: () => void;
  onSuccess: () => void;
}
export default function AssignmentForm({ onClose, onSuccess }: AssignFormProps) {
  const { register, handleSubmit, reset } = useForm<AssignmentFormInput>();
  const token = useAuthStore((state) => state.token);

  const onSubmit = async (data: AssignmentFormInput) => {
    if (!token) {
      alert('Unauthorized: Please login first');
      return;
    }
    // Normalize date and number types
    const payload = {
      engineerId: data.engineerId,
      projectId: data.projectId,
      allocationPercentage: Number(data.allocationPercentage),
      startDate: new Date(data.startDate).toISOString().split('T')[0], // 'YYYY-MM-DD'
      endDate: new Date(data.endDate).toISOString().split('T')[0],     // 'YYYY-MM-DD'
      role: data.role,
    };

    console.log('📦 Sending Assignment Payload:', payload);

    try {
      await createAssignment(payload, token);
      alert('Assignment created');
      reset();
      onSuccess()
    } catch (err) {
      console.error(' Assignment error:', err);
      alert(' Error creating assignment');
    }
  };

  return (
    // <form onSubmit={handleSubmit(onSubmit)} className="border p-4 rounded space-y-3">
    //   <h3 className="font-semibold text-lg">Create Assignment</h3>

    //   <input
    //     {...register('engineerId', { required: true })}
    //     placeholder="Engineer ID"
    //     className="input w-full"
    //   />

    //   <input
    //     {...register('projectId', { required: true })}
    //     placeholder="Project ID"
    //     className="input w-full"
    //   />

    //   <input
    //     type="number"
    //     {...register('allocationPercentage', { required: true, min: 1, max: 100 })}
    //     placeholder="Allocation %"
    //     className="input w-full"
    //   />

    //   <input
    //     type="date"
    //     {...register('startDate', { required: true })}
    //     className="input w-full"
    //   />

    //   <input
    //     type="date"
    //     {...register('endDate', { required: true })}
    //     className="input w-full"
    //   />

    //   <input
    //     {...register('role', { required: true })}
    //     placeholder="Role (e.g., Developer)"
    //     className="input w-full"
    //   />

    //   <button type="submit" className="btn btn-primary w-full">
    //     Assign
    //   </button>
    // </form>
    <form onSubmit={handleSubmit(onSubmit)} className="border border-gray-200 p-4 rounded-lg bg-white">
  <h3 className="font-semibold text-lg text-gray-800 mb-4">Create Assignment</h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Engineer ID*</label>
        <input
          {...register('engineerId', { required: true })}
          placeholder="ENG-001"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Allocation %*</label>
        <input
          type="number"
          {...register('allocationPercentage', { required: true, min: 1, max: 100 })}
          placeholder="1-100"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
        <input
          type="date"
          {...register('startDate', { required: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project ID*</label>
        <input
          {...register('projectId', { required: true })}
          placeholder="PRJ-100"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role*</label>
        <input
          {...register('role', { required: true })}
          placeholder="Developer"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Date*</label>
        <input
          type="date"
          {...register('endDate', { required: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  </div>

  <div className="flex justify-end gap-2 mt-6">
    <button
      type="button"
      onClick={onClose}
      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors text-gray-800"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
    >
      Assign
    </button>
  </div>
</form>
  );
}
