import React, { ForwardedRef, forwardRef } from "react";
import { motion } from "framer-motion";
import s from "components/Sidebar/Sidebar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
interface Props {
  children: React.ReactNode;
  close: () => void;
}
const Modal: React.FC<Props> = forwardRef(
  ({ close, children }, refer: ForwardedRef<HTMLDivElement>) => {
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
          animate={{ x: 0 }}
          initial={{ x: -300 }}
          exit={{ x: 300 }}
        >
          <button className={s.close} onClick={close}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          {children}
        </motion.div>
      </motion.div>
    );
  }
);

export default motion(Modal);