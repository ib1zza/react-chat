import React from "react";
import s from "../Sidebar.module.scss";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "src/firebase";
import { useAuth } from "src/context/AuthContext";
import { UserInfo } from "firebase/auth";
import { useChat } from "src/context/ChatContext";

interface Props {
  isOpen: boolean;
  changeOpen: (isOpen: boolean) => void;
}
const Search: React.FC<Props> = ({ isOpen, changeOpen }) => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [user, setUser] = React.useState<UserInfo | null>(null);
  const [error, setError] = React.useState(false);
  const { dispatch } = useChat();

  const searchUser = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", searchQuery)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data() as UserInfo);
        console.log(doc.data());
      });
    } catch (error) {
      console.log(error);
      setError(true);
    }
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

      dispatch({ type: "CHANGE_USER", payload: user });
    } catch (error) {
      console.log(error);
      setError(true);
    }

    setUser(null);
    setSearchQuery("");
  };
  return (
    <div className={s.search}>
      <div className={s.searchForm}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onKeyDown={handleEnter}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
