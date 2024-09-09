import { doc, getDoc } from "firebase/firestore";
import { db } from "src/firebase";
import { UserInfo } from "firebase/auth";

export async function searchUser(id: string) {
  const user = await getDoc(doc(db, "users", id));
  console.log("searched users: ", user.data());
  return user.data() as UserInfo;
}
