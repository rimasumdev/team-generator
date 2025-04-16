import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlayerListPage from "./pages/PlayerListPage";
import TeamGeneratorPage from "./pages/TeamGeneratorPage";
import StatsPage from "./pages/StatsPage";
import Navbar from "./components/Navbar";

function App() {
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem("teamplay_players");
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });

  const handleSetTeamName = (playerId, teamName) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId ? { ...player, teamName } : player
      )
    );
  };

  useEffect(() => {
    localStorage.setItem("teamplay_players", JSON.stringify(players));
  }, [players]);

  const handleAddPlayer = (newPlayer) => {
    setPlayers([...players, newPlayer]);
    toast.success("খেলোয়াড় সফলভাবে যোগ করা হয়েছে!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleToggleCaptain = (playerId) => {
    setPlayers(
      players.map((player) =>
        player.id === playerId
          ? { ...player, isCaptain: !player.isCaptain }
          : player
      )
    );
  };

  const handleEditPlayer = (playerId, updatedData) => {
    setPlayers(
      players.map((player) =>
        player.id === playerId ? { ...player, ...updatedData } : player
      )
    );
    toast.success("খেলোয়াড়ের তথ্য সফলভাবে আপডেট করা হয়েছে!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleDeletePlayer = (playerId) => {
    setPlayers(players.filter((player) => player.id !== playerId));
    toast.success("খেলোয়াড় সফলভাবে মুছে ফেলা হয়েছে!", {
      position: "top-right",
      autoClose: 3000,
    });
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
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
