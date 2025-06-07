import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import axios from 'axios';

export default function LoginForm() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post('/api/auth/login', data);
      setUser(res.data.user);
      navigate(res.data.user.role === 'manager' ? '/manager' : '/engineer');
      // navigate('/engineer')
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-20">
      <input {...register('email')} placeholder="Email" className="input mb-2" />
      <input type="password" {...register('password')} placeholder="Password" className="input mb-2" />
      <button type="submit" className="btn btn-primary">Login</button>
    </form>
  );
}
