import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  updateCurrentUser,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth, db, storage } from "src/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateDocument } from "src/API/updateDoc";
import { updateEmail } from "@firebase/auth";

export const createUserEmailPass = async (
  email: string,
  password: string,
  displayName: string,
  file?: any,
): Promise<string | undefined> => {
  if (!displayName || !email || !password) {
    return Promise.reject("Заполните все поля");
  }

  console.log(file, typeof file);
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    console.log("start to update profile");

    if (file) {
      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // You can track the upload progress here
            console.log(
              `Uploaded ${
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              }%`,
            );
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
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
                resolve(undefined);
              },
            );
          },
        );
      });
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

      console.log("updated profile");
    }
  } catch (error) {
    return Promise.reject(error);
  }

  console.log("started to log in");
  await signOut(auth);
  await loginByEmailPass(email, password);
};

export const loginByGoogle = async () => {
  const provider = new GoogleAuthProvider();

  const userCredential = await signInWithPopup(auth, provider);

  if (!userCredential.user.uid) return;

  const id = userCredential.user.uid;
  const res = await getDoc(doc(db, "users", id));

  if (!res.exists()) {
    // user registration
    await setDoc(doc(db, "users", id), {
      uid: id,
      displayName: userCredential.user.displayName?.toLowerCase() || "user",
      email: userCredential.user.email,
      photoURL: userCredential.user.photoURL,
    });
    await setDoc(doc(db, "userChats", id), {});

    const displayName = userCredential.user.displayName || "user";

    if (displayName !== displayName.toLowerCase()) {
      console.log("updating profile");
      await updateProfile(userCredential.user, {
        displayName: displayName.toLowerCase(),
      });
    }
  } else {
    // user login
    const displayName = userCredential.user.displayName || "user";

    if (displayName !== displayName.toLowerCase()) {
      console.log("updating doc");
      await updateDocument("users", userCredential.user.uid, {
        displayName: displayName.toLowerCase(),
      });
      await updateProfile(userCredential.user, {
        displayName: displayName.toLowerCase(),
      });
    }
  }
};

export const loginByEmailPass = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password).then(
    (value) => {
      updateCurrentUser(auth, value.user);
      value.user.reload();
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
    },
  );
};

export const updateUserEmail = async (
  newEmail: string,
  userProvidedPassword: string,
): Promise<void> => {
  try {
    const currentUser = auth.currentUser;

    if (currentUser?.email) {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        userProvidedPassword,
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updateEmail(currentUser, newEmail);
    }
  } catch (error) {
    console.error("Error updating email:", error);
    throw error;
  }
};
