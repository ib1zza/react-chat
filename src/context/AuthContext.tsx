import React, { useEffect, useState } from "react";
import { auth, db } from "src/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  addUser,
  removeUser,
  getUserData,
  setLoading,
} from "src/store/slices/userSlice/userSlice";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "src/types/routes";

interface AuthContext {
  userInfo: UserInfo | null;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContext>({
  userInfo: null,
  loading: false,
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
  const dispatch = useAppDispatch();
  const { displayUser: storedUser } = useAppSelector(getUserData);

  console.log("auth provider changed");
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.uid && user?.email) {
        if (!user.displayName) {
          console.log("no displayName");
          return;
        }
        console.log("auth user ", user?.toJSON());
        const { displayName, email, photoURL, uid } = user.toJSON() as any;
        dispatch(
          addUser({
            displayName: displayName || "",
            email,
            photoURL: photoURL || "",
            uid,
          }),
        );
      } else {
        dispatch(setLoading(false));
      }
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userInfo: storedUser,
        loading: storedUser.loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
