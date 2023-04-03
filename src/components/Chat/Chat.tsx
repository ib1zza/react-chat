import React, { useEffect } from "react";
import s from "./Chat.module.scss";
import Messages from "./Messages/Messages";
import InputPanel from "./InputPanel/InputPanel";
import { ChatAction, IUserInfo, useChat } from "src/context/ChatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Avatar from "components/Shared/Avatar/Avatar";
import Modal from "components/Shared/Modal/Modal";
import { AnimatePresence } from "framer-motion";
import { AppRoute } from "src/routes";
import { useNavigate } from "react-router-dom";

interface Props {
  data: { chatId: string; user: IUserInfo | null };
  dispatch: React.Dispatch<{
    type: ChatAction;
    payload?: IUserInfo | undefined;
  }>;
}
const Chat: React.FC<Props> = ({ data, dispatch }) => {
  const [modal, setModal] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (data.chatId === "null") return;
    navigate(AppRoute.Chats + "/" + data.chatId, { replace: true });
  }, [data.chatId]);

  if (!data.user) return null;
  const exitChat = () => {
    dispatch({ type: ChatAction.EXIT_CHAT });
    navigate(AppRoute.Home, { replace: true });
  };

  return (
    <>
      <div className={s.chat}>
        <div className={s.chat__info}>
          <button onClick={exitChat}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className={s.username}>
            <span>{data.user.displayName}</span>
          </div>
          <Avatar
            className={s.avatar}
            src={data.user.photoURL}
            onClick={() => setModal(true)}
          />
        </div>
        <Messages />
        <InputPanel />
      </div>
      <AnimatePresence>
        {modal && (
          <Modal close={() => setModal(false)}>
            <div className={s.modal__body}>
              <Avatar
                className={s.modal__body__avatar}
                src={data.user.photoURL}
              />
            </div>
            <div className={s.modal__header}>
              <span>{data.user.displayName}</span>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chat;
