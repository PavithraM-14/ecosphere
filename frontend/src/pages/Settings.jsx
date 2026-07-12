import MainLayout from "../components/MainLayout";
import SettingsCard from "../components/SettingsCard";

function Settings() {
  return (
    <MainLayout>
      <div className="space-y-8">

        {/* Heading */}
        <div>
          <h1 className="text-4xl font-bold text-green-700">
            ⚙️ Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your organization preferences and account settings.
          </p>
        </div>

        {/* Settings Overview */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <SettingsCard
            title="Organization"
            description="Current Organization"
            value="EcoSphere Pvt Ltd"
          />

          <SettingsCard
            title="Language"
            description="Default Language"
            value="English"
          />

          <SettingsCard
            title="Notifications"
            description="Email & Push Alerts"
            value="Enabled"
          />

          <SettingsCard
            title="Theme"
            description="Application Theme"
            value="Light Mode"
          />

        </div>

        {/* Admin Profile */}

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-6">
            👤 Administrator Profile
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="font-medium">
                Name
              </label>

              <input
                type="text"
                defaultValue="Lakshitha"
                className="w-full mt-2 border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="font-medium">
                Email
              </label>

              <input
                type="email"
                defaultValue="admin@ecosphere.com"
                className="w-full mt-2 border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="font-medium">
                Organization
              </label>

              <input
                type="text"
                defaultValue="EcoSphere Pvt Ltd"
                className="w-full mt-2 border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="font-medium">
                Theme
              </label>

              <select className="w-full mt-2 border rounded-lg p-3">
                <option>Light Mode</option>
                <option>Dark Mode</option>
              </select>
            </div>

          </div>

          <button className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg">
            Save Changes
          </button>

        </div>

        {/* AI Suggestions */}

        <div className="bg-green-50 border border-green-200 rounded-xl p-8">

          <h2 className="text-2xl font-bold text-green-700">
            🤖 AI Recommendations
          </h2>

          <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-700">

            <li>
              Enable automated ESG report generation every month.
            </li>

            <li>
              Turn on carbon footprint alerts for every department.
            </li>

            <li>
              Notify employees about sustainability challenges.
            </li>

            <li>
              Schedule compliance reminders one week before deadlines.
            </li>

          </ul>

        </div>

      </div>
    </MainLayout>
  );
}

export default Settings;