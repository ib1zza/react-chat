import React, { useEffect } from "react";
import s from "./Chat.module.scss";
import Messages from "./Messages/Messages";
import InputPanel from "./InputPanel/InputPanel";
import { ChatAction, IUserInfo } from "src/context/ChatContext";
import { AppRoute } from "src/types/routes";
import { useNavigate } from "react-router-dom";
import ChatHeader from "components/Chat/ChatHeader/ChatHeader";

interface Props {
  data: { chatId: string; user: IUserInfo };
  dispatch: React.Dispatch<{
    type: ChatAction;
    payload?: IUserInfo | undefined;
  }>;
}

const Chat: React.FC<Props> = ({ data, dispatch }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (data.chatId === "null") return;
    console.log("navigate to ", data.chatId);
    navigate(AppRoute.Chats + "/" + data.chatId, { replace: true });
  }, [data.chatId]);

  const exitChat = () => {
    dispatch({ type: ChatAction.EXIT_CHAT });
    navigate(AppRoute.Home, { replace: true });
  };

  return (
    <div className={s.chat}>
      <ChatHeader user={data.user} exitChat={exitChat} chatId={data.chatId} />
      <Messages />
      <InputPanel />
    </div>
  );
};

export default Chat;
