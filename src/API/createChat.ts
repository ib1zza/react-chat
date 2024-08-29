import { UserInfo as UserInfoFirebase } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "src/firebase";
import { UserInfo } from "src/context/AuthContext";

export async function createChat(
  currentUser: UserInfo,
  selectedUser: UserInfoFirebase,
) {
  const combinedId =
    currentUser.uid > selectedUser.uid
      ? currentUser.uid + selectedUser.uid
      : selectedUser.uid + currentUser.uid;

  // get chat doc and create it if it doesn't exist
  const chatDoc = await getDoc(doc(db, "chats", combinedId));
  const isChatExists = chatDoc.exists();

  if (!isChatExists) {
    console.log("creating chat: ", combinedId);

    await setDoc(doc(db, "chats", combinedId), {
      messages: [],
    });
  } else {
    console.log("entering chat: ", combinedId);
  }

  const currentUserChats = await getDoc(doc(db, "userChats", currentUser.uid));
  const isCurrentUserChatExists = currentUserChats.exists();

  // create userChats entry if it doesn't exist
  if (!isCurrentUserChatExists) {
    await setDoc(doc(db, "userChats", currentUser.uid), {
      [combinedId]: {
        userInfo: {
          uid: selectedUser.uid,
          displayName: selectedUser.displayName,
          photoURL: selectedUser.photoURL || "",
        },
        date: serverTimestamp(),
      },
    });
  } else {
    const updateData: any = {
      [combinedId]: {
        userInfo: {
          uid: selectedUser.uid,
          displayName: selectedUser.displayName,
          photoURL: selectedUser.photoURL || "",
        },
        date: serverTimestamp(),
      },
    };

    //   no need to update date if the chat already exists
    if (isChatExists) {
      delete updateData[combinedId].date;
    }

    console.log("updateData", updateData);
    await updateDoc(doc(db, "userChats", currentUser.uid), updateData);
  }

  const selectedUserChats = await getDoc(
    doc(db, "userChats", selectedUser.uid),
  );

  const isSelectedUserChatExists = selectedUserChats.exists();

  if (!isSelectedUserChatExists) {
    await setDoc(doc(db, "userChats", selectedUser.uid), {
      [combinedId]: {
        userInfo: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL || "",
        },
        date: serverTimestamp(),
      },
    });
  } else {
    const updateData: any = {
      [combinedId]: {
        userInfo: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL || "",
        },
        date: serverTimestamp(),
      },
    };

    //   no need to update date if the chat already exists

    if (isChatExists) {
      delete updateData[combinedId].date;
    }

    console.log("selectedUserUpdateData", updateData);
    await updateDoc(doc(db, "userChats", selectedUser.uid), updateData);
  }
}
