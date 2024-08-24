import React from "react";
import s from "../Chat.module.scss";
import { useAuth } from "src/context/AuthContext";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faFile, faFileExcel } from "@fortawesome/free-regular-svg-icons";
import { useTranslation } from "react-i18next";
import { uploadImage } from "src/API/uploadImage";
import { updateUserChats } from "src/API/updateUserChats";
import { updateChats } from "src/API/updateChats";
import {useAppSelector} from "src/store/hooks";
import {selectChatData} from "src/store/slices/chatSlice/chatSlice";

const InputPanel = () => {
  const { t } = useTranslation();
  const [input, setInput] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const data  = useAppSelector(selectChatData);
  const { user } = useAuth();

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key == "Enter") {
      handleSend();
    }
  };

  const handleSend = async () => {
    const inputData = input;
    const fileData = file;
    setInput("");
    setFile(null);
    setLoading(true);
    if (!inputData.trim() && !fileData) return;
    if (!data?.chatId || !user?.uid || !data.user?.uid) return;

    if (fileData) {
      await uploadImage({
        file: fileData,
        onError: console.log,
        onSuccess: (url: string) => {
          updateChats(data.chatId, {
            text: inputData,
            senderId: user.uid,
            image: url,
          });
        },
      });
    } else {
      await updateChats(data.chatId, { text: inputData, senderId: user.uid });
    }

    await updateUserChats(user.uid, data.chatId, user.uid, inputData);
    await updateUserChats(data.user.uid, data.chatId, user.uid, inputData);

    setLoading(false);
  };

  return (
    <div className={s.input}>
      <textarea
        className={s.text}
        placeholder={t("input") as string}
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

          {(input.trim() || file) && (
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
