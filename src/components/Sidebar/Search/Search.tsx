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
  const [searchedUsers, setSearchedUsers] = React.useState<UserInfo[]>([]);
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
      let newArray: UserInfo[] = [];
      querySnapshot.forEach((doc) => {
        if (doc.data() !== null) {
          newArray.push(doc.data() as UserInfo);
        }
      });
      console.log("searched users: ", newArray);
      setSearchedUsers(newArray);
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

  const handleSelect = async (selectedUser: UserInfo) => {
    if (!currentUser || !searchedUsers) return;

    const combinedId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });
      }

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [combinedId + ".userInfo"]: {
          uid: selectedUser.uid,
          displayName: selectedUser.displayName,
          photoURL: selectedUser.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "userChats", selectedUser.uid), {
        [combinedId + ".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });

      dispatch({ type: ChatAction.CHANGE_USER, payload: selectedUser });
    } catch (error) {
      console.log(error);
      setError(true);
    }

    setSearchedUsers([]);
    setSearchQuery("");
    dispatch({ type: ChatAction.CHANGE_USER, payload: selectedUser });
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
            setSearchedUsers([]);
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
      {searchedUsers &&
        searchedUsers.map((el) => (
          <div
            key={el.uid}
            className={s.chat__user}
            onClick={() => handleSelect(el)}
          >
            <img src={el.photoURL || ""} alt={el.displayName || ""} />
            <div className={s.chat__user__info}>
              <span>{el.displayName}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Search;
