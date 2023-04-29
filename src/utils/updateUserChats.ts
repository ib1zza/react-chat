import { updateDocument } from "src/utils/updateDoc";
import { serverTimestamp } from "firebase/firestore";

export function updateUserChats(
  path: string,
  chatId: string,
  from: string,
  inputData: string | undefined
) {
  return updateDocument("userChats", path, {
    [chatId + ".lastMessage"]: {
      text: inputData || "Вложение",
      from,
    },
    [chatId + ".date"]: serverTimestamp(),
  });
}
