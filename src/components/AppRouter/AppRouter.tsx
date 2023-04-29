import React, { lazy, Suspense } from "react";
import { AppRoute } from "src/routes";
import Login from "src/pages/Login/Login";
import Register from "src/pages/Register/Register";
import { Navigate, Route, Routes } from "react-router-dom";
import FullscreenLoader from "components/Shared/FullscreenLoader/FullscreenLoader";

const Home = lazy(() => import("src/pages/Home/Home"));

const protectedRoutes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<FullscreenLoader />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: AppRoute.Chats + "/:chatId",
    element: (
      <Suspense fallback={<FullscreenLoader />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <Navigate to={AppRoute.Chats + "/:chatId"} />,
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
  {
    path: "*",
    element: <Navigate to={AppRoute.Login} />,
  },
];

const AppRouter: React.FC<{ isAuth: boolean; loading: boolean }> = ({
  isAuth,
  loading,
}) => {
  return (
    <Routes>
      {!loading &&
        (isAuth ? protectedRoutes : publicRoutes).map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      {loading && <Route path="*" element={<FullscreenLoader />} />}
    </Routes>
  );
};

export default AppRouter;
