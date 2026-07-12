import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Leaf,
  Users,
  ShieldCheck,
  FileText,
  Trophy,
  Settings,
} from "lucide-react";

function Sidebar() {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      isActive
        ? "bg-emerald-500 text-white shadow-lg"
        : "text-slate-300 hover:bg-slate-700 hover:text-white"
    }`;

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-emerald-900 flex flex-col shadow-2xl">

      {/* Logo */}

      <div className="p-8 border-b border-slate-700">

        <h1 className="text-3xl font-bold text-white">
          🌿 EcoSphere
        </h1>

        <p className="text-slate-300 mt-2 text-sm">
          AI Powered ESG Platform
        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 p-6 space-y-3">

        <NavLink to="/dashboard" className={navLinkClass}>
          <LayoutDashboard size={20}/>
          Dashboard
        </NavLink>

        <NavLink to="/environmental" className={navLinkClass}>
          <Leaf size={20}/>
          Environmental
        </NavLink>

        <NavLink to="/social" className={navLinkClass}>
          <Users size={20}/>
          Social
        </NavLink>

        <NavLink to="/governance" className={navLinkClass}>
          <ShieldCheck size={20}/>
          Governance
        </NavLink>

        <NavLink to="/reports" className={navLinkClass}>
          <FileText size={20}/>
          Reports
        </NavLink>

        <NavLink to="/leaderboard" className={navLinkClass}>
          <Trophy size={20}/>
          Leaderboard
        </NavLink>

        <NavLink to="/settings" className={navLinkClass}>
          <Settings size={20}/>
          Settings
        </NavLink>

      </nav>

      {/* Footer */}

      <div className="p-6 border-t border-slate-700">

        <div className="bg-white/10 rounded-xl p-4">

          <p className="font-semibold text-white">
            EcoSphere v1.0
          </p>

          <p className="text-slate-300 text-sm mt-2">
            AI Powered ESG Platform
          </p>

          <p className="text-xs text-slate-400 mt-3">
            Built for Sustainability 🌱
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;