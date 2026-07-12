import MainLayout from "../components/MainLayout";
import {
  FileText,
  Download,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react";

const reports = [
  {
    title: "Annual ESG Report",
    desc: "Complete ESG performance summary for FY 2026",
    color: "bg-green-500",
  },
  {
    title: "Carbon Emission Report",
    desc: "Monthly carbon footprint analysis",
    color: "bg-blue-500",
  },
  {
    title: "CSR Activity Report",
    desc: "Community and employee engagement",
    color: "bg-yellow-500",
  },
  {
    title: "Governance Report",
    desc: "Compliance and audit summary",
    color: "bg-purple-500",
  },
];

function Reports() {
  return (
    <MainLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold text-green-700">
            📄 Reports Center
          </h1>

          <p className="text-gray-500 mt-2">
            Generate, export and analyze ESG reports.
          </p>
        </div>

        {/* Report Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {reports.map((report, index) => (

            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >

              <div className={`w-14 h-14 rounded-xl ${report.color} flex items-center justify-center text-white mb-5`}>
                <FileText size={28}/>
              </div>

              <h2 className="text-xl font-bold">
                {report.title}
              </h2>

              <p className="text-gray-500 mt-2">
                {report.desc}
              </p>

              <div className="flex gap-3 mt-6">

                <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">

                  <Download size={18}/>

                  PDF

                </button>

                <button className="flex items-center gap-2 border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50">

                  <FileSpreadsheet size={18}/>

                  CSV

                </button>

              </div>

            </div>

          ))}

        </div>

        {/* AI Report Generator */}

        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl shadow-lg p-8">

          <div className="flex items-center gap-4">

            <Sparkles size={35}/>

            <div>

              <h2 className="text-2xl font-bold">
                Generate AI ESG Report
              </h2>

              <p className="mt-2 opacity-90">
                Use Gemini AI to automatically summarize ESG performance,
                identify risks, and provide sustainability recommendations.
              </p>

            </div>

          </div>

          <button className="mt-6 bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Generate AI Report
          </button>

        </div>

        {/* Recent Reports */}

        <div className="bg-white rounded-xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-5">
            Recent Reports
          </h2>

          <table className="w-full">

            <thead className="border-b">

              <tr>

                <th className="text-left py-3">Report</th>

                <th>Status</th>

                <th>Date</th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-b">

                <td className="py-4">Annual ESG Report</td>

                <td className="text-green-600">Completed</td>

                <td>10 Jul 2026</td>

              </tr>

              <tr className="border-b">

                <td className="py-4">Carbon Report</td>

                <td className="text-yellow-500">Processing</td>

                <td>08 Jul 2026</td>

              </tr>

              <tr>

                <td className="py-4">CSR Report</td>

                <td className="text-green-600">Completed</td>

                <td>05 Jul 2026</td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>
    </MainLayout>
  );
}

export default Reports;