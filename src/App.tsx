import React from "react";
import "./App.scss";
import "the-new-css-reset/css/reset.css";
import { useAuth } from "src/context/AuthContext";

import AppRouter from "components/AppRouter/AppRouter";
import { removeUser } from "src/store/slices/userSlice";
import { useAppDispatch } from "src/store/hooks";

function App() {
  const { loading, userInfo } = useAuth();
  return (
    <div>
      {!loading && <AppRouter isAuth={!!userInfo?.isAuth} loading={loading} />}
    </div>
  );
}

export default App;
