import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  User,
} from "firebase/auth";
import { auth, db, storage } from "src/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateDocument } from "src/utils/updateDoc";
import { AppRoute } from "src/routes";

export const createUserEmailPass = async (
  email: string,
  password: string,
  displayName: string,
  file?: any
): Promise<string | undefined> => {
  if (!displayName || !email || !password) {
    return Promise.reject("Заполните все поля");
  }

  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (file) {
      const storageRef = ref(storage, displayName);

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
          return Promise.reject(error);
        },
        () => {
          getDownloadURL(uploadImage.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(response.user, {
              displayName,
              photoURL: downloadURL,
            });
            console.log("File available at", downloadURL);
            await setDoc(doc(db, "users", response.user.uid), {
              uid: response.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "userChats", response.user.uid), {});
          });
        }
      );
    } else {
      await updateProfile(response.user, {
        displayName,
      });

      await setDoc(doc(db, "users", response.user.uid), {
        uid: response.user.uid,
        displayName,
        email,
      });

      await setDoc(doc(db, "userChats", response.user.uid), {});
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const loginByGoogle = async () => {
  const provider = new GoogleAuthProvider();

  const userCredential = await signInWithPopup(auth, provider).then(
    (result) => {
      if (!result.user.displayName) return result;
      if (result.user.displayName !== result.user.displayName.toLowerCase()) {
        console.log("updating doc");
        updateDocument("users", result.user.uid, {
          displayName: result.user.displayName.toLowerCase(),
        });
        updateProfile(result.user, {
          displayName: result.user.displayName.toLowerCase(),
        });
      }
      return result;
    }
  );

  if (!userCredential.user.uid) return;
  const id = userCredential.user.uid;
  const res = await getDoc(doc(db, "users", id));

  if (!res.exists()) {
    await setDoc(doc(db, "users", id), {
      uid: id,
      displayName: userCredential.user.displayName?.toLowerCase() || "user",
      email: userCredential.user.email,
      photoURL: userCredential.user.photoURL,
    });
    await setDoc(doc(db, "userChats", id), {});
  }
};

export const loginByEmailPass = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password).then(
    (value) => {
      console.log(value);
      console.log(value.user.displayName);
      // TODO: remove after all users will be lowercase
      if (!value.user.displayName) return;
      if (value.user.displayName !== value.user.displayName.toLowerCase()) {
        console.log("updating doc");
        updateDocument("users", value.user.uid, {
          displayName: value.user.displayName.toLowerCase(),
        });
        updateProfile(value.user, {
          displayName: value.user.displayName.toLowerCase(),
        });
      }
    }
  );
};
