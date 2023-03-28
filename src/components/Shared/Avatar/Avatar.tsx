import React from "react";
import s from "./Avatar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  className?: string;
  displayName?: string | null;
}

const Avatar: React.FC<Props> = ({ displayName, src, className, ...props }) => {
  return (
    <div
      className={
        s.avatar +
        " " +
        (!src ? s.template : "") +
        " " +
        (className ? className : "")
      }
      {...props}
    >
      {src ? (
        <img src={src || ""} alt="" />
      ) : displayName ? (
        <span>{displayName.charAt(0).toUpperCase()}</span>
      ) : (
        <FontAwesomeIcon icon={faUser} />
      )}
    </div>
  );
};

export default Avatar;
