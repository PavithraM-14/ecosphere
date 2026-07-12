function SettingsCard({ title, description, value }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-bold text-gray-800">
        {title}
      </h3>

      <p className="text-gray-500 mt-2">
        {description}
      </p>

      <p className="mt-4 text-green-600 font-semibold">
        {value}
      </p>
    </div>
  );
}

export default SettingsCard;