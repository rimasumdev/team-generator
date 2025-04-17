import { FaUserAlt, FaEdit, FaStar, FaUserPlus, FaTrash } from "react-icons/fa";
import { useState } from "react";
import Modal from "./Modal";
import PlayerForm from "./PlayerForm";
import EmptyState from "./EmptyState";
import { toast } from "react-toastify";

const PlayerList = ({
  players,
  onToggleCaptain,
  onAddPlayer,
  onEditPlayer,
  onDeletePlayer,
  onSetTeamName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTeamNameModalOpen, setIsTeamNameModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [teamName, setTeamName] = useState("");

  const getPositionColor = (position) => {
    const colors = {
      Striker: "text-red-500",
      Midfielder: "text-green-500",
      Defender: "text-blue-500",
      Goalkeeper: "text-yellow-500",
    };
    return colors[position] || "text-gray-500";
  };

  // Always render modals regardless of player count
  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <>
            <FaUserPlus className="text-blue-500" />
            নতুন খেলোয়াড়
          </>
        }
      >
        <PlayerForm
          onAddPlayer={onAddPlayer}
          setIsModalOpen={setIsModalOpen}
          players={players || []}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPlayer(null);
        }}
        title={
          <>
            <FaEdit className="text-blue-500" />
            খেলোয়াড় সম্পাদনা
          </>
        }
      >
        {selectedPlayer && (
          <PlayerForm
            onAddPlayer={(updatedData) => {
              onEditPlayer(selectedPlayer._id, updatedData);
              setIsEditModalOpen(false);
              setSelectedPlayer(null);
            }}
            setIsModalOpen={setIsEditModalOpen}
            players={players.filter((p) => p._id !== selectedPlayer._id)}
            initialData={selectedPlayer}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPlayer(null);
        }}
        title={
          <>
            <FaTrash className="text-red-500" />
            খেলোয়াড় মুছে ফেলুন
          </>
        }
      >
        {selectedPlayer && (
          <div className="space-y-4">
            <p className="text-gray-700">
              আপনি কি নিশ্চিত যে আপনি {selectedPlayer.name} কে মুছে ফেলতে চান?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedPlayer(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  onDeletePlayer(selectedPlayer._id);
                  setIsDeleteModalOpen(false);
                  setSelectedPlayer(null);
                }}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
              >
                মুছে ফেলুন
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isTeamNameModalOpen}
        onClose={() => {
          setIsTeamNameModalOpen(false);
          setSelectedPlayer(null);
          setTeamName("");
        }}
        title={
          <>
            <FaStar className="text-yellow-500" />
            টিমের নাম দিন
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">টিমের নাম</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="টিমের নাম লিখুন"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setIsTeamNameModalOpen(false);
                setSelectedPlayer(null);
                setTeamName("");
              }}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              বাতিল
            </button>
            <button
              onClick={() => {
                if (!teamName.trim()) {
                  toast.error("দয়া করে টিমের নাম দিন!", {
                    position: "top-right",
                    autoClose: 3000,
                  });
                  return;
                }
                onToggleCaptain(selectedPlayer._id);
                onSetTeamName(selectedPlayer._id, teamName.trim());
                toast.success("ক্যাপ্টেন সফলভাবে নির্বাচন করা হয়েছে!", {
                  position: "top-right",
                  autoClose: 3000,
                });
                setIsTeamNameModalOpen(false);
                setSelectedPlayer(null);
                setTeamName("");
              }}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
            >
              নিশ্চিত করুন
            </button>
          </div>
        </div>
      </Modal>

      {/* Content based on players existence */}
      {!players || players.length === 0 ? (
        <EmptyState
          icon={FaUserAlt}
          title="কোন খেলোয়াড় যোগ করা হয়নি"
          message="নতুন খেলোয়াড় যোগ করতে নীচের বাটনে ক্লিক করুন"
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
            >
              <FaUserPlus className="w-5 h-5" />
              নতুন খেলোয়াড় যোগ করুন
            </button>
          }
        />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaUserAlt className="text-blue-500 w-6 h-6 sm:w-7 sm:h-7" />
                খেলোয়াড়দের তালিকা
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base"
              >
                <FaUserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                নতুন
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-100 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">
                    নাম
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">
                    পজিশন
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-600">
                    ক্যাপ্টেন
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-600">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {players.map((player) => (
                  <tr
                    key={player._id}
                    className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <span className="font-medium text-gray-900 text-xs sm:text-base">
                        {player.name}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <span
                        className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getPositionColor(
                          player.position
                        )}`}
                      >
                        {player.position}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                      <button
                        onClick={() => {
                          if (!player.isCaptain) {
                            setSelectedPlayer(player);
                            setTeamName("");
                            setIsTeamNameModalOpen(true);
                          } else {
                            onToggleCaptain(player._id);
                          }
                        }}
                        className={`p-1 sm:p-2 rounded-full transition-colors ${
                          player.isCaptain
                            ? "bg-yellow-100 hover:bg-yellow-200"
                            : "hover:bg-gray-100"
                        }`}
                        title={
                          player.isCaptain
                            ? "ক্যাপ্টেন বাতিল করুন"
                            : "ক্যাপ্টেন নির্বাচন করুন"
                        }
                      >
                        <FaStar
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            player.isCaptain
                              ? "text-yellow-500"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                      <div className="flex justify-center space-x-1 sm:space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPlayer(player);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                          title="সম্পাদনা করুন"
                        >
                          <FaEdit className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPlayer(player);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <FaTrash className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerList;
