function RecentActivities() {

  const activities = [
    {
      title: "Tree Plantation Drive Completed",
      time: "2 hours ago"
    },
    {
      title: "Carbon Audit Submitted",
      time: "Today"
    },
    {
      title: "New ESG Policy Published",
      time: "Yesterday"
    },
    {
      title: "Marketing Team earned Green Badge",
      time: "2 days ago"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-6">
        Recent Activities
      </h2>

      <div className="space-y-5">

        {activities.map((item, index) => (

          <div
            key={index}
            className="border-l-4 border-green-600 pl-4"
          >

            <p className="font-semibold">
              {item.title}
            </p>

            <p className="text-sm text-gray-500">
              {item.time}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default RecentActivities;