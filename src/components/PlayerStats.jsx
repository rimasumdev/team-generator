import { FaChartBar } from "react-icons/fa";
import EmptyState from "./EmptyState";

const PlayerStats = ({ players }) => {
  if (!players || players.length === 0) {
    return <EmptyState icon={FaChartBar} />;
  }

  const positionCounts = players.reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1;
    return acc;
  }, {});

  const totalPlayers = players.length;
  const captainCount = players.filter((player) => player.isCaptain).length;

  const positions = ["Striker", "Midfielder", "Defender", "Goalkeeper"];

  const getPositionColor = (position) => {
    const colors = {
      Striker: "bg-red-100 text-red-700 border border-red-300",
      Midfielder: "bg-green-100 text-green-700 border border-green-300",
      Defender: "bg-blue-100 text-blue-700 border border-blue-300",
      Goalkeeper: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    };
    return (
      colors[position] || "bg-gray-100 text-gray-700 border border-gray-300"
    );
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-6 ">
        <FaChartBar className="text-blue-500 text-2xl" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          খেলোয়াড়দের পরিসংখ্যান
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-blue-600 mb-1">
            মোট খেলোয়াড়
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-700">
            {totalPlayers}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-yellow-600 mb-1">
            ক্যাপ্টেন
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-700">
            {captainCount}
          </p>
        </div>
      </div>

      {/* Position Distribution */}
      <div className="bg-slate-50 rounded-lg shadow-sm p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          পজিশন অনুযায়ী খেলোয়াড়
        </h3>
        <div className="space-y-4">
          {positions.map((position) => {
            const count = positionCounts[position] || 0;
            const percentage = totalPlayers ? (count / totalPlayers) * 100 : 0;

            return (
              <div key={position} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${getPositionColor(
                      position
                    )}`}
                  >
                    {position}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {count} জন ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      position === "Striker"
                        ? "bg-red-400"
                        : position === "Midfielder"
                        ? "bg-green-400"
                        : position === "Defender"
                        ? "bg-blue-400"
                        : "bg-yellow-400"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Player List */}
      <div className="bg-slate-50 rounded-lg shadow-sm overflow-hidden mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 p-4 sm:p-6 border-b">
          খেলোয়াড়দের তালিকা
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
                  নাম
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
                  পজিশন
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm bold text-gray-500 uppercase tracking-wider">
                  ভূমিকা
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {player.name}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getPositionColor(
                        player.position
                      )}`}
                    >
                      {player.position}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        player.isCaptain
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {player.isCaptain ? "ক্যাপ্টেন" : "খেলোয়াড়"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
