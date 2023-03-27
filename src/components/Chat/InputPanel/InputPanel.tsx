import React from "react";
import s from "../Chat.module.scss";
import Img from "../../../assets/img/img.png";
import { useChat } from "src/context/ChatContext";
import { useAuth } from "src/context/AuthContext";
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "src/firebase";
import { v4 as uuid } from "uuid";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const InputPanel = () => {
  const [input, setInput] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const { data } = useChat();
  const { user } = useAuth();

  const handleSend = async () => {
    if (!data?.chatId || !user?.uid || !data.user?.uid) return;

    if (file) {
      const storageRef = ref(storage, uuid());
      const uploadImage = uploadBytesResumable(storageRef, file);

      uploadImage.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Image upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // setError(true);
        },
        () => {
          getDownloadURL(uploadImage.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: input,
                senderId: user?.uid,
                date: Timestamp.now(),
                image: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: input,
          senderId: user?.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", user.uid), {
      [data.chatId + ".lastMessage"]: {
        text: input,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text: input,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setInput("");
    setFile(null);
  };
  return (
    <div className={s.input}>
      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className={s.send}>
        <input
          type="file"
          id="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default InputPanel;
