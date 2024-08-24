import { updateDocument } from "src/API/updateDoc";
import { deleteDoc, deleteField, doc } from "firebase/firestore";
import { db } from "src/firebase";

export const deleteChat = async (
  chatId: string,
  userId: string,
  friendId: string,
) => {
  return await updateDocument("chats", chatId, {
    messages: deleteField(),
  }).then(() => {
    deleteDoc(doc(db, "chats", chatId));
    updateDocument("userChats", friendId, {
      [chatId]: deleteField(),
    });
    updateDocument("userChats", userId, {
      [chatId]: deleteField(),
    });
  });
};
