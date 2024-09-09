import React, { useCallback, useEffect, useState } from "react";
import s from "../Chat.module.scss";
import Avatar from "components/Shared/Avatar/Avatar";
import Modal from "components/Shared/Modal/Modal";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "src/store/hooks";
import { deleteChat } from "src/API/DeleteChat";
import ChatHeaderMainInfo from "components/Chat/ChatHeader/ChatHeaderMainInfo";
import { getDisplayUser } from "src/store/slices/userSlice/userSlice";
import { IUserInfo } from "src/types";
import { searchUser } from "src/API/getUserById";
import { UserInfo } from "firebase/auth";

interface Props {
  user: IUserInfo;
  chatId: string;
  exitChat: () => void;
}

const ChatHeader: React.FC<Props> = ({ user, chatId, exitChat }) => {
  const [modal, setModal] = useState(false);
  const { t } = useTranslation();
  const { uid } = useAppSelector(getDisplayUser);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    searchUser(user.uid).then((user) => setUserInfo(user));
  }, [user.uid]);

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

  console.log(user);
  return (
    <>
      <ChatHeaderMainInfo
        exitChat={exitChat}
        onUserClick={onUserClick}
        userInfo={userInfo || user}
      />

      <Modal isOpen={modal} onClose={() => setModal(false)}>
        <div className={s.modal__body}>
          <Avatar
            className={s.modal__body__avatar}
            src={user.photoURL}
            displayName={user.displayName}
          />
        </div>
        <div className={s.modal__header}>
          <span>{user.displayName}</span>
        </div>

        <div className={s.modal__email}>
          <span>{userInfo?.email || "loading..."}</span>
        </div>

        <button className={s.detele__chat} onClick={handleDelete}>
          {t("deleteChat")}
        </button>
      </Modal>
    </>
  );
};

export default ChatHeader;
