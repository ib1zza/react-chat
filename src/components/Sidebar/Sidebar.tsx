import React from "react";
import s from "./Sidebar.module.scss";
import Navbar from "./Navbar/Navbar";
import Search from "./Search/Search";
import Chats from "./Chats/Chats";
import { useChat } from "src/context/ChatContext";
import { motion } from "framer-motion";

const Sidebar = () => {
  const { data } = useChat();
  const isOpen = !data?.user;

  return (
    <motion.div
      // layout="position"
      transition={{
        opacity: { ease: "linear" },
        layout: { duration: 0.9, stiffness: 0 },
      }}
      className={s.sidebar + " " + (!isOpen ? s.closed : "")}
      initial={{ x: 0 }}
      animate={{ width: !isOpen ? 100 : "auto" }}
      exit={{ x: 100 }}
    >
      <Navbar isOpen={isOpen} />
      {isOpen && <Search />}
      <Chats isOpen={isOpen} />
    </motion.div>
  );
};

export default Sidebar;
