import React, { useEffect } from "react";
import s from "../Chat.module.scss";
import Message from "./Message/Message";
import { useChat } from "src/context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "src/firebase";

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

  useEffect(() => {
    if (!data?.chatId) return;
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages);
        console.log(doc.data());
      }
    });

    return () => {
      unsub();
    };
  }, [data?.chatId]);

  console.log(messages);
  return (
    // {messages.map()}
    <div className={s.messages}>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default Messages;
