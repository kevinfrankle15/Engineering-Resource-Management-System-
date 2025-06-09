import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../context/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();
  const port = process.env.REACT_APP_API_BASE_URL ||'http://localhost:5000/api';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${port}/auth/login`, {
        email,
        password,
      });

      setUser(res.data.user);
      setToken(res.data.token);

      if (res.data.user.role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/engineer');
      }
    } catch (err) {
      alert('Invalid credentials');
      console.error('Login failed', err);
    }
  };

  return (
       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <div className="text-center mb-12 space-y-2">
    <h1 className="text-3xl font-bold text-gray-800">
      Engineering Resource Management System
    </h1>
    <p className="text-gray-600 text-lg">Optimize your engineering workflows</p>
  </div>

  <div className="w-full max-w-md space-y-8">
    <div className="bg-white shadow-xl rounded-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="engineer@company.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>

    {/* <div className="text-center space-y-4">
      <p className="text-sm text-gray-600">
        <a href="#" className="text-blue-600 hover:underline">Forgot your password?</a>
      </p>
      <p className="text-sm text-gray-600">
        Don't have an account? <a href="#" className="text-blue-600 font-medium hover:underline">Request access</a>
      </p>
    </div> */}
  </div>
</div>
  );
}
