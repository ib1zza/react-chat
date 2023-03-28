import React from "react";
import s from "../Chat.module.scss";

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
import { motion } from "framer-motion";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faFile, faFileExcel } from "@fortawesome/free-regular-svg-icons";
import { AnimatePresence } from "framer-motion";
const InputPanel = () => {
  const [input, setInput] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { data } = useChat();
  const { user } = useAuth();

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      handleSend();
    }
  };

  const handleSend = async () => {
    let inputData = input;
    let fileData = file;
    setInput("");
    setFile(null);
    setLoading(true);
    if (!inputData.trim() && !fileData) return;
    if (!data?.chatId || !user?.uid || !data.user?.uid) return;

    if (fileData) {
      const storageRef = ref(storage, uuid());
      const uploadImage = uploadBytesResumable(storageRef, fileData);

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
                text: inputData,
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
          text: inputData,
          senderId: user?.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", user.uid), {
      [data.chatId + ".lastMessage"]: {
        text: inputData || "Вложение",
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text: inputData || "Вложение",
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
        onKeyDown={handleEnter}
      />
      <div className={s.send}>
        <input
          type="file"
          id="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <motion.div className={s.buttons} layout>
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
            <motion.button
              disabled={loading}
              onClick={handleSend}
              transition={{ type: "linear" }}
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              exit={{ x: 100 }}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InputPanel;
