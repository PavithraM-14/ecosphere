import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Environmental from "./pages/Environmental";
import Social from "./pages/Social";
import Governance from "./pages/Governance";
import Reports from "./pages/Reports";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/environmental" element={<Environmental />} />
        <Route path="/social" element={<Social />} />
        <Route path="/governance" element={<Governance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;