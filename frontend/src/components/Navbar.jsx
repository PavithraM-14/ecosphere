import { Bell, Search, UserCircle } from "lucide-react";

function Navbar() {

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (

    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex justify-between items-center">

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          ESG Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          {today}
        </p>

      </div>

      <div className="hidden lg:flex items-center bg-slate-100 rounded-xl px-4 py-3 w-[420px]">

        <Search className="text-slate-400"/>

        <input
          placeholder="Search reports, policies..."
          className="bg-transparent outline-none ml-3 w-full"
        />

      </div>

      <div className="flex items-center gap-8">

        <div className="relative">

          <Bell className="text-amber-500"/>

          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            3
          </span>

        </div>

        <div className="flex items-center gap-3">

          <UserCircle
            size={40}
            className="text-emerald-600"
          />

          <div>

            <h3 className="font-semibold text-slate-800">
              Lakshitha
            </h3>

            <p className="text-sm text-slate-500">
              ESG Administrator
            </p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Navbar;