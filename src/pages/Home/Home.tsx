import React, { lazy, Suspense } from "react";
import s from "./Home.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useChat } from "src/context/ChatContext";

const Chat = lazy(() => import("../../components/Chat/Chat"));
const Home = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const { data, dispatch } = useChat();
  const isOpen = !data?.user;
  const isMobile = windowWidth <= 768;

  return (
    <div className={s.home}>
      <div className={s.container} style={{ height: windowHeight + "px" }}>
        {((isMobile && isOpen) || !isMobile) && <Sidebar isOpen={isOpen} />}
        <Suspense>
          {/* @ts-ignore*/}
          {data && data.user?.uid && <Chat data={data} dispatch={dispatch} />}
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
