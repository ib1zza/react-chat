import React from "react";
import s from "./Chat.module.scss";
import Messages from "./Messages/Messages";
import InputPanel from "./InputPanel/InputPanel";
import { ChatAction, IUserInfo, useChat } from "src/context/ChatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

interface Props {
  data: { chatId: string; user: IUserInfo | null };
  dispatch: React.Dispatch<{
    type: ChatAction;
    payload?: IUserInfo | undefined;
  }>;
}
const Chat: React.FC<Props> = ({ data, dispatch }) => {
  return (
    <div className={s.chat}>
      <div className={s.chat__info}>
        <button onClick={() => dispatch({ type: ChatAction.EXIT_CHAT })}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div>{data.user?.displayName}</div>
      </div>
      <Messages />
      <InputPanel />
    </div>
  );
};

export default Chat;
