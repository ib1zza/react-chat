import React from 'react';
import s from './Home.module.scss';
import Sidebar from "../../components/Sidebar/Sidebar";
import Chat from "../../components/Chat/Chat";
const Home = () => {
    return (
        <div className={s.home}>
            <div className={s.container}>
                <Sidebar />
                <Chat />
            </div>

        </div>
    );
};

export default Home;