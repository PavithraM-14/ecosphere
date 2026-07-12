import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", carbon: 92 },
  { month: "Feb", carbon: 85 },
  { month: "Mar", carbon: 78 },
  { month: "Apr", carbon: 72 },
  { month: "May", carbon: 68 },
  { month: "Jun", carbon: 61 },
];

function EnvironmentalChart() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        Carbon Emission Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            dataKey="carbon"
            stroke="#16a34a"
            strokeWidth={4}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EnvironmentalChart;