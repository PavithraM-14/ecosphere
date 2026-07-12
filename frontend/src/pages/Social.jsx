import MainLayout from "../components/MainLayout";
import MetricCard from "../components/MetricCard";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, HeartHandshake, Briefcase, Smile } from "lucide-react";

const data = [
  { name: "Education", value: 35 },
  { name: "Healthcare", value: 25 },
  { name: "Environment", value: 20 },
  { name: "Community", value: 20 },
];

const COLORS = ["#16a34a", "#2563eb", "#facc15", "#ef4444"];

function Social() {
  return (
    <MainLayout>
      <div className="space-y-8">

        {/* Header */}

        <div>
          <h1 className="text-4xl font-bold text-green-700">
            👥 Social Responsibility
          </h1>

          <p className="text-gray-500 mt-2">
            Track employee engagement, CSR activities and community impact.
          </p>
        </div>

        {/* KPI Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <MetricCard
            title="Employees"
            value="1,280"
            icon={<Users size={35} />}
            color="text-green-600"
          />

          <MetricCard
            title="CSR Projects"
            value="24"
            icon={<HeartHandshake size={35} />}
            color="text-blue-600"
          />

          <MetricCard
            title="Volunteer Hours"
            value="820"
            icon={<Briefcase size={35} />}
            color="text-purple-600"
          />

          <MetricCard
            title="Satisfaction"
            value="94%"
            icon={<Smile size={35} />}
            color="text-yellow-500"
          />

        </div>

        {/* Chart + CSR Events */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-6">
              CSR Investment Distribution
            </h2>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>

                <Pie
                  data={data}
                  dataKey="value"
                  outerRadius={120}
                  label
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />

              </PieChart>
            </ResponsiveContainer>

          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-5">
              Recent CSR Events
            </h2>

            <div className="space-y-5">

              <div>
                🌱 Tree Plantation Drive
                <p className="text-sm text-gray-500">
                  500 Trees Planted
                </p>
              </div>

              <div>
                🏫 School Donation
                <p className="text-sm text-gray-500">
                  1000 Books Donated
                </p>
              </div>

              <div>
                🩸 Blood Donation Camp
                <p className="text-sm text-gray-500">
                  120 Volunteers
                </p>
              </div>

              <div>
                🍱 Food Distribution
                <p className="text-sm text-gray-500">
                  800 Families Supported
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* AI Insight */}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">

          <h2 className="text-2xl font-bold text-blue-700">
            🤖 AI Social Insight
          </h2>

          <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-700">

            <li>Employee participation increased by 18%.</li>

            <li>CSR engagement is highest in Engineering.</li>

            <li>Healthcare initiatives need more volunteers.</li>

            <li>Recommend launching a quarterly community challenge.</li>

          </ul>

        </div>

      </div>
    </MainLayout>
  );
}

export default Social;