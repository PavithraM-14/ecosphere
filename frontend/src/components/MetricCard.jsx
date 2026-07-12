function MetricCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      <div className="flex justify-between items-center">

        <div>
          <h3 className="text-gray-500 text-sm">
            {title}
          </h3>

          <h2 className={`text-4xl font-bold mt-3 ${color}`}>
            {value}
          </h2>
        </div>

        <div className="text-green-600">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default MetricCard;