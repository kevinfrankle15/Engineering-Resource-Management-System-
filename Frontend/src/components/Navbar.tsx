// import { useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../context/authStore';

// export default function Navbar() {
//   const user = useAuthStore((state) => state.user);
//   const setUser = useAuthStore((state) => state.setUser);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     setUser(null);
//     navigate('/');
//   };

//   return (
//     <nav className="bg-white p-4 shadow mb-6 flex justify-between">
//       <span className="font-semibold">Resource Manager</span>
//       {user && (
//         <div className="flex items-center gap-4">
//           <span className="text-sm">{user.name}</span>
//           <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
//             Logout
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// }

import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    navigate('/');
  };

  return (
    <nav className="bg-white p-4 shadow mb-6 flex justify-between items-center">
      <span className="font-bold text-lg">Resource Manager</span>
      {user && (
        <div className="flex gap-6 items-center text-sm">
          {/* {user.role === 'manager' && (
            <>
              <Link to="/assignments" className="hover:underline">Assignments</Link>
              <Link to="/projects" className="hover:underline">Projects</Link>
            </>
          )}
          {user.role === 'engineer' && (
            <Link to="/profile" className="hover:underline">Profile</Link>
          )} */}
          {user.role === 'manager' && (
  <>
    <Link to="/manager" className="hover:underline">Dashboard</Link>
    <Link to="/assignments" className="hover:underline">Assignments</Link>
    <Link to="/projects" className="hover:underline">Projects</Link>
  </>
)}
{user.role === 'engineer' && (
  <>
    <Link to="/engineer" className="hover:underline">Dashboard</Link>
    <Link to="/profile" className="hover:underline">Profile</Link>
  </>
)}
          <span>{user.name}</span>
          <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
        </div>
      )}
    </nav>
  );
}

