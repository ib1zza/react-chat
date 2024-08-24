import React, { useEffect, useRef, useState } from "react";
import s from "../Sidebar.module.scss";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "src/firebase";
import { useAuth } from "src/context/AuthContext";

import SingleChat from "components/Sidebar/Chats/SingleChat/SingleChat";
import { useNavigate, useParams } from "react-router-dom";
import { AppRoute } from "src/types/routes";
import { useAppDispatch } from "src/store/hooks";
import { selectChat } from "src/store/slices/chatSlice/chatSlice";
interface ChatsObject {
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
    from?: string;
  };
}

interface Props {
  isOpen: boolean;
}

const Chats: React.FC<Props> = ({ isOpen }) => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [selectedUserID, setSelectedUserID] = useState("");
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [chats, setChats] = React.useState<ChatsObject>({});
  console.log("chatId from params: ", chatId);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
      console.log("Current data: ", doc.data());
      setChats(doc.data() || {});
    });
    return () => {
      unsub();
    };
  }, [user?.uid]);

  useEffect(() => {
    console.log(chatId);

    if (chatId === selectedUserID) return;
    if (!chatId) return;
    if (Object.keys(chats).length === 0) return;
    if (!chats[chatId]) {
      console.log("no such chat", Object.keys(chats), chatId);

      navigate(AppRoute.Home, { replace: true });
      return;
    }

    console.log(chatId);
    handleSelect(chats[chatId].userInfo);
  }, [chatId, chats]);

  const handleSelect = (selectedUser: UserInfo) => {
    console.log(selectedUser, selectedUserID);
    if (selectedUser.uid === selectedUserID) return;
    setSelectedUserID(selectedUser.uid);
    console.log(selectedUser.uid);
    dispatch(selectChat(selectedUser));
  };

  const renderChats: Chat[] = Array.from(Object.values(chats)).sort(
    (a, b) => b?.date?.seconds - a?.date?.seconds,
  );
  useEffect(() => {
    if (isOpen) {
      setSelectedUserID("");
    }
  }, [isOpen]);

  if (Object.values(chats).length === 0) {
    return null;
  }

  if (!user || !renderChats) return null;
  return (
    <div
      className={
        s.chats__container + " " + (!isOpen ? s.chats__container_closed : "")
      }
    >
      {renderChats.map(
        (chat) =>
          chat.userInfo && (
            <SingleChat
              key={chat.userInfo.uid}
              currentUser={user.uid}
              isOpen={isOpen}
              user={chat.userInfo}
              lastMessage={chat.lastMessage}
              handleSelect={handleSelect}
              isSelected={selectedUserID === chat.userInfo.uid}
            />
          ),
      )}
    </div>
  );
};

export default Chats;
