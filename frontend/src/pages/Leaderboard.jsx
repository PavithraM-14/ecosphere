import MainLayout from "../components/MainLayout";
import {
  Trophy,
  Medal,
  Award,
  Star,
  Gift,
  Target,
} from "lucide-react";

const employees = [
  { rank: 1, name: "Sarah Johnson", score: 985 },
  { rank: 2, name: "Michael Lee", score: 930 },
  { rank: 3, name: "Emily Davis", score: 895 },
  { rank: 4, name: "James Wilson", score: 860 },
  { rank: 5, name: "Sophia Brown", score: 842 },
];

const badges = [
  "🌱 Green Champion",
  "♻ Carbon Saver",
  "⚡ Energy Hero",
  "🤝 CSR Leader",
  "🛡 Compliance Master",
];

function Leaderboard() {
  return (
    <MainLayout>

      <div className="space-y-8">

        <div>

          <h1 className="text-4xl font-bold text-green-700">
            🏆 ESG Leaderboard
          </h1>

          <p className="text-gray-500 mt-2">
            Rewarding sustainability and employee participation.
          </p>

        </div>

        {/* Top 3 */}

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-yellow-100 rounded-xl p-6 shadow-lg text-center">
            <Trophy className="mx-auto text-yellow-500" size={50}/>
            <h2 className="text-xl font-bold mt-3">
              Sarah Johnson
            </h2>
            <p>985 Points</p>
          </div>

          <div className="bg-gray-100 rounded-xl p-6 shadow-lg text-center">
            <Medal className="mx-auto text-gray-500" size={50}/>
            <h2 className="text-xl font-bold mt-3">
              Michael Lee
            </h2>
            <p>930 Points</p>
          </div>

          <div className="bg-orange-100 rounded-xl p-6 shadow-lg text-center">
            <Award className="mx-auto text-orange-500" size={50}/>
            <h2 className="text-xl font-bold mt-3">
              Emily Davis
            </h2>
            <p>895 Points</p>
          </div>

        </div>

        {/* Rankings */}

        <div className="bg-white rounded-xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-6">
            Employee Rankings
          </h2>

          {employees.map((emp) => (

            <div
              key={emp.rank}
              className="mb-5"
            >

              <div className="flex justify-between">

                <span>

                  #{emp.rank} {emp.name}

                </span>

                <span className="font-bold text-green-600">

                  {emp.score}

                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">

                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${emp.score / 10}%` }}
                ></div>

              </div>

            </div>

          ))}

        </div>

        {/* Badges */}

        <div className="bg-white rounded-xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-5">
            ESG Badges
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            {badges.map((badge,index)=>(

              <div
                key={index}
                className="bg-green-50 rounded-lg p-4 border border-green-200 flex items-center gap-3"
              >

                <Star className="text-yellow-500"/>

                {badge}

              </div>

            ))}

          </div>

        </div>

        {/* Rewards */}

        <div className="bg-white rounded-xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-5">
            Rewards
          </h2>

          <div className="grid md:grid-cols-3 gap-5">

            <div className="border rounded-xl p-5">

              <Gift className="text-green-600"/>

              <h3 className="font-bold mt-3">
                Amazon Voucher
              </h3>

              <p>500 Points</p>

            </div>

            <div className="border rounded-xl p-5">

              <Gift className="text-green-600"/>

              <h3 className="font-bold mt-3">
                Extra Leave
              </h3>

              <p>1000 Points</p>

            </div>

            <div className="border rounded-xl p-5">

              <Gift className="text-green-600"/>

              <h3 className="font-bold mt-3">
                Green Champion Trophy
              </h3>

              <p>1500 Points</p>

            </div>

          </div>

        </div>

        {/* Weekly Challenge */}

        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl p-8">

          <div className="flex items-center gap-4">

            <Target size={35}/>

            <div>

              <h2 className="text-2xl font-bold">
                Weekly ESG Challenge
              </h2>

              <p className="mt-2">
                Reduce paper consumption by 20% this week to earn bonus ESG points.
              </p>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Leaderboard;