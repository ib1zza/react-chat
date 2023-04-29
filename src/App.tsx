import React from "react";
import "./App.scss";
import "the-new-css-reset/css/reset.css";
import { useAuth } from "src/context/AuthContext";
import AppRouter from "components/AppRouter/AppRouter";

function App() {
  const { loading, userInfo } = useAuth();
  return (
    !loading && <AppRouter isAuth={!!userInfo?.isAuth} loading={loading} />
  );
}

export default App;
