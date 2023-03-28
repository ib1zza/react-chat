import React, { useState } from "react";
import s from "../Sidebar.module.scss";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "src/firebase";
import { useAuth } from "src/context/AuthContext";
import { UserInfo } from "firebase/auth";
import { ChatAction, useChat } from "src/context/ChatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";

const Search: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [user, setUser] = React.useState<UserInfo | null>(null);
  const [error, setError] = React.useState(false);
  const { dispatch } = useChat();
  const [loading, setLoading] = useState(false);

  const searchUser = async () => {
    setLoading(true);
    const q = query(
      collection(db, "users"),
      where("displayName", "==", searchQuery)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data() as UserInfo);
      });
    } catch (error) {
      console.log(error);
      setError(true);
    }
    setLoading(false);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      searchUser();
    }
  };

  const handleSelect = async () => {
    if (!currentUser || !user) return;

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });
      }

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [combinedId + ".userInfo"]: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "userChats", user.uid), {
        [combinedId + ".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });

      dispatch({ type: ChatAction.CHANGE_USER, payload: user });
    } catch (error) {
      console.log(error);
      setError(true);
    }

    setUser(null);
    setSearchQuery("");
    dispatch({ type: ChatAction.CHANGE_USER, payload: user });
  };
  return (
    <div className={s.search}>
      <div className={s.searchForm}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onKeyDown={handleEnter}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setUser(null);
          }}
        />
        {searchQuery && (
          <button onClick={searchUser}>
            {loading ? (
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="25"
                visible={true}
              />
            ) : (
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            )}
          </button>
        )}
      </div>
      {error && <div className={s.error}>User not found</div>}
      {user && (
        <div className={s.chat__user} onClick={handleSelect}>
          <img src={user.photoURL || ""} alt={user.displayName || ""} />
          <div className={s.chat__user__info}>
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
