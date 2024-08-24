import { updateDocument } from "src/API/updateDoc";
import { serverTimestamp } from "firebase/firestore";

export function updateUserChats(
  path: string,
  chatId: string,
  senderId: string,
  inputData: string | undefined,
) {
  return updateDocument("userChats", path, {
    [chatId + ".lastMessage"]: {
      text: inputData || "Вложение",
      from: senderId,
    },
    [chatId + ".date"]: serverTimestamp(),
  });
}
