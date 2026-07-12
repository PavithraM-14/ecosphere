function LeaderboardCard() {
  const teams = [
    { name: "Engineering", score: 95 },
    { name: "Marketing", score: 91 },
    { name: "HR", score: 88 },
    { name: "Finance", score: 82 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">
        Department Leaderboard
      </h2>

      {teams.map((team, index) => (
        <div
          key={index}
          className="flex justify-between py-3 border-b last:border-none"
        >
          <span>{team.name}</span>
          <span className="font-bold text-green-600">
            {team.score}
          </span>
        </div>
      ))}
    </div>
  );
}

export default LeaderboardCard;