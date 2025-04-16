import { motion } from "framer-motion";
import TeamGenerator from "../components/TeamGenerator";

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

const TeamGeneratorPage = ({ players }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="py-4"
    >
      <TeamGenerator players={players} />
    </motion.div>
  );
};

export default TeamGeneratorPage;
