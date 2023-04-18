import React, { useEffect } from "react";
import s from "../Chat.module.scss";
import Message from "./Message/Message";
import { useChat } from "src/context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "src/firebase";
import { useAuth } from "src/context/AuthContext";

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
  const [messages, setMessages] = React.useState<any[]>([]);
  const { data } = useChat();
  const endRef = React.useRef<HTMLDivElement>(null);

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

  console.log(messages);

  if (!data?.user || !user?.uid) return null;
  return (
    // {messages.map()}
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
