import React, { useEffect, useState } from "react";
import s from "components/Sidebar/Sidebar.module.scss";
import Avatar from "components/Shared/Avatar/Avatar";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "src/firebase";
import { Simulate } from "react-dom/test-utils";
import { useTranslation } from "react-i18next";

interface UserInfo {
  displayName: string;
  photoURL: string;
  uid: string;
}
interface Props {
  currentUser: string;
  isOpen: boolean;
  user: UserInfo;
  lastMessage?: {
    text: string;
    from?: string;
  };
  handleSelect: (selectedUser: UserInfo) => void;
  isSelected: boolean;
}
const SingleChat: React.FC<Props> = ({
  isSelected,
  user,
  lastMessage,
  isOpen,
  handleSelect,
  currentUser,
}) => {
  const { t } = useTranslation();
  const [realUser, setRealUser] = useState<UserInfo>();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      setRealUser(doc.data() as UserInfo);
    });

    return () => {
      unsub();
    };
  }, [user.uid]);

  useEffect(() => {
    if (isSelected && realUser) {
      console.log("query to handle select");
      handleSelect(realUser);
    }
  }, [realUser]);

  if (!realUser) return null;

  return (
    <div
      className={s.chats + " " + (!isOpen ? s.closed : "")}
      key={user.uid}
      onClick={() => handleSelect(realUser)}
    >
      <div className={s.chat__user}>
        <Avatar
          src={realUser.photoURL}
          displayName={realUser.displayName}
          className={s.chat__user__avatar}
        />

        {isOpen && (
          <div className={s.chat__user__info}>
            <span>{realUser.displayName}</span>
            {lastMessage && (
              <p>
                {(lastMessage?.from
                  ? lastMessage.from === currentUser
                    ? t("you")
                    : ""
                  : "") + lastMessage.text}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleChat;
