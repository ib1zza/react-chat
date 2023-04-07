import React, { useState } from "react";
import s from "../Sidebar.module.scss";
import { useAuth } from "src/context/AuthContext";
import PopupSettings from "components/Sidebar/PopupSettings/PopupSettings";

import Avatar from "components/Shared/Avatar/Avatar";
import { AnimatePresence } from "framer-motion";
import { Theme, useTheme } from "src/context/ThemeContext";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  isOpen: boolean;
}

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

          {isOpen && (
            <>
              <span>{userInfo.displayName}</span>
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isPopupOpen && user && (
          <PopupSettings user={user} close={() => setIsPopupOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
