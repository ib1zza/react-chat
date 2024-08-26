import React, { useEffect, useMemo, useRef, useState } from "react";
import s from "../Chat.module.scss";
import Message from "./Message/Message";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "src/firebase";
import { useAuth } from "src/context/AuthContext";
import { useAppSelector } from "src/store/hooks";
import { selectChatData } from "src/store/slices/chatSlice/chatSlice";
import { format } from "date-fns";

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

  const messagesByDate = useMemo(() => {
    const result = messages.reduce((acc, message) => {
      const dateString = format(
        new Date(message.date.seconds * 1000),
        "d LLL yyyy",
      );
      if (!acc[dateString]) {
        acc[dateString] = [];
      }
      acc[dateString].push(message);
      return acc;
    }, {} as any);
    return result;
  }, [messages]);

  console.log(messages, messagesByDate);

  return (
    <div className={s.messages}>
      {Object.keys(messagesByDate).map((dateString) => (
        <div key={dateString}>
          <div className={s.dateHeader__container}>
            <div className={s.dateHeader__date}>{dateString}</div>
          </div>
          {messagesByDate[dateString].map((message: IMessage) => (
            <Message
              key={message.id}
              message={message}
              isOwner={message.senderId === user.uid}
            />
          ))}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default Messages;
