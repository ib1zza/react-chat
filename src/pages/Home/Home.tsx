import React, { lazy, Suspense } from "react";
import s from "./Home.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useChat } from "src/context/ChatContext";

const Chat = lazy(() => import("../../components/Chat/Chat"));
const Home = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const isMobile = windowWidth <= 768;

  const { data, dispatch } = useChat();
  const isSidebarOpened = !data?.user;

  return (
    <div className={s.home}>
      <div className={s.container} style={{ height: windowHeight + "px" }}>
        <Sidebar isOpen={isSidebarOpened} />

        <Suspense>
          {data && data.user?.uid && (
            <Chat
              // @ts-ignore
              data={data}
              dispatch={dispatch}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
