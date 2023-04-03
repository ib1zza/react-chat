import React, { useEffect, useState } from "react";
import { auth, db } from "src/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { addUser } from "src/store/slices/userSlice";

interface AuthContext {
  user: User | null;
  userInfo: UserInfo | null;
}

const AuthContext = React.createContext<AuthContext>({
  user: auth.currentUser,
  userInfo: null,
});

interface Props {
  children: React.ReactNode;
}

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export interface UserInfo {
  uid: string;
  displayName: string;
  email: string;
  isAuth: boolean;
  loading: boolean;
  photoURL?: string;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = React.useState<User | null | {}>({});
  const dispatch = useAppDispatch();
  const storedUser = useAppSelector((state) => state.user);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("auth user ", user);
      if (user?.uid && user?.email && user?.displayName) {
        const { displayName, email, photoURL, uid } = user;
        dispatch(
          addUser({
            displayName,
            email,
            photoURL: photoURL || undefined,
            uid,
          })
        );
        setUser(user);
      } else setUser(null);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: (user as User) || null, userInfo: storedUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
