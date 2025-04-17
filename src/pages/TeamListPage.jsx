import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaCalendar,
  FaTrash,
  FaSpinner,
  FaChevronDown,
  FaChevronRight,
  FaTrashAlt,
  FaClock,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "../components/Modal";

const SERVER_IP = import.meta.env.VITE_SERVER_IP || "localhost";
const API_URL = `http://${SERVER_IP}:5000/api`;

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.2,
};

const TeamListPage = () => {
  const [teams, setTeams] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    type: "", // 'single' or 'all'
    date: null,
    teamId: null,
  });

  const fetchTeams = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/teams`;
      if (selectedDate) {
        url += `?date=${selectedDate}`;
      }
      const response = await axios.get(url);
      setTeams(response.data);
    } catch (error) {
      toast.error("টিমের তথ্য লোড করতে সমস্যা হয়েছে!");
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [selectedDate]);

  const handleDeleteTeam = async (teamId) => {
    try {
      await axios.delete(`${API_URL}/teams/${teamId}`);
      toast.success("টিম সফলভাবে মুছে ফেলা হয়েছে!");
      fetchTeams();
      if (selectedTeam?._id === teamId) {
        setSelectedTeam(null);
      }
    } catch (error) {
      toast.error("টিম মুছে ফেলতে সমস্যা হয়েছে!");
      console.error("Error deleting team:", error);
    }
  };

  const handleDeleteTeamsByDate = async (date) => {
    try {
      const response = await axios({
        method: "delete",
        url: `${API_URL}/teams/by-date`,
        data: { date },
      });
      toast.success(response.data.message);
      fetchTeams();
    } catch (error) {
      toast.error("টিমগুলো মুছে ফেলতে সমস্যা হয়েছে!");
      console.error("Error deleting teams by date:", error);
    }
  };

  const getPositionColor = (position) => {
    const colors = {
      Striker: "text-red-500",
      Midfielder: "text-green-500",
      Defender: "text-blue-500",
      Goalkeeper: "text-yellow-500",
    };
    return colors[position] || "text-gray-500";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const groupTeamsByDateTime = (teams) => {
    const groups = teams.reduce((acc, team) => {
      const date = new Date(team.createdAt);
      const dateKey = date.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const hour = date.getHours();
      const minute = date.getMinutes();
      const period = hour >= 12 ? "অপরাহ্ন" : "পূর্বাহ্ন";
      const hour12 = hour % 12 || 12;

      const timeKey = `${hour12}:${minute
        .toString()
        .padStart(2, "0")} ${period}`;

      if (!acc[dateKey]) {
        acc[dateKey] = {};
      }

      if (!acc[dateKey][timeKey]) {
        acc[dateKey][timeKey] = [];
      }

      acc[dateKey][timeKey].push(team);
      return acc;
    }, {});

    return Object.entries(groups)
      .sort((a, b) => {
        const dateA = new Date(a[1][Object.keys(a[1])[0]][0].createdAt);
        const dateB = new Date(b[1][Object.keys(b[1])[0]][0].createdAt);
        return dateB - dateA;
      })
      .map(([date, timeGroups]) => {
        const sortedTimeGroups = Object.entries(timeGroups).sort((a, b) => {
          const timeA = new Date(a[1][0].createdAt);
          const timeB = new Date(b[1][0].createdAt);
          return timeB - timeA;
        });
        return [date, sortedTimeGroups];
      });
  };

  const toggleGroup = (date) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const groupedTeams = groupTeamsByDateTime(teams);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-6 py-4"
    >
      <Modal
        isOpen={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        title={
          <>
            <FaUsers className="text-blue-500" />
            {selectedTeam?.name}
          </>
        }
      >
        {selectedTeam && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                    নাম
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                    পজিশন
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                    ভূমিকা
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2">
                    <span className="font-medium text-blue-700">
                      {selectedTeam.captain.name}
                    </span>
                  </td>
                  <td className="py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(
                        selectedTeam.captain.position
                      )}`}
                    >
                      {selectedTeam.captain.position}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      ক্যাপ্টেন
                    </span>
                  </td>
                </tr>
                {selectedTeam.players
                  .filter((p) => p._id !== selectedTeam.captain._id)
                  .map((player) => (
                    <tr key={player._id} className="border-b border-gray-100">
                      <td className="py-2">
                        <span className="text-gray-800">{player.name}</span>
                      </td>
                      <td className="py-2">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(
                            player.position
                          )}`}
                        >
                          {player.position}
                        </span>
                      </td>
                      <td className="py-2">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          খেলোয়াড়
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({
            isOpen: false,
            type: "",
            date: null,
            teamId: null,
          })
        }
        title={
          <>
            <FaTrash className="text-red-500" />
            {deleteConfirmation.type === "single"
              ? "টিম মুছে ফেলুন"
              : "সব টিম মুছে ফেলুন"}
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            {deleteConfirmation.type === "single"
              ? "আপনি কি নিশ্চিত যে আপনি এই টিমটি মুছে ফেলতে চান?"
              : `আপনি কি নিশ্চিত যে আপনি ${new Date(
                  deleteConfirmation.date
                ).toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })} তারিখের সব টিম মুছে ফেলতে চান?`}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() =>
                setDeleteConfirmation({
                  isOpen: false,
                  type: "",
                  date: null,
                  teamId: null,
                })
              }
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              বাতিল
            </button>
            <button
              onClick={() => {
                if (deleteConfirmation.type === "single") {
                  handleDeleteTeam(deleteConfirmation.teamId);
                } else {
                  handleDeleteTeamsByDate(deleteConfirmation.date);
                }
                setDeleteConfirmation({
                  isOpen: false,
                  type: "",
                  date: null,
                  teamId: null,
                });
              }}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
            >
              মুছে ফেলুন
            </button>
          </div>
        </div>
      </Modal>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <FaUsers className="text-blue-500" />
          তৈরি করা টিমসমূহ
        </h2>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            তারিখ নির্বাচন করুন
          </label>
          <div className="relative">
            <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-blue-500 text-2xl" />
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            কোন টিম পাওয়া যায়নি
          </div>
        ) : (
          <div className="space-y-4">
            {groupedTeams.map(([date, timeGroups]) => (
              <div key={date} className="border rounded-lg overflow-hidden">
                <div
                  onClick={() => toggleGroup(date)}
                  className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    {expandedGroups[date] ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                    {date}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      মোট{" "}
                      {timeGroups.reduce(
                        (total, [_, teams]) => total + teams.length,
                        0
                      )}
                      টি টিম
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const formattedDate =
                          timeGroups[0][1][0].createdAt.split("T")[0];
                        setDeleteConfirmation({
                          isOpen: true,
                          type: "all",
                          date: formattedDate,
                          teamId: null,
                        });
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center gap-2"
                      title="এই তারিখের সব টিম মুছে ফেলুন"
                    >
                      <FaTrashAlt />
                      <span className="text-sm">সব মুছুন</span>
                    </button>
                  </div>
                </div>

                {expandedGroups[date] && (
                  <div className="divide-y divide-gray-100">
                    {timeGroups.map(([time, teams]) => (
                      <div key={time} className="bg-white p-4">
                        <div className="mb-4">
                          <h4 className="text-md font-medium text-gray-700 flex items-center gap-2">
                            <FaClock className="text-blue-400" />
                            {time}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {teams.map((team) => (
                            <div
                              key={team._id}
                              onClick={() => setSelectedTeam(team)}
                              className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                                    {team.name}
                                  </h3>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirmation({
                                      isOpen: true,
                                      type: "single",
                                      date: null,
                                      teamId: team._id,
                                    });
                                  }}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                  title="টিম মুছে ফেলুন"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeamListPage;
