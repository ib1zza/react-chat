import React, { memo } from "react";
import s from "components/Chat/Chat.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Avatar from "components/Shared/Avatar/Avatar";

interface Props {
  displayName: string | null;
  photoURL: string | null;
  exitChat: () => void;
  onUserClick: () => void;
}

const ChatHeaderMainInfo = memo(
  ({ displayName, photoURL, exitChat, onUserClick }: Props) => {
    return (
      <div className={s.chat__info}>
        <button onClick={exitChat}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className={s.username}>
          <span>{displayName || "noname"}</span>
        </div>
        <Avatar
          className={s.avatar}
          src={photoURL}
          onClick={onUserClick}
          displayName={displayName || "noname"}
        />
      </div>
    );
  }
);

export default ChatHeaderMainInfo;
