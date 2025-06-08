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

export default function AssignmentForm() {
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
    } catch (err) {
      console.error(' Assignment error:', err);
      alert(' Error creating assignment');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border p-4 rounded space-y-3">
      <h3 className="font-semibold text-lg">Create Assignment</h3>

      <input
        {...register('engineerId', { required: true })}
        placeholder="Engineer ID"
        className="input w-full"
      />

      <input
        {...register('projectId', { required: true })}
        placeholder="Project ID"
        className="input w-full"
      />

      <input
        type="number"
        {...register('allocationPercentage', { required: true, min: 1, max: 100 })}
        placeholder="Allocation %"
        className="input w-full"
      />

      <input
        type="date"
        {...register('startDate', { required: true })}
        className="input w-full"
      />

      <input
        type="date"
        {...register('endDate', { required: true })}
        className="input w-full"
      />

      <input
        {...register('role', { required: true })}
        placeholder="Role (e.g., Developer)"
        className="input w-full"
      />

      <button type="submit" className="btn btn-primary w-full">
        Assign
      </button>
    </form>
  );
}
