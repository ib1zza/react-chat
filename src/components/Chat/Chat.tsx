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
import { updateDocument } from "src/utils/updateDoc";
import { deleteField, doc, deleteDoc } from "firebase/firestore";
import { db } from "src/firebase";
import { useAppSelector } from "src/store/hooks";

interface Props {
  data: { chatId: string; user: IUserInfo };
  dispatch: React.Dispatch<{
    type: ChatAction;
    payload?: IUserInfo | undefined;
  }>;
}
const Chat: React.FC<Props> = ({ data, dispatch }) => {
  const [modal, setModal] = React.useState(false);
  const navigate = useNavigate();
  const { uid } = useAppSelector((state) => state.user.displayUser);

  useEffect(() => {
    if (data.chatId === "null") return;
    navigate(AppRoute.Chats + "/" + data.chatId, { replace: true });
  }, [data.chatId]);

  const exitChat = () => {
    dispatch({ type: ChatAction.EXIT_CHAT });
    navigate(AppRoute.Home, { replace: true });
  };

  const handleDeleteChat = () => {
    if (!data.user?.uid || !uid || data.user === null || data.chatId === "null")
      return;
    try {
      let chatId = data.chatId;
      let selUserId = data.user.uid;
      updateDocument("chats", chatId, {
        messages: deleteField(),
      })
        .then(() => {
          deleteDoc(doc(db, "chats", chatId));
          updateDocument("userChats", selUserId, {
            [chatId]: deleteField(),
          });
          updateDocument("userChats", uid, {
            [chatId]: deleteField(),
          });
        })
        .then(() => {
          exitChat();
        });
    } catch (error) {
      console.log(error);
    }
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
            displayName={data.user.displayName}
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

            <button className={s.detele__chat} onClick={handleDeleteChat}>
              Delete chat
            </button>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chat;
