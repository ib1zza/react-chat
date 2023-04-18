import React from "react";
import Home from "src/pages/Home/Home";
import { AppRoute } from "src/routes";
import Login from "src/pages/Login/Login";
import Register from "src/pages/Register/Register";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import FullscreenLoader from "components/Shared/FullscreenLoader/FullscreenLoader";

const protectedRoutes = [
  {
    path: "/",
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

const AppRouter: React.FC<{ isAuth: boolean; loading: boolean }> = ({
  isAuth,
  loading,
}) => {
  return (
    <Routes>
      {!loading && isAuth ? (
        <>
          {protectedRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route
            path={"*"}
            element={<Navigate to={AppRoute.Chats + "/:chatId"} />}
          />
        </>
      ) : (
        <>
          {publicRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path={"*"} element={<Navigate to={AppRoute.Login} />} />
        </>
      )}
      {loading && <Route path="*" element={<FullscreenLoader />} />}
    </Routes>
  );
};

export default AppRouter;
