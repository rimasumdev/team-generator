import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import Modal from "./Modal";
import { toast } from "react-toastify";

const PlayerForm = ({ onAddPlayer, setIsModalOpen, players, initialData }) => {
  const [playerData, setPlayerData] = useState(
    initialData || {
      name: "",
      position: "Striker",
      isCaptain: false,
    }
  );

  const positions = ["Striker", "Midfielder", "Defender", "Goalkeeper"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerData.name) return;

    // Check for duplicate player name and position
    const isDuplicate = players.some(
      (player) =>
        player.name.toLowerCase() === playerData.name.toLowerCase() &&
        player.position === playerData.position
    );

    if (isDuplicate) {
      toast.error("এই নামের একজন খেলোয়াড় ইতিমধ্যে এই পজিশনে আছে!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    onAddPlayer({ ...playerData, id: Date.now() });
    setPlayerData({ name: "", position: "Striker", isCaptain: false });
    setIsModalOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">নাম</label>
        <input
          type="text"
          value={playerData.name}
          onChange={(e) =>
            setPlayerData({ ...playerData, name: e.target.value })
          }
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="খেলোয়াড়ের নাম"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">পজিশন</label>
        <select
          value={playerData.position}
          onChange={(e) =>
            setPlayerData({ ...playerData, position: e.target.value })
          }
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {positions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={playerData.isCaptain}
          onChange={(e) =>
            setPlayerData({ ...playerData, isCaptain: e.target.checked })
          }
          className="mr-2"
        />
        <label className="text-gray-700">ক্যাপ্টেন</label>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
      >
        যোগ করুন
      </button>
    </form>
  );
};

export default PlayerForm;
