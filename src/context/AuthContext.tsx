import React, { useEffect, useState } from "react";
import { auth, db } from "src/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";

interface AuthContext {
  user: User | null;
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}

const AuthContext = React.createContext<AuthContext>({
  user: auth.currentUser,
  userInfo: {
    displayName: "name",
    uid: "0",
    email: "",
    photoURL: "",
  },
  setUserInfo: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export interface UserInfo {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = React.useState<User | null | {}>({});
  const [userInfo, setUserInfo] = useState<UserInfo>({
    displayName: "name",
    uid: "0",
    email: "",
    photoURL: "",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("auth user ", user);
      if (user) {
        setUser(user);
        setUserInfo({
          displayName: user.displayName,
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL,
        });
      } else setUser(null);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: (user as User) || null, userInfo, setUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};
