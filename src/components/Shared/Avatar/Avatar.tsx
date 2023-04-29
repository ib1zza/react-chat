import React from "react";
import s from "./Avatar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useInView } from "react-intersection-observer";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  className?: string;
  displayName?: string | null;
}

const Avatar: React.FC<Props> = ({ displayName, src, className, ...props }) => {
  const options = {
    threshold: 0.2,
    triggerOnce: true,
  };
  const { ref, inView } = useInView(options);

  return (
    <div
      ref={ref}
      className={
        s.avatar +
        " " +
        (!src ? s.template : "") +
        " " +
        (className ? className : "")
      }
      {...props}
    >
      {!inView ? (
        displayName ? (
          <span>{displayName.charAt(0).toUpperCase()}</span>
        ) : (
          <FontAwesomeIcon icon={faUser} />
        )
      ) : src ? (
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
