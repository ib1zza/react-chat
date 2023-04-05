import React, { useEffect, useRef, useState } from "react";
import s from "../../Chat.module.scss";

import { IMessage } from "../Messages";
import { useChat } from "src/context/ChatContext";
import { useAuth } from "src/context/AuthContext";
import { formatRelative } from "date-fns";
interface Props {
  message: IMessage;
}
const Message: React.FC<Props> = ({ message }) => {
  const { data } = useChat();
  const { user } = useAuth();

  // const ref = useRef<HTMLDivElement>(null);
  //
  // useEffect(() => {
  //   if (ref.current) {
  //     ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
  //   }
  // }, [message]);

  if (!data?.user || !user?.uid) return null;

  return (
    <div
      // ref={ref}
      className={
        s.message + " " + (message.senderId === user.uid ? s.owner : "")
      }
    >
      <div className={s.message__content}>
        {message.date && (
          <div className={s.message__date}>
            {formatRelative(message.date.seconds * 1000, Date.now())}
          </div>
        )}

        <p>{message.text}</p>
        {message.image && <img src={message.image} alt={message.senderId} />}
      </div>
    </div>
  );
};

export default Message;
