import React, { useEffect, useState } from "react";
import s from "../Sidebar.module.scss";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "src/firebase";
import { useAuth } from "src/context/AuthContext";
import { ChatAction, useChat } from "src/context/ChatContext";

import SingleChat from "components/Sidebar/Chats/SingleChat/SingleChat";

interface Props {
  isOpen: boolean;
}
const Chats: React.FC<Props> = ({ isOpen }) => {
  const [selectedUser, setSelectedUser] = useState("");
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
    setSelectedUser(selectedUser.uid);
    console.log(selectedUser.uid);
    dispatch({ type: ChatAction.CHANGE_USER, payload: selectedUser });
  };

  const renderChats: Chat[] = Array.from(Object.values(chats)).sort(
    // @ts-ignore
    (a, b) => b?.date?.seconds - a?.date?.seconds
  );

  return (
    <>
      {renderChats.map((chat) => (
        <SingleChat
          isOpen={isOpen}
          user={chat.userInfo}
          lastMessage={chat.lastMessage?.text}
          handleSelect={handleSelect}
          isSelected={selectedUser === chat.userInfo.uid}
        />
      ))}
    </>
  );
};

export default Chats;
