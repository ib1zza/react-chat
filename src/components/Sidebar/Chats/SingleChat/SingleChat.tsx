import React, { useEffect, useState } from "react";
import s from "components/Sidebar/Sidebar.module.scss";
import Avatar from "components/Shared/Avatar/Avatar";
import chat from "components/Chat/Chat";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "src/firebase";
import { Simulate } from "react-dom/test-utils";
import select = Simulate.select;

interface UserInfo {
  displayName: string;
  photoURL: string;
  uid: string;
}
interface Props {
  isOpen: boolean;
  user: UserInfo;
  lastMessage?: string;
  handleSelect: (selectedUser: UserInfo) => void;
  isSelected: boolean;
}
const SingleChat: React.FC<Props> = ({
  isSelected,
  user,
  lastMessage,
  isOpen,
  handleSelect,
}) => {
  console.log(isSelected, user.uid);
  const [realUser, setRealUser] = useState<UserInfo>();
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      console.log("chat: ", doc.data());
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
            <p>{lastMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleChat;
