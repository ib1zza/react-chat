import React, { useEffect, useRef, useState } from "react";
import s from "../Chat.module.scss";
import Message from "./Message/Message";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "src/firebase";
import { useAuth } from "src/context/AuthContext";
import { useAppSelector } from "src/store/hooks";
import { selectChatData } from "src/store/slices/chatSlice/chatSlice";

export interface IMessage {
  id: string;
  senderId: string;
  text: string;
  image?: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
}
const Messages = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const data = useAppSelector(selectChatData);
  const endRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  useEffect(() => {
    if (!data?.chatId) return;
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages || []);
      }
    });
    return () => {
      unsub();
    };
  }, [data?.chatId]);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length]);

  if (!data?.user || !user?.uid) return null;

  return (
    <div className={s.messages}>
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          isOwner={message.senderId === user.uid}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default Messages;
