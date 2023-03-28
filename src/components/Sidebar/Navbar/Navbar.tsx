import React, { useState } from "react";
import s from "../Sidebar.module.scss";
import { signOut } from "firebase/auth";
import { auth } from "src/firebase";
import { useAuth } from "src/context/AuthContext";
import PopupSettings from "components/Sidebar/PopupSettings/PopupSettings";

import Avatar from "components/Shared/Avatar/Avatar";
import { AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
}

const Navbar: React.FC<Props> = ({ isOpen }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { user, userInfo } = useAuth();

  return (
    <>
      <div className={s.navbar}>
        <span className={s.logo}>{isOpen ? "React-chat" : "RChat"}</span>
        <div className={s.user}>
          <Avatar
            src={userInfo.photoURL}
            displayName={userInfo.displayName}
            onClick={() => setIsPopupOpen(true)}
            className={s.avatar}
          />

          {isOpen && (
            <>
              <span>{userInfo.displayName}</span>
              <button onClick={() => signOut(auth)} className={s.logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isPopupOpen && user && (
          <PopupSettings
            animate={{ backgroundColor: "rgba(0,0,0,0.8)", opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            user={user}
            close={() => setIsPopupOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
