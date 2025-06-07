
// import { Routes, Route } from 'react-router-dom';
// import Login from '../pages/Login';
// import ManagerHome from '../pages/ManagerHome';
// import EngineerHome from '../pages/EngineerHome';
// import NotFound from '../pages/NotFound';
// import AppLayout from '../layouts/AppLayout';
// import Assignments from '../pages/Assignments';
// import Profile from '../pages/Profile';
// import EngineerDashboard from '../features/dashboard/EngineerDashboard';
// import ManagerDashboard from '../features/dashboard/ManagerDashboard';

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//         <Route element={<AppLayout />}>
//         <Route path="/manager" element={<ManagerHome />} />
//         <Route path="/engineer" element={<EngineerHome />} />
//         <Route path="/assignments" element={<Assignments />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/engineer" element={<EngineerDashboard />} />
//         <Route path="/manager" element={<ManagerDashboard />} />
// {/* <Route path="/projects" element={<ManagerProjects />} /> */}
//       </Route>
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import AppLayout from '../layouts/AppLayout';
import Assignments from '../pages/Assignments';
import Profile from '../pages/Profile';
import EngineerDashboard from '../features/dashboard/EngineerDashboard';
import ManagerDashboard from '../features/dashboard/ManagerDashboard';
import ProtectedRoute from './ProtectedRoute';
import ProjectList from '../features/projects/ProjectList';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<AppLayout />}>
        <Route
          path="/manager"
          element={
            <ProtectedRoute role="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/engineer"
          element={
            <ProtectedRoute role="engineer">
              <EngineerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <ProtectedRoute role="manager">
              <Assignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="engineer">
              <Profile />
            </ProtectedRoute>
          }
        />

<Route
  path="/projects"
  element={
    <ProtectedRoute role="manager">
      <ProjectList />
    </ProtectedRoute>
  }
/>
        {/* Uncomment if you have a project page later */}
        {/* <Route path="/projects" element={<ManagerProjects />} /> */}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
