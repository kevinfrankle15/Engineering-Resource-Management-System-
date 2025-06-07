// TestRoutes.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function TestRoutes() {
  return (
    // <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Routing works!</h1>} />
      </Routes>
    // </BrowserRouter>
  );
}
