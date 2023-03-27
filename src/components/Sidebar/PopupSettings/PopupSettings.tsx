import React from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "src/firebase";
import { updateProfile } from "firebase/auth";
import s from "components/Sidebar/Sidebar.module.scss";
import { User } from "firebase/auth";

interface Props {
  user: User;
  close: () => void;
}
const PopupSettings: React.FC<Props> = ({ user, close }) => {
  const [file, setFile] = React.useState<File | null>(null);

  const handleUpdateAvatar = async () => {
    if (!user?.displayName || !file) return;
    const storageRef = ref(storage, user?.displayName);

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
          await updateProfile(user, {
            photoURL: downloadURL,
          });
          console.log("File available at", downloadURL);
        });
      }
    );
  };
  return (
    <div className={s.overlay} onClick={close}>
      <div className={s.popup} onClick={(e) => e.stopPropagation()}>
        <button className={s.close} onClick={close}>
          X
        </button>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <button onClick={handleUpdateAvatar}>Change avatar</button>
      </div>
    </div>
  );
};

export default PopupSettings;
