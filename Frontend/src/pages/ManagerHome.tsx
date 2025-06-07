import ManagerDashboard from '../features/dashboard/ManagerDashboard';
export default function ManagerHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
      <ManagerDashboard />
    </div>
  );
}