import React from "react";
import s from "../../Chat.module.scss";

import { IMessage } from "../Messages";
import { formatRelative } from "date-fns";
import { useInView } from "react-intersection-observer";
interface Props {
  message: IMessage;
  isOwner: boolean;
}
const Message: React.FC<Props> = ({ message, isOwner }) => {
  const options = {
    threshold: 0.2,
    triggerOnce: true,
  };
  const { ref, inView } = useInView(options);

  return (
    <div className={s.message + " " + (isOwner ? s.owner : "")}>
      <div className={s.message__content} ref={ref}>
        {message.date && (
          <div className={s.message__date}>
            {formatRelative(message.date.seconds * 1000, Date.now())}
          </div>
        )}
        <p>{message.text}</p>
        {inView && message.image && (
          <img src={message.image} alt={message.senderId} />
        )}
      </div>
    </div>
  );
};

export default Message;
