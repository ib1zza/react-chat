import React, { lazy, Suspense } from "react";
import s from "./Home.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useChat } from "src/context/ChatContext";

const Chat = lazy(() => import("../../components/Chat/Chat"));
const Home = () => {
  const { data, dispatch } = useChat();
  return (
    <div className={s.home}>
      <div className={s.container}>
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
