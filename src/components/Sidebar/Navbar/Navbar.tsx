import React from "react";
import s from "../Sidebar.module.scss";
import { signOut } from "firebase/auth";
import { auth } from "src/firebase";
import { useAuth } from "src/context/AuthContext";

import PopupSettings from "components/Sidebar/PopupSettings/PopupSettings";

interface Props {
  isOpen: boolean;
  changeOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<Props> = ({ isOpen, changeOpen }) => {
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const { user } = useAuth();

  return (
    <>
      <div className={s.navbar}>
        <span className={s.logo}>{isOpen ? "React-chat" : "RChat"}</span>
        <div className={s.user}>
          <img
            onClick={() => setIsPopupOpen(true)}
            src={user?.photoURL || "#"}
            alt=""
          />
          {isOpen && (
            <>
              <span>{user?.displayName}</span>
              <button onClick={() => signOut(auth)} className={s.logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
      {isPopupOpen && user && (
        <PopupSettings user={user} close={() => setIsPopupOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
