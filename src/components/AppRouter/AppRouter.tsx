import React from "react";
import Home from "src/pages/Home/Home";
import { AppRoute } from "src/routes";
import Login from "src/pages/Login/Login";
import Register from "src/pages/Register/Register";
import { Navigate, Route, Routes } from "react-router-dom";

const protectedRoutes = [
  {
    path: AppRoute.Home,
    element: <Home />,
  },
  {
    path: AppRoute.Chats + "/:chatId",
    element: <Home />,
  },
];

const publicRoutes = [
  {
    path: AppRoute.Login,
    element: <Login />,
  },
  {
    path: AppRoute.Register,
    element: <Register />,
  },
];

const AppRouter: React.FC<{ isAuth: boolean }> = ({ isAuth }) => {
  return (
    <Routes>
      {isAuth ? (
        <>
          {protectedRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path={"*"} element={<Navigate to={AppRoute.Home} />} />
        </>
      ) : (
        <>
          {publicRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </>
      )}
    </Routes>
  );
};

export default AppRouter;
