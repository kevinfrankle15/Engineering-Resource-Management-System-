import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { useState } from 'react';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white p-4 shadow-md mb-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <Link 
          to={user?.role === 'manager' ? '/manager' : '/engineer'} 
          className="font-bold text-lg text-gray-800 hover:text-blue-600 transition-colors"
        >
          Resource Manager
        </Link>

        {/* Desktop Navigation */}
        {user && (
          <div className="hidden md:flex gap-6 items-center">
            {user.role === 'manager' && (
              <>
                <Link to="/manager" className="text-gray-700 hover:text-blue-600 hover:underline transition-colors">Dashboard</Link>
                <Link to="/assignments" className="text-gray-700 hover:text-blue-600 hover:underline transition-colors">Assignments</Link>
                <Link to="/projects" className="text-gray-700 hover:text-blue-600 hover:underline transition-colors">Projects</Link>
              </>
            )}
            {user.role === 'engineer' && (
              <>
                <Link to="/engineer" className="text-gray-700 hover:text-blue-600 hover:underline transition-colors">Dashboard</Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 hover:underline transition-colors">Profile</Link>
              </>
            )}
          </div>
        )}

        {/* User Info and Actions - Desktop */}
        {user && (
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-700">👤 {user.name}</span>
            </div>
            <button 
              onClick={handleLogout} 
              className="text-red-500 hover:text-red-700 hover:underline transition-colors"
            >
              Logout
            </button>
          </div>
        )}

        {/* Mobile Menu Button */}
        {user && (
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <span className="text-2xl">✕</span> 
            ) : (
              <span className="text-2xl">☰</span> 
            )}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {user && mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-6 shadow-lg rounded-lg mt-2">
          <div className="flex flex-col gap-4">
            {user.role === 'manager' && (
              <>
                <Link 
                  to="/manager" 
                  className="block py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/assignments" 
                  className="block py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Assignments
                </Link>
                <Link 
                  to="/projects" 
                  className="block py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Projects
                </Link>
              </>
            )}
            {user.role === 'engineer' && (
              <>
                <Link 
                  to="/engineer" 
                  className="block py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="block py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}

            <div className="border-t border-gray-200 pt-4 mt-2">
              <div className="flex items-center gap-2 py-2 text-gray-700">
                <span>👤</span>
                <span>{user.name}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="w-full py-2 text-red-500 hover:text-red-700 rounded px-2 text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

