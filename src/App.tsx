import React from "react";
import "./App.scss";
import { useAuth } from "src/context/AuthContext";
import AppRouter from "components/AppRouter/AppRouter";

const App: React.FC = () => {
  const { loading, userInfo } = useAuth();
  return (
    <div>
      {!loading && <AppRouter isAuth={!!userInfo?.isAuth} loading={loading} />}
    </div>
  );
};

export default App;
