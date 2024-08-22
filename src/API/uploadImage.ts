import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "src/firebase";
import { v4 as uuid } from "uuid";

export async function uploadImage({
  file,
  onError,
  onSuccess,
}: {
  file: File;
  onError?: (error: Error) => void;
  onSuccess?: (url: string) => void;
}) {
  const storageRef = ref(storage, uuid());
  const uploadImage = uploadBytesResumable(storageRef, file);

  uploadImage.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Image upload is " + progress + "% done");
    },
    (error) => {
      onError && onError(error);
    },
    () => {
      getDownloadURL(uploadImage.snapshot.ref).then((url) => {
        onSuccess && onSuccess(url);
      });
    }
  );
}
