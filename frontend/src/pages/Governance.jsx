import MainLayout from "../components/MainLayout";
import MetricCard from "../components/MetricCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Scale,
} from "lucide-react";

const data = [
  { month: "Jan", issues: 12 },
  { month: "Feb", issues: 10 },
  { month: "Mar", issues: 8 },
  { month: "Apr", issues: 6 },
  { month: "May", issues: 5 },
  { month: "Jun", issues: 3 },
];

function Governance() {
  return (
    <MainLayout>

      <div className="space-y-8">

        {/* Header */}

        <div>

          <h1 className="text-4xl font-bold text-green-700">
            🏛 Governance
          </h1>

          <p className="text-gray-500 mt-2">
            Ensure transparency, compliance and corporate governance.
          </p>

        </div>

        {/* KPI Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <MetricCard
            title="Compliance Score"
            value="96%"
            icon={<ShieldCheck size={35} />}
            color="text-green-600"
          />

          <MetricCard
            title="Pending Audits"
            value="5"
            icon={<AlertTriangle size={35} />}
            color="text-red-500"
          />

          <MetricCard
            title="Policies"
            value="42"
            icon={<FileCheck size={35} />}
            color="text-blue-500"
          />

          <MetricCard
            title="Risk Level"
            value="Low"
            icon={<Scale size={35} />}
            color="text-yellow-500"
          />

        </div>

        {/* Chart + Risk Table */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-6">
              Compliance Issues Trend
            </h2>

            <ResponsiveContainer width="100%" height={320}>

              <BarChart data={data}>

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis dataKey="month"/>

                <YAxis/>

                <Tooltip/>

                <Bar
                  dataKey="issues"
                  fill="#16a34a"
                  radius={[8,8,0,0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* Risk Table */}

          <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-5">
              Open Risks
            </h2>

            <div className="space-y-4">

              <div className="border-b pb-3">
                <p className="font-semibold">
                  Carbon Reporting Delay
                </p>

                <span className="text-red-500">
                  High
                </span>
              </div>

              <div className="border-b pb-3">
                <p className="font-semibold">
                  Vendor Audit
                </p>

                <span className="text-yellow-500">
                  Medium
                </span>
              </div>

              <div>
                <p className="font-semibold">
                  Waste Disposal Policy
                </p>

                <span className="text-green-600">
                  Resolved
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* AI */}

        <div className="bg-purple-50 border border-purple-300 rounded-xl p-8">

          <h2 className="text-2xl font-bold text-purple-700">
            🤖 AI Governance Insight
          </h2>

          <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-700">

            <li>Compliance improved by 15% this quarter.</li>

            <li>Complete vendor audits before July 30.</li>

            <li>Automate monthly ESG policy reviews.</li>

            <li>Current governance risk is classified as LOW.</li>

          </ul>

        </div>

      </div>

    </MainLayout>
  );
}

export default Governance;