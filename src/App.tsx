import React from "react";
import "./App.scss";
import "the-new-css-reset/css/reset.css";
import { useAuth } from "src/context/AuthContext";

import AppRouter from "components/AppRouter/AppRouter";

function App() {
  const { loading, user } = useAuth();
  return <div>{!loading && <AppRouter isAuth={!!user} />}</div>;
}

export default App;
