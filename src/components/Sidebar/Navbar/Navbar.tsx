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
