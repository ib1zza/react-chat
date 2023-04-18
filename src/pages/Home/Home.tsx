import React from "react";
import s from "./Home.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Chat from "../../components/Chat/Chat";
import { useChat } from "src/context/ChatContext";
import { useParams } from "react-router-dom";

const Home = () => {
  const { data, dispatch } = useChat();
  const { chatId } = useParams();
  console.log("home chatid", chatId);
  return (
    <div className={s.home}>
      <div className={s.container}>
        <Sidebar />
        {/*@ts-ignore*/}
        {data && data.user && <Chat data={data} dispatch={dispatch} />}
      </div>
    </div>
  );
};

export default Home;
