import { updateDocument } from "src/utils/updateDoc";
import { arrayUnion, Timestamp } from "firebase/firestore";
import { v4 as uuid } from "uuid";

interface Message {
  text: string;
  senderId: string;
  image?: string;
}

export function updateChats(pathSegments: string, message: Message) {
  return updateDocument("chats", pathSegments, {
    messages: arrayUnion({
      id: uuid(),
      date: Timestamp.now(),
      ...message,
    }),
  });
}
