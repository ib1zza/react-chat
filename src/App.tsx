import React from "react";
import "./App.scss";
import "the-new-css-reset/css/reset.css";
import { useAuth } from "src/context/AuthContext";

import AppRouter from "components/AppRouter/AppRouter";
import { useParams } from "react-router-dom";

function App() {
  const { chatId } = useParams();
  console.log(chatId);

  const { loading, userInfo } = useAuth();
  return (
    <div>
      {!loading && <AppRouter isAuth={!!userInfo?.isAuth} loading={loading} />}
    </div>
  );
}

export default App;
