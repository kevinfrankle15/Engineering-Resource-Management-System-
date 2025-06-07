import EngineerDashboard from '../features/dashboard/EngineerDashboard';
export default function EngineerHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Engineer Dashboard</h1>
      <EngineerDashboard />
    </div>
  );
}