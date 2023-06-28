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
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const isMobile = windowWidth <= 768;

  return (
    <div
      className={
        s.sidebar +
        " " +
        (!isOpen ? s.closed : "") +
        " " +
        (isMobile ? s.mobile : "")
      }
    >
      <div
        className={
          s.sidebar_overlay_content +
          " " +
          (!isOpen ? s.closed : "") +
          " " +
          (isMobile ? s.mobile : "")
        }
      >
        <Navbar isOpen={isOpen} />
        {isOpen && <Search />}
        <Chats isOpen={isOpen} />
      </div>
    </div>
  );
};

export default Sidebar;
