import { collection, getDocs, or, query, where } from "firebase/firestore";
import { db } from "src/firebase";
import { UserInfo } from "firebase/auth";

export async function searchUsers(searchQuery: string) {
  const q = query(
    collection(db, "users"),
    or(
      where("email", "==", searchQuery),
      where("displayName", "==", searchQuery),
    ),
  );
  const querySnapshot = await getDocs(q);
  const userInfos: UserInfo[] = [];
  querySnapshot.forEach((doc) => {
    if (doc.data() !== null) {
      userInfos.push(doc.data() as UserInfo);
    }
  });
  console.log("searched users: ", userInfos);
  return userInfos;
}
