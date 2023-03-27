import React from "react";
import s from "./Chat.module.scss";
import Messages from "./Messages/Messages";
import InputPanel from "./InputPanel/InputPanel";
import { useChat } from "src/context/ChatContext";
const Chat = () => {
  const { data } = useChat();
  return (
    <div className={s.chat}>
      <div className={s.chat__info}>
        <span>{data?.user?.displayName}</span>
        <div className={s.chat__icons} style={{ display: "none" }}>
          <img src="" alt="" />
        </div>
      </div>
      <Messages />
      <InputPanel />
    </div>
  );
};

export default Chat;
