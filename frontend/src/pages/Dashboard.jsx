import MainLayout from "../components/MainLayout";
import MetricCard from "../components/MetricCard";
import DashboardChart from "../components/DashboardChart";
import ESGPieChart from "../components/ESGPieChart";
import LeaderboardCard from "../components/LeaderboardCard";
import RecentActivities from "../components/RecentActivities";
import AIInsightCard from "../components/AIInsightCard";

import {
  Leaf,
  Factory,
  Users,
  ShieldAlert,
} from "lucide-react";

function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-8">

        {/* Welcome */}

        <div>
          <h1 className="text-4xl font-bold text-green-700">
            Welcome back, Lakshitha 👋
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor sustainability, governance and ESG performance from one intelligent dashboard.
          </p>
        </div>

        {/* KPI Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <MetricCard
            title="ESG Score"
            value="92"
            icon={<Leaf size={35}/>}
            color="text-green-600"
          />

          <MetricCard
            title="Carbon Footprint"
            value="67 t"
            icon={<Factory size={35}/>}
            color="text-red-500"
          />

          <MetricCard
            title="CSR Activities"
            value="24"
            icon={<Users size={35}/>}
            color="text-blue-500"
          />

          <MetricCard
            title="Compliance Issues"
            value="3"
            icon={<ShieldAlert size={35}/>}
            color="text-yellow-500"
          />

        </div>

        {/* Charts */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2">
            <DashboardChart />
          </div>

          <ESGPieChart />

        </div>

        {/* Bottom */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <RecentActivities />
          <AIInsightCard />

          <LeaderboardCard />

        </div>

      </div>
    </MainLayout>
  );
}

export default Dashboard;