import React, { ForwardedRef, forwardRef } from "react";
import { motion } from "framer-motion";
import s from "components/Sidebar/Sidebar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
interface Props {
  children: React.ReactNode;
  close?: () => void;
  noClose?: boolean;
}
const Modal: React.FC<Props> = forwardRef(
  ({ close, children, noClose }, refer: ForwardedRef<HTMLDivElement>) => {
    return (
      <motion.div
        ref={refer}
        className={s.overlay}
        onClick={close}
        animate={{ backgroundColor: "rgba(0,0,0,0.8)", opacity: 1 }}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
      >
        <motion.div
          className={s.popup}
          onClick={(e) => e.stopPropagation()}
          transition={{
            ease: "easeInOut",
          }}
          animate={{ x: 0, scale: 1 }}
          initial={{ x: -600, scale: 0 }}
          exit={{ x: 600, scale: 0 }}
        >
          {!noClose && (
            <button className={s.close} onClick={close}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
          {children}
        </motion.div>
      </motion.div>
    );
  }
);

export default motion(Modal);
