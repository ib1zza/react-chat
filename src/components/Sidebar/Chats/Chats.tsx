import React, { useEffect } from "react";
import s from "../Sidebar.module.scss";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "src/firebase";
import { useAuth } from "src/context/AuthContext";
import { ChatAction, useChat } from "src/context/ChatContext";
import Avatar from "components/Shared/Avatar/Avatar";

interface Props {
  isOpen: boolean;
  changeOpen: (isOpen: boolean) => void;
}
const Chats: React.FC<Props> = ({ isOpen, changeOpen }) => {
  const { user } = useAuth();
  const { dispatch } = useChat();
  const [chats, setChats] = React.useState<Root>({});

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
      console.log("Current data: ", doc.data());
      setChats(doc.data() || []);
    });

    return () => {
      unsub();
    };
  }, [user?.uid]);

  interface Root {
    [id: string]: Object;
  }

  interface Object {
    userInfo: UserInfo;
    date: Date;
  }

  interface UserInfo {
    displayName: string;
    photoURL: string;
    uid: string;
  }

  interface Date {
    seconds: number;
    nanoseconds: number;
  }

  interface Chat {
    date: Date;
    userInfo: UserInfo;
    lastMessage?: {
      text: string;
    };
  }
  if (Object.values(chats).length === 0) {
    return null;
  }

  console.log(Object.values(chats));

  const handleSelect = (selectedUser: UserInfo) => {
    dispatch({ type: ChatAction.CHANGE_USER, payload: selectedUser });
    changeOpen(false);
  };

  const renderChats: Chat[] = Array.from(Object.values(chats)).sort(
    // @ts-ignore
    (a, b) => b?.date?.seconds - a?.date?.seconds
  );

  return (
    <>
      {renderChats.map((chat) => (
        <div
          className={s.chats + " " + (!isOpen ? s.closed : "")}
          key={chat.userInfo.uid}
          onClick={() => handleSelect(chat.userInfo)}
        >
          <div className={s.chat__user}>
            <Avatar
              src={chat.userInfo.photoURL}
              displayName={chat.userInfo.displayName}
              className={s.chat__user__avatar}
            />

            {isOpen && (
              <div className={s.chat__user__info}>
                <span>{chat.userInfo.displayName}</span>
                <p>{chat.lastMessage?.text}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default Chats;
