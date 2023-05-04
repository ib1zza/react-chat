import React from "react";
import s from "./Sidebar.module.scss";
import Navbar from "./Navbar/Navbar";
import Search from "./Search/Search";
import Chats from "./Chats/Chats";
import { useChat } from "src/context/ChatContext";

interface Props {
  isOpen: boolean;
}
const Sidebar: React.FC<Props> = ({ isOpen }) => {
  return (
    <div className={s.sidebar + " " + (!isOpen ? s.closed : "")}>
      <Navbar isOpen={isOpen} />
      {isOpen && <Search />}
      <Chats isOpen={isOpen} />
    </div>
  );
};

export default Sidebar;
