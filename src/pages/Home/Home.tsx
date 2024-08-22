import React, { lazy, Suspense } from "react";
import s from "./Home.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import {useSelector} from "react-redux";
import {selectChatData} from "src/store/slices/chatSlice/chatSlice";

const Chat = lazy(() => import("../../components/Chat/Chat"));
const Home = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const isMobile = windowWidth <= 768;
  const data = useSelector(selectChatData)

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
            />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
