import AppRoutes from './routes/AppRoutes';

export default function App() {
  console.log("App is inside BrowserRouter");
  return (
    <div className="min-h-screen bg-gray-100">
      <AppRoutes />
    </div>
  );
}

