import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function MainLayout({ children }) {

  return (

    <div className="flex bg-slate-50">

      <Sidebar />

      <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">

        <Navbar />

        <main className="p-8">

          {children}

        </main>

      </div>

    </div>

  );

}

export default MainLayout;