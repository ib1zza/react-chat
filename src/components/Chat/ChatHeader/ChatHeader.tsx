import React, { useCallback, useState } from "react";
import s from "../Chat.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Avatar from "components/Shared/Avatar/Avatar";
import { AnimatePresence } from "framer-motion";
import Modal from "components/Shared/Modal/Modal";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "src/store/hooks";
import { IUserInfo } from "src/context/ChatContext";
import { deleteChat } from "src/utils/DeleteChat";
import ChatHeaderMainInfo from "components/Chat/ChatHeader/ChatHeaderMainInfo";
import { use } from "i18next";
interface Props {
  user: IUserInfo;
  chatId: string;
  exitChat: () => void;
}
const ChatHeader: React.FC<Props> = ({ user, chatId, exitChat }) => {
  const [modal, setModal] = useState(false);
  const { t } = useTranslation();
  const { uid } = useAppSelector((state) => state.user.displayUser);

  const handleDelete = async () => {
    try {
      deleteChat(chatId, uid, user.uid).then(() => exitChat());
    } catch (error) {
      console.log(error);
    }
  };

  const onUserClick = useCallback(() => {
    setModal(true);
  }, []);

  return (
    <>
      <ChatHeaderMainInfo
        exitChat={exitChat}
        onUserClick={onUserClick}
        displayName={user.displayName}
        photoURL={user.photoURL}
      />

      <Modal isOpen={modal} onClose={() => setModal(false)}>
        <div className={s.modal__body}>
          <Avatar className={s.modal__body__avatar} src={user.photoURL} />
        </div>
        <div className={s.modal__header}>
          <span>{user.displayName}</span>
        </div>

        <button className={s.detele__chat} onClick={handleDelete}>
          {t("deleteChat")}
        </button>
      </Modal>
    </>
  );
};

export default ChatHeader;
