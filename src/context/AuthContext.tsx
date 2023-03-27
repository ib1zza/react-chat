import React, { useEffect } from "react";
import { auth } from "src/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";

interface AuthContext {
  user: User | null;
}

const AuthContext = React.createContext<AuthContext>({
  user: auth.currentUser,
});

interface Props {
  children: React.ReactNode;
}

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = React.useState<User | null | {}>({});
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("auth user " + user);
      if (user) {
        setUser(user);
      } else setUser(null);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user: (user as User) || null }}>
      {children}
    </AuthContext.Provider>
  );
};
