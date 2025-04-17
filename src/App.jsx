import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import PlayerListPage from "./pages/PlayerListPage";
import TeamGeneratorPage from "./pages/TeamGeneratorPage";
import StatsPage from "./pages/StatsPage";
import TeamListPage from "./pages/TeamListPage";
import Navbar from "./components/Navbar";

const SERVER_IP = import.meta.env.VITE_SERVER_IP || "localhost";
const API_URL = `http://${SERVER_IP}:5000/api`;

function App() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/players`);
      setPlayers(response.data);
    } catch (error) {
      toast.error("খেলোয়াড়দের তথ্য লোড করতে সমস্যা হয়েছে!");
      console.error("Error fetching players:", error);
    }
  };

  const handleSetTeamName = async (playerId, teamName) => {
    try {
      const response = await axios.put(
        `${API_URL}/players/${playerId}/team-name`,
        { teamName }
      );
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player._id === playerId ? response.data : player
        )
      );
    } catch (error) {
      toast.error("টিমের নাম আপডেট করতে সমস্যা হয়েছে!");
      console.error("Error setting team name:", error);
    }
  };

  const handleAddPlayer = async (newPlayer) => {
    try {
      const response = await axios.post(`${API_URL}/players`, newPlayer);
      setPlayers((prev) => [...prev, response.data]);
      toast.success("খেলোয়াড় সফলভাবে যোগ করা হয়েছে!");
    } catch (error) {
      toast.error("খেলোয়াড় যোগ করতে সমস্যা হয়েছে!");
      console.error("Error adding player:", error);
    }
  };

  const handleToggleCaptain = async (playerId) => {
    try {
      const response = await axios.put(
        `${API_URL}/players/${playerId}/toggle-captain`
      );
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player._id === playerId ? response.data : player
        )
      );
    } catch (error) {
      toast.error("ক্যাপ্টেন আপডেট করতে সমস্যা হয়েছে!");
      console.error("Error toggling captain:", error);
    }
  };

  const handleEditPlayer = async (playerId, updatedData) => {
    try {
      const response = await axios.put(
        `${API_URL}/players/${playerId}`,
        updatedData
      );
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player._id === playerId ? response.data : player
        )
      );
      toast.success("খেলোয়াড়ের তথ্য সফলভাবে আপডেট করা হয়েছে!");
    } catch (error) {
      toast.error("খেলোয়াড়ের তথ্য আপডেট করতে সমস্যা হয়েছে!");
      console.error("Error updating player:", error);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      await axios.delete(`${API_URL}/players/${playerId}`);
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player._id !== playerId)
      );
      toast.success("খেলোয়াড় সফলভাবে মুছে ফেলা হয়েছে!");
    } catch (error) {
      toast.error("খেলোয়াড় মুছে ফেলতে সমস্যা হয়েছে!");
      console.error("Error deleting player:", error);
    }
  };

  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <Navbar />
      <div className="pt-16 md:pt-20 pb-6 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PlayerListPage
                    players={players}
                    onToggleCaptain={handleToggleCaptain}
                    onAddPlayer={handleAddPlayer}
                    onEditPlayer={handleEditPlayer}
                    onDeletePlayer={handleDeletePlayer}
                    onSetTeamName={handleSetTeamName}
                  />
                }
              />
              <Route
                path="/team-generator"
                element={<TeamGeneratorPage players={players} />}
              />
              <Route path="/stats" element={<StatsPage players={players} />} />
              <Route path="/teams" element={<TeamListPage />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
