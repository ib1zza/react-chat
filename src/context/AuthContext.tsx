import React, { useEffect, useState } from "react";
import { auth, db } from "src/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  addUser,
  removeUser,
  authUser,
  unAuthUser,
} from "src/store/slices/userSlice";

interface AuthContext {
  user: User | null;
  userInfo: UserInfo | null;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContext>({
  user: auth.currentUser,
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
  const { authUser: user, displayUser: storedUser } = useAppSelector(
    (state) => state.user
  );
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
        dispatch(authUser(user));
      } else {
        dispatch(unAuthUser());
        dispatch(removeUser());
      }
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userInfo: storedUser,
        loading: storedUser.loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
