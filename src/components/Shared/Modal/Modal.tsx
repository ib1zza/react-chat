import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import s from "components/Sidebar/Sidebar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { classNames } from "src/lib/classNames/classNames";
interface Props {
  isOpen?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  noClose?: boolean;
}
const ANIMATION_DELAY = 300;

const Modal: React.FC<Props> = ({ isOpen, onClose, children, noClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose && onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onKeyDown]);

  const mods: Record<string, boolean> = {
    [s.opened]: isOpen || false,
    [s.isClosing]: isClosing,
  };

  return (
    <div className={classNames(s.overlay, mods)} onClick={onClose}>
      <div className={s.popup} onClick={(e) => e.stopPropagation()}>
        {!noClose && (
          <button className={s.close} onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
