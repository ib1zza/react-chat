import React from "react";
import s from "../Sidebar.module.scss";
import { signOut } from "firebase/auth";
import { auth } from "src/firebase";
import { useAuth } from "src/context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  return (
    <div className={s.navbar}>
      <span className={s.logo}>React-chat</span>
      <div className={s.user}>
        <img src={user?.photoURL || "#"} alt="" />
        <span>{user?.displayName}</span>
        <button onClick={() => signOut(auth)} className={s.logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
