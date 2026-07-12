import MainLayout from "../components/MainLayout";
import MetricCard from "../components/MetricCard";
import EnvironmentalChart from "../components/EnvironmentalChart";

function Environmental() {
  return (
    <MainLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold text-green-700">
            🌍 Environmental
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor environmental sustainability metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <MetricCard
            title="Carbon Emission"
            value="67 t"
            color="text-red-500"
          />

          <MetricCard
            title="Renewable Energy"
            value="78%"
            color="text-green-600"
          />

          <MetricCard
            title="Water Saved"
            value="18,200 L"
            color="text-blue-600"
          />

          <MetricCard
            title="Waste Recycled"
            value="92%"
            color="text-yellow-500"
          />

        </div>

        <EnvironmentalChart />

        <div className="bg-green-50 border border-green-200 rounded-xl p-8">

          <h2 className="text-2xl font-bold text-green-700">
            🤖 AI Sustainability Tips
          </h2>

          <ul className="list-disc ml-6 mt-4 space-y-3 text-gray-700">

            <li>Reduce factory emissions by 8% next quarter.</li>

            <li>Increase solar energy usage by 12%.</li>

            <li>Optimize logistics to lower fuel consumption.</li>

            <li>Introduce rainwater harvesting across campuses.</li>

          </ul>

        </div>

      </div>
    </MainLayout>
  );
}

export default Environmental;