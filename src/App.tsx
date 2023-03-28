import "./App.css";
import Register from "./pages/Register/Register";
import "the-new-css-reset/css/reset.css";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppRoutes } from "src/AppRoutes";
import { useAuth } from "src/context/AuthContext";
import React, { useEffect } from "react";

interface Props {
  children: React.ReactNode;
  condition: boolean;
}
const ProtectedRoute: React.FC<Props> = ({ children, condition }) => {
  console.log(condition);

  if (!condition) {
    return <Navigate to={AppRoutes.Login} />;
  } else {
    return <>{children}</>;
  }
};

function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={AppRoutes.Home} />
          <Route
            index
            element={
              <ProtectedRoute condition={!!user}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path={AppRoutes.Login} element={<Login />} />
          <Route path={AppRoutes.Register} element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
