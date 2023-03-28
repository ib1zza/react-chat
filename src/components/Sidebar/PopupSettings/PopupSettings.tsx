import React, { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "src/firebase";
import { updateProfile } from "firebase/auth";
import s from "components/Sidebar/Sidebar.module.scss";
import { User } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Avatar from "components/Shared/Avatar/Avatar";
import { faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence } from "framer-motion";

import { ThreeDots } from "react-loader-spinner";
import TextField from "components/Sidebar/PopupSettings/TextField/TextField";
import { useAuth } from "src/context/AuthContext";
import { updateDocument } from "src/utils/updateDoc";
import { motion } from "framer-motion";
interface Props {
  user: User;
  close: () => void;
}
const PopupSettings: React.FC<Props> = forwardRef(
  ({ user, close }, refer: ForwardedRef<HTMLDivElement | null>) => {
    const { setUserInfo } = useAuth();
    const [file, setFile] = React.useState<File | null>(null);
    const [isActiveImage, setIsActiveImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdateDisplayname = async (name: string) => {
      await updateDocument("users", user.uid, { displayName: name });
      await updateProfile(user, {
        displayName: name,
      }).then(() => setUserInfo((prev) => ({ ...prev, displayName: name })));
    };

    const handleUpdateAvatar = async () => {
      if (!user.displayName || !file) return;
      const storageRef = ref(storage, user?.displayName);

      const uploadImage = uploadBytesResumable(storageRef, file);
      setLoading(true);
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
          setLoading(false);
          setIsActiveImage(false);
        },
        () => {
          getDownloadURL(uploadImage.snapshot.ref).then(async (downloadURL) => {
            await updateDocument("users", user.uid, { photoURL: downloadURL });
            await updateProfile(user, {
              photoURL: downloadURL,
            }).then(() => {
              setLoading(false);
              setIsActiveImage(false);
              setUserInfo((prevState) => ({
                ...prevState,
                photoURL: downloadURL,
              }));
            });
          });
        }
      );
    };

    useEffect(() => {
      console.log(file);
      handleUpdateAvatar();
    }, [file]);

    return (
      <motion.div ref={refer} className={s.overlay} onClick={close}>
        <motion.div
          className={s.popup}
          onClick={(e) => e.stopPropagation()}
          transition={{
            ease: "easeInOut",
          }}
          animate={{ x: 0 }}
          initial={{ x: -300 }}
          exit={{ x: 300 }}
        >
          <button className={s.close} onClick={close}>
            <FontAwesomeIcon icon={faXmark} />
          </button>

          <div className={s.popup__profile}>
            <div className={s.profile__avatar}>
              <div className={s.profile__avatar}>
                <Avatar
                  src={user.photoURL}
                  className={
                    s.profile__avatar_img +
                    " " +
                    (isActiveImage ? s.blurred : "")
                  }
                  onClick={() => setIsActiveImage(true)}
                />
                <AnimatePresence>
                  {isActiveImage && (
                    <motion.div
                      animate={{ opacity: 0.8 }}
                      initial={{ opacity: 0 }}
                      className={s.blur}
                    >
                      <label htmlFor="file">
                        {loading ? (
                          <ThreeDots
                            height="80"
                            width="80"
                            radius="9"
                            color="#fff"
                            ariaLabel="three-dots-loading"
                            visible={true}
                          />
                        ) : (
                          <span>Change avatar</span>
                        )}
                      </label>
                      <input
                        hidden
                        type="file"
                        id="file"
                        onChange={(e) =>
                          setFile(e.target.files ? e.target.files[0] : null)
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <TextField
              displayName={user.displayName || "where is ur name?"}
              onUpdate={handleUpdateDisplayname}
            />
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

export default motion(PopupSettings);
