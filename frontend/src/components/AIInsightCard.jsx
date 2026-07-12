import { Sparkles, Bot, ArrowRight } from "lucide-react";

function AIInsightCard() {
  return (
    <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 rounded-2xl shadow-xl p-8 text-white">

      {/* Header */}

      <div className="flex items-center gap-4">

        <div className="bg-white/20 p-3 rounded-full">
          <Bot size={36} />
        </div>

        <div>

          <h2 className="text-3xl font-bold">
            Gemini AI ESG Assistant
          </h2>

          <p className="opacity-90">
            Intelligent sustainability insights powered by AI
          </p>

        </div>

      </div>

      {/* AI Insights */}

      <div className="mt-8 grid md:grid-cols-2 gap-4">

        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5">

          <div className="flex items-center gap-2 mb-2">

            <Sparkles size={18} />

            <h3 className="font-semibold">
              Carbon Analysis
            </h3>

          </div>

          <p>
            Carbon emissions have decreased by <b>12%</b> compared to last
            month.
          </p>

        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5">

          <div className="flex items-center gap-2 mb-2">

            <Sparkles size={18} />

            <h3 className="font-semibold">
              Renewable Energy
            </h3>

          </div>

          <p>
            Increasing solar energy usage could improve your ESG score by
            approximately <b>6 points</b>.
          </p>

        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5">

          <div className="flex items-center gap-2 mb-2">

            <Sparkles size={18} />

            <h3 className="font-semibold">
              Employee Engagement
            </h3>

          </div>

          <p>
            CSR participation increased by <b>18%</b>. Launching a Green Week
            campaign could improve engagement even further.
          </p>

        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5">

          <div className="flex items-center gap-2 mb-2">

            <Sparkles size={18} />

            <h3 className="font-semibold">
              Governance Alert
            </h3>

          </div>

          <p>
            Two vendor compliance reviews are pending this week. Completing
            them can raise your compliance score to <b>99%</b>.
          </p>

        </div>

      </div>

      {/* AI Button */}

      <div className="mt-8 flex flex-wrap gap-4">

        <button className="flex items-center gap-2 bg-white text-green-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">

          Generate AI Recommendation

          <ArrowRight size={18} />

        </button>

      </div>

      {/* Footer */}

      <p className="mt-5 text-sm opacity-90">
        Powered by <b>Google Gemini AI</b> • Personalized ESG recommendations
        based on sustainability metrics.
      </p>

    </div>
  );
}

export default AIInsightCard;