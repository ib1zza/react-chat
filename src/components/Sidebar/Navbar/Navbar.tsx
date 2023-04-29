import React, { lazy, Suspense, useMemo, useState } from "react";
import s from "../Sidebar.module.scss";
import { useAuth } from "src/context/AuthContext";

import Avatar from "components/Shared/Avatar/Avatar";
import { AnimatePresence } from "framer-motion";
import { Theme, useTheme } from "src/context/ThemeContext";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "components/Shared/Modal/Modal";

interface Props {
  isOpen: boolean;
}

const PopupSettings = lazy(
  () => import("components/Sidebar/PopupSettings/PopupSettings")
);

const Navbar: React.FC<Props> = ({ isOpen }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { user, userInfo } = useAuth();
  const { toggleTheme, theme } = useTheme();

  function handleTheme() {
    toggleTheme();
  }

  if (!userInfo) return null;
  return (
    <>
      <div className={s.navbar}>
        <span className={s.logo}>{isOpen ? "React-chat" : "RChat"}</span>
        <button className={s.button__theme} onClick={handleTheme}>
          {theme === Theme.LIGHT ? (
            <FontAwesomeIcon icon={faSun} />
          ) : (
            <FontAwesomeIcon icon={faMoon} />
          )}
        </button>

        <div className={s.user} onClick={() => setIsPopupOpen(true)}>
          <Avatar
            src={userInfo.photoURL}
            displayName={userInfo.displayName}
            className={s.avatar}
          />

          {isOpen && <span>{userInfo.displayName}</span>}
        </div>
      </div>
      <AnimatePresence>
        {isPopupOpen && user && (
          <Modal close={() => setIsPopupOpen(false)}>
            <Suspense>
              <PopupSettings user={user} />
            </Suspense>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
