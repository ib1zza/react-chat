import React from "react";
import s from "../Chat.module.scss";
import Img from "../../../assets/img/img.png";
import { useChat } from "src/context/ChatContext";
import { useAuth } from "src/context/AuthContext";
import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "src/firebase";
import { v4 as uuid } from "uuid";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faFile, faFileExcel } from "@fortawesome/free-regular-svg-icons";
const InputPanel = () => {
  const [input, setInput] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { data } = useChat();
  const { user } = useAuth();

  const handleSend = async () => {
    if (!input.trim() && !file) return;
    if (!data?.chatId || !user?.uid || !data.user?.uid) return;
    setInput("");
    setFile(null);
    setLoading(true);
    if (file) {
      const storageRef = ref(storage, uuid());
      const uploadImage = uploadBytesResumable(storageRef, file);

      uploadImage.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Image upload is " + progress + "% done");
        },
        (error) => {
          setLoading(false);
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

    setLoading(false);
  };
  return (
    <div className={s.input}>
      <input
        className={s.text}
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
        <div className={s.buttons}>
          {file ? (
            <label onClick={() => setTimeout(() => setFile(null), 100)}>
              <FontAwesomeIcon icon={faFileExcel} />
            </label>
          ) : (
            <label htmlFor="file">
              <FontAwesomeIcon icon={faFile} />
            </label>
          )}

          {(input || file) && (
            <button disabled={loading} onClick={handleSend}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputPanel;
