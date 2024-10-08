import React, { useState } from "react";
import s from "../Sidebar.module.scss";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "src/firebase";
import { useAuth } from "src/context/AuthContext";
import { UserInfo } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import Avatar from "components/Shared/Avatar/Avatar";
import { useAppDispatch } from "src/store/hooks";
import { selectChat } from "src/store/slices/chatSlice/chatSlice";
import { searchUsers } from "src/API/SearchUsers";
import { createChat } from "src/API/createChat";

const Search: React.FC = () => {
  const { t, i18n } = useTranslation();

  const { userInfo: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchedUsers, setSearchedUsers] = React.useState<UserInfo[]>([]);
  const [error, setError] = React.useState(false);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const searchUser = async () => {
    setLoading(true);
    try {
      const res = await searchUsers(searchQuery);

      setSearchedUsers(res);
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

    try {
      const res = await createChat(currentUser, selectedUser);
      dispatch(selectChat(selectedUser));
    } catch (e) {
      console.log(e);
      setError(true);
    }
    // try {
    //   const res = await getDoc(doc(db, "chats", combinedId));
    //
    //   if (!res.exists()) {
    //     console.log("creating chat: ", combinedId);
    //
    //     await setDoc(doc(db, "chats", combinedId), {
    //       messages: [],
    //     });
    //   } else {
    //     console.log("entering chat: ", combinedId);
    //   }
    //   const userChats = await getDoc(doc(db, "userChats", currentUser.uid));
    //
    //   if (!userChats.exists()) {
    //     await setDoc(doc(db, "userChats", currentUser.uid), {
    //       [combinedId]: {
    //         userInfo: {
    //           uid: selectedUser.uid,
    //           displayName: selectedUser.displayName,
    //           photoURL: selectedUser.photoURL || "",
    //         },
    //         date: serverTimestamp(),
    //       },
    //     });
    //   } else {
    //     await updateDoc(doc(db, "userChats", currentUser.uid), {
    //       [combinedId]: {
    //         userInfo: {
    //           uid: selectedUser.uid,
    //           displayName: selectedUser.displayName,
    //           photoURL: selectedUser.photoURL || "",
    //         },
    //         date: serverTimestamp(),
    //       },
    //     });
    //   }
    //
    //   const selectedUserChats = await getDoc(
    //     doc(db, "userChats", selectedUser.uid),
    //   );
    //
    //   if (!selectedUserChats.exists()) {
    //     await setDoc(doc(db, "userChats", selectedUser.uid), {
    //       [combinedId]: {
    //         userInfo: {
    //           uid: currentUser.uid,
    //           displayName: currentUser.displayName,
    //           photoURL: currentUser.photoURL || "",
    //         },
    //         date: serverTimestamp(),
    //       },
    //     });
    //   } else {
    //     await updateDoc(doc(db, "userChats", selectedUser.uid), {
    //       [combinedId]: {
    //         userInfo: {
    //           uid: currentUser.uid,
    //           displayName: currentUser.displayName,
    //           photoURL: currentUser.photoURL || "",
    //         },
    //         date: serverTimestamp(),
    //       },
    //     });
    //   }
    //
    //   dispatch(selectChat(selectedUser));
    // } catch (error) {
    //   console.log(error);
    //   setError(true);
    // }

    setSearchedUsers([]);
    setSearchQuery("");
  };
  return (
    <div className={s.search}>
      <div className={s.searchForm}>
        <input
          type="text"
          placeholder={t("search") as string}
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
      <div className={s.results}>
        {searchedUsers &&
          searchedUsers.map((el) => (
            <div
              key={el.uid}
              className={s.chat__user + " " + s.top}
              onClick={() => handleSelect(el)}
            >
              <Avatar
                src={el.photoURL}
                className={s.chat__user__avatar}
                displayName={el.displayName}
              />
              <div className={s.chat__user__info}>
                <span>{el.displayName}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Search;
