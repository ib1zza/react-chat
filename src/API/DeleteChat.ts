import { updateDocument } from "src/API/updateDoc";
import { deleteDoc, deleteField, doc } from "firebase/firestore";
import { db } from "src/firebase";

export const deleteChat = async (
  chatId: string,
  userId: string,
  friendId: string,
) => {
  try {
    await updateDocument("chats", chatId, {
      messages: deleteField(),
    });
    await deleteDoc(doc(db, "chats", chatId));
    await updateDocument("userChats", friendId, {
      [chatId]: deleteField(),
    });
    await updateDocument("userChats", userId, {
      [chatId]: deleteField(),
    });
  } catch (error) {
    console.log(error);
  }
};
