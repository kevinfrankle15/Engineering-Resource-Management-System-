import { useForm } from 'react-hook-form';
import { useAuthStore } from '../context/authStore';
import axios from 'axios';

interface FormData {
  name: string;
  skills: string;
  seniority: string;
}

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const port = process.env.REACT_APP_API_BASE_URL;
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: user?.name || '',
      skills: user?.skills?.join(', ') || '',
      seniority: user?.seniority || 'mid'
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...user,
        name: data.name,
        skills: data.skills.split(',').map((s) => s.trim()),
        seniority: data.seniority
      };

      const res = await axios.put(`${port}/auth/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data); // update user in store
      alert('Profile updated successfully');
      reset();
    } catch (err) {
      console.error('Profile update failed', err);
      alert('Update failed');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Update Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input {...register('name')} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Skills (comma-separated)</label>
          <input {...register('skills')} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Seniority</label>
          <select {...register('seniority')} className="w-full border p-2 rounded">
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}