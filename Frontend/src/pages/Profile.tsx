import { useForm } from 'react-hook-form';
import { useAuthStore } from '../context/authStore';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface FormData {
  name: string;
  skills: string;
  seniority: string;
}

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [serverError, setServerError] = useState('');
  const port = process.env.REACT_APP_API_BASE_URL ||'http://localhost:5000/api';
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormData>({
    defaultValues: {
      name: user?.name || '',
      skills: user?.skills?.join(', ') || '',
      seniority: user?.seniority || 'mid'
    }
  });

  useEffect(() => {
    reset({
      name: user?.name || '',
      skills: user?.skills?.join(', ') || '',
      seniority: user?.seniority || 'mid'
    });
  }, [user, reset]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setStatus({ type: null, message: '' });
    setServerError('');

    try {
      const payload = {
        ...user,
        name: data.name,
        skills: data.skills.split(',').map((s) => s.trim()).filter(s => s !== ''),
        seniority: data.seniority
      };

      const res = await axios.put(`${port}/auth/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
      setTimeout(() => setStatus({ type: null, message: '' }), 3000);
    } catch (err: any) {
      console.error('Profile update failed', err);
      const errorMessage = err.response?.data?.message || 'Update failed. Please try again.';
      setStatus({ type: 'error', message: errorMessage });
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Update your personal information</p>
        </div>

        {status.type && (
          <div className={`mb-6 p-4 rounded-md ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <div className="flex items-center">
              {status.type === 'success' ? (
                <span className="mr-2">✓</span>
              ) : (
                <span className="mr-2">⚠</span>
              )}
              <span>{status.message}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <input
                {...register('name', { required: 'Name is required' })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
            <div className="relative">
              <input
                {...register('skills')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                placeholder="JavaScript, React, Node.js"
              />
              <p className="mt-1 text-xs text-gray-500">Separate skills with commas</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seniority Level</label>
            <select
              {...register('seniority')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none appearance-none bg-white"
            >
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !isDirty}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg font-medium text-white ${isLoading || !isDirty ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">↻</span>
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}