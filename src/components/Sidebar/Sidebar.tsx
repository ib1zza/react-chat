import React from "react";
import s from "./Sidebar.module.scss";
import Navbar from "./Navbar/Navbar";
import Search from "./Search/Search";
import Chats from "./Chats/Chats";

const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={s.sidebar + " " + (!isOpen ? s.closed : "")}>
      <Navbar isOpen={isOpen} changeOpen={setIsOpen} />
      <Search isOpen={isOpen} changeOpen={setIsOpen} />
      <Chats isOpen={isOpen} changeOpen={setIsOpen} />
    </div>
  );
};

export default Sidebar;
