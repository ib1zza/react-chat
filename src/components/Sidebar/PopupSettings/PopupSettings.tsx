import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, storage } from "src/firebase";
import { signOut, updateProfile } from "firebase/auth";
import s from "components/Sidebar/Sidebar.module.scss";
import { User } from "firebase/auth";
import Avatar from "components/Shared/Avatar/Avatar";
import { AnimatePresence } from "framer-motion";
import { ThreeDots } from "react-loader-spinner";
import TextField from "components/Sidebar/PopupSettings/TextField/TextField";
import { updateDocument } from "src/API/updateDoc";
import { motion } from "framer-motion";
import { useAppDispatch } from "src/store/hooks";
import { editUser, removeUser } from "src/store/slices/userSlice/userSlice";
import { useTranslation } from "react-i18next";
import { langs } from "src/i18n";
import { Theme, useTheme } from "src/context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { UserInfo } from "src/context/AuthContext";
import EmailUpdater from "components/Sidebar/PopupSettings/EmailUpdater/EmailUpdater";
interface Props {
  user: UserInfo;
  isPopupOpen: boolean;
}

const PopupSettings: React.FC<Props> = ({ user, isPopupOpen }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const [file, setFile] = React.useState<File | null>(null);
  const [isActiveImage, setIsActiveImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleUpdateDisplayname = async (name: string) => {
    setError("");
    if (name === user.displayName || !name.trim()) return;
    if (name.toLowerCase() !== name) {
      setError("Name must be lowercase");
      return;
    }

    await updateDocument("users", user.uid, { displayName: name });
    await updateProfile(auth.currentUser as User, {
      displayName: name,
    }).then(() => dispatch(editUser({ displayName: name })));
  };

  useEffect(() => {
    if (!isPopupOpen) {
      setFile(null);
      setIsActiveImage(false);
      setLoading(false);
      setError("");
    }
  }, [isPopupOpen]);

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
          await updateProfile(auth.currentUser as User, {
            photoURL: downloadURL,
          }).then(() => {
            setLoading(false);
            setIsActiveImage(false);
            dispatch(
              editUser({
                photoURL: downloadURL,
              }),
            );
          });
        });
      },
    );
  };

  useEffect(() => {
    console.log(file);
    handleUpdateAvatar();
  }, [file]);

  const signOutHandler = () => {
    signOut(auth).then(() => {
      dispatch(removeUser());
    });
  };
  const { toggleTheme, theme } = useTheme();

  function handleTheme() {
    toggleTheme();
  }

  return (
    <>
      <button onClick={signOutHandler} className={s.logout}>
        {t("logout")}
      </button>

      <div className={s.popup__profile}>
        <div className={s.profile__avatar}>
          <div className={s.profile__avatar}>
            <Avatar
              src={user.photoURL}
              displayName={user.displayName}
              className={
                s.profile__avatar_img + " " + (isActiveImage ? s.blurred : "")
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
                      <span>{t("changeAvatar")}</span>
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

        <div className={s.editUserForm}>
          <div className={s.editName}>
            <p className={s.title}>{t("editName")}</p>
            <TextField
              displayName={user.displayName || "your name"}
              onUpdate={handleUpdateDisplayname}
              isPopupOpen={isPopupOpen}
            />
          </div>

          <EmailUpdater prevEmail={user.email} isPopupOpen={isPopupOpen} />
          {error && <p>{error}</p>}
          <div className={s.langs}>
            <p className={s.title}>{t("language")}</p>
            <div className={s.langs__list}>
              {langs.map((lang) => (
                <button
                  key={lang}
                  className={
                    s.button +
                    " " +
                    (i18n.resolvedLanguage == lang ? s.active : "")
                  }
                  onClick={() => i18n.changeLanguage(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className={s.theme}>
            <p className={s.title}>{t("change theme")}</p>
            <button className={s.button} onClick={handleTheme}>
              {theme === Theme.LIGHT ? (
                <FontAwesomeIcon icon={faSun} />
              ) : (
                <FontAwesomeIcon icon={faMoon} />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupSettings;
