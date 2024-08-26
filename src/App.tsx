import React from "react";
import "./App.scss";
import { useAuth } from "src/context/AuthContext";
import AppRouter from "components/AppRouter/AppRouter";
import { useTheme } from "src/context/ThemeContext";

const App: React.FC = () => {
  const { loading, userInfo } = useAuth();
  const { toggleTheme, theme } = useTheme();

  function handleTheme() {
    toggleTheme();
  }
  return (
    <div>
      {/*TODO: delete*/}
      <button onClick={handleTheme}>change theme</button>
      {!loading && <AppRouter isAuth={!!userInfo?.isAuth} loading={loading} />}
    </div>
  );
};

export default App;
