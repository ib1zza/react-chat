import React from "react";
import s from "./Sidebar.module.scss";
import Navbar from "./Navbar/Navbar";
import Search from "./Search/Search";
import Chats from "./Chats/Chats";
import { useChat } from "src/context/ChatContext";

const Sidebar = () => {
  const { data } = useChat();
  // const [isOpen, setIsOpen] = React.useState(true);
  const isOpen = !data?.user;
  console.log(data?.user);
  const setIsOpen = (isOpen: boolean) => {
    // setIsOpen(isOpen);
  };

  return (
    <div className={s.sidebar + " " + (!isOpen ? s.closed : "")}>
      <Navbar isOpen={isOpen} changeOpen={setIsOpen} />
      {isOpen && <Search isOpen={isOpen} changeOpen={setIsOpen} />}
      <Chats isOpen={isOpen} changeOpen={setIsOpen} />
    </div>
  );
};

export default Sidebar;
