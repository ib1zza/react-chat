import React, { useEffect } from "react";
import s from "./Chat.module.scss";
import Messages from "./Messages/Messages";
import InputPanel from "./InputPanel/InputPanel";
import { AppRoute } from "src/types/routes";
import { useNavigate } from "react-router-dom";
import ChatHeader from "components/Chat/ChatHeader/ChatHeader";
import { useAppDispatch } from "src/store/hooks";
import { exitChat } from "src/store/slices/chatSlice/chatSlice";
import { IUserInfo } from "src/types";

interface Props {
  data: { chatId: string; user: IUserInfo };
}

const Chat: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (data.chatId === "null") return;
    console.log("navigate to ", data.chatId);
    navigate(AppRoute.Chats + "/" + data.chatId, { replace: true });
  }, [data.chatId]);

  const exitChatHandler = () => {
    dispatch(exitChat());
    // dispatch({ type: ChatAction.EXIT_CHAT });
    navigate(AppRoute.Home, { replace: true });
  };

  return (
    <div className={s.chat}>
      <ChatHeader
        user={data.user}
        exitChat={exitChatHandler}
        chatId={data.chatId}
      />
      <Messages />
      <InputPanel />
    </div>
  );
};

export default Chat;
