import { useState } from "react";
import { FaUsers, FaRandom, FaExclamationCircle, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import EmptyState from "./EmptyState";
import Modal from "./Modal";

const SERVER_IP = import.meta.env.VITE_SERVER_IP;
const API_URL = `${SERVER_IP}/api`;

const TeamGenerator = ({ players }) => {
  const navigate = useNavigate();
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [teams, setTeams] = useState(null);

  const getPositionColor = (position) => {
    const colors = {
      Striker: "text-red-500",
      Midfielder: "text-green-500",
      Defender: "text-blue-500",
      Goalkeeper: "text-yellow-500",
    };
    return colors[position] || "text-gray-500";
  };

  const saveTeams = async (generatedTeams) => {
    try {
      await axios.post(`${API_URL}/teams`, generatedTeams);
      toast.success("টিমগুলো সফলভাবে সংরক্ষণ করা হয়েছে!");
    } catch (error) {
      toast.error("টিমগুলো সংরক্ষণ করতে সমস্যা হয়েছে!");
      console.error("Error saving teams:", error);
    }
  };

  if (!players || players.length === 0) {
    return (
      <EmptyState
        icon={FaUsers}
        title="কোন খেলোয়াড় যোগ করা হয়নি"
        message="টিম তৈরি করতে প্রথমে খেলোয়াড়দের তালিকায় গিয়ে নতুন খেলোয়াড় যোগ করুন"
      />
    );
  }

  const generateTeams = () => {
    if (players.length === 0) return;

    // Get captains
    const captains = players.filter((player) => player.isCaptain);
    if (captains.length < numberOfTeams) {
      setIsConfirmModalOpen(true);
      return;
    }

    // Group players by position
    const playersByPosition = players.reduce((acc, player) => {
      if (!player.isCaptain) {
        if (!acc[player.position]) acc[player.position] = [];
        acc[player.position].push(player);
      }
      return acc;
    }, {});

    // Initialize teams with captains
    const generatedTeams = captains.slice(0, numberOfTeams).map((captain) => ({
      captain,
      players: [captain],
    }));

    // Distribute players by position
    Object.values(playersByPosition).forEach((positionPlayers) => {
      const shuffledPlayers = [...positionPlayers].sort(
        () => Math.random() - 0.5
      );
      shuffledPlayers.forEach((player, index) => {
        const teamIndex = index % numberOfTeams;
        generatedTeams[teamIndex].players.push(player);
      });
    });

    setTeams(generatedTeams);
    // Auto-save the generated teams
    saveTeams(generatedTeams);
  };

  const convertToBengaliNumber = (number) => {
    const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number
      .toString()
      .split("")
      .map((digit) => bengaliNumerals[parseInt(digit)])
      .join("");
  };

  return (
    <>
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={
          <>
            <FaExclamationCircle className="text-yellow-500" />
            ক্যাপ্টেন নির্বাচন করুন
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            টিম তৈরি করতে প্রয়োজনীয় সংখ্যক ক্যাপ্টেন নেই। ক্যাপ্টেন নির্বাচন
            করার পেজে যেতে চান?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              বাতিল
            </button>
            <button
              onClick={() => {
                setIsConfirmModalOpen(false);
                navigate("/");
              }}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
            >
              ক্যাপ্টেন নির্বাচন করুন
            </button>
          </div>
        </div>
      </Modal>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <FaUsers className="text-blue-500" />
            টিম তৈরি করুন
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">টিমের সংখ্যা</label>
              <input
                type="number"
                min="2"
                max={Math.min(Math.floor(players.length / 2), 10)}
                value={numberOfTeams}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (
                    value >= 2 &&
                    value <= Math.min(Math.floor(players.length / 2), 10)
                  ) {
                    setNumberOfTeams(value);
                  }
                }}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                সর্বনিম্ন ২টি এবং সর্বোচ্চ{" "}
                {convertToBengaliNumber(
                  Math.min(Math.floor(players.length / 2), 10)
                )}
                টি টিম তৈরি করা যাবে
              </p>
            </div>
            <button
              onClick={generateTeams}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200 flex items-center justify-center gap-2"
            >
              <FaRandom />
              টিম তৈরি করুন
            </button>
          </div>
        </div>

        {teams && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                টিমসমূহ
              </h2>
              <button
                onClick={() => saveTeams(teams)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
              >
                <FaSave />
                টিমগুলো সংরক্ষণ করুন
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6">
              {teams.map((team, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-blue-500 w-6 h-6" />
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                        {team.captain.teamName || team.captain.name}
                      </h3>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      মোট {convertToBengaliNumber(team.players.length)} জন
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-gray-100">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                            #
                          </th>
                          <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            নাম
                          </th>
                          <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            পজিশন
                          </th>
                          <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ভূমিকা
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="bg-gradient-to-r from-blue-50 to-blue-100 hover:bg-blue-200 transition-colors duration-150">
                          <td className="px-3 py-2.5">
                            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                              ১
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="font-medium text-sm text-blue-700">
                              {team.captain.name}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm ${getPositionColor(
                                team.captain.position
                              )} bg-opacity-10`}
                            >
                              {team.captain.position}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                              ক্যাপ্টেন
                            </span>
                          </td>
                        </tr>
                        {team.players
                          .filter((p) => p._id !== team.captain._id)
                          .map((player, playerIndex) => (
                            <tr
                              key={player._id}
                              className="hover:bg-gray-50 transition-colors duration-150"
                            >
                              <td className="px-3 py-2.5">
                                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                  {convertToBengaliNumber(playerIndex + 2)}
                                </span>
                              </td>
                              <td className="px-3 py-2.5">
                                <span className="font-medium text-sm text-gray-900">
                                  {player.name}
                                </span>
                              </td>
                              <td className="px-3 py-2.5">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm ${getPositionColor(
                                    player.position
                                  )} bg-opacity-10`}
                                >
                                  {player.position}
                                </span>
                              </td>
                              <td className="px-3 py-2.5">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                  খেলোয়াড়
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TeamGenerator;
