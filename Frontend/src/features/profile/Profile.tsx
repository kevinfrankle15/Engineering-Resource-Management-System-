import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../context/authStore';

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '',
      skills: user?.skills?.join(', ') || '',
      seniority: user?.seniority || 'mid'
    }
  });

  const onSubmit = (data: any) => {
    console.log('Updated Profile:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-3">
      <input {...register('name')} placeholder="Name" className="input w-full" />
      <input {...register('skills')} placeholder="Skills (comma separated)" className="input w-full" />
      <select {...register('seniority')} className="input w-full">
        <option value="junior">Junior</option>
        <option value="mid">Mid</option>
        <option value="senior">Senior</option>
      </select>
      <button type="submit" className="btn btn-primary">Update</button>
    </form>
  );
}