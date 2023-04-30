import React, { lazy, Suspense } from "react";
import s from "./Home.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useChat } from "src/context/ChatContext";

const Chat = lazy(() => import("../../components/Chat/Chat"));
const Home = () => {
  const windowHeight = window.innerHeight;
  console.log(windowHeight); // высота окна пользователя в пикселях

  const { data, dispatch } = useChat();
  return (
    <div className={s.home}>
      <div className={s.container} style={{ height: windowHeight + "px" }}>
        <Sidebar />
        <Suspense>
          {/* @ts-ignore*/}
          {data && data.user?.uid && <Chat data={data} dispatch={dispatch} />}
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
