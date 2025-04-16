import { motion } from "framer-motion";
import PlayerList from "../components/PlayerList";

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

const PlayerListPage = ({
  players,
  onToggleCaptain,
  onAddPlayer,
  onEditPlayer,
  onDeletePlayer,
  onSetTeamName,
}) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="py-4"
    >
      <PlayerList
        players={players}
        onToggleCaptain={onToggleCaptain}
        onAddPlayer={onAddPlayer}
        onEditPlayer={onEditPlayer}
        onDeletePlayer={onDeletePlayer}
        onSetTeamName={onSetTeamName}
      />
    </motion.div>
  );
};

export default PlayerListPage;
