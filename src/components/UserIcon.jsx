import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";

function UserIcon({ userInfo }) {
  const containerVariants = {
    hidden: {
      x: -50,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between each child's animation
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  if (userInfo) {
    return (
      <Link to={`/profile`}>
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className=" rounded-[50%] hover:from-rose-500/80 hover:to-rose-600 bg-gradient-to-r shadow-lg drop-shadow-lg font-bold text-md from-gray-500 to-gray-700 text-white w-[40px] h-[40px] flex justify-center items-center">
          {userInfo?.name?.charAt(0).toUpperCase()}
          {userInfo?.name?.charAt(userInfo?.name.length - 1).toUpperCase()}
        </motion.div>
      </Link>
    );
  } else {
    return (
      <Link to="/login">
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className=" rounded-[50%] hover:from-rose-500/80 hover:to-rose-600 bg-gradient-to-r shadow-lg drop-shadow-lg font-bold text-xl from-gray-500 to-gray-700 text-white w-[40px] h-[40px] flex justify-center items-center">
          <UserRound />
        </motion.div>
      </Link>
    );
  }
}

export default UserIcon;
