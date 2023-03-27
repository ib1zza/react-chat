import React from "react";
import s from "../Register/Register.module.scss";
import Add from "../../assets/img/addAvatar.png";
import { Link, useNavigate } from "react-router-dom";

import { auth, db, storage } from "src/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { AppRoutes } from "src/AppRoutes";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState(false);
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // @ts-ignore
    const email = e.target[0].value;
    // @ts-ignore
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(AppRoutes.Home, { replace: true });
    } catch (error) {
      setError(true);
    }
  };
  return (
    <div className={s.form__container}>
      <div className={s.form__wrapper}>
        <h1 className={s.form__logo}>React-Chat</h1>
        <h1 className={s.form__title}>Log in</h1>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />

          <button type="submit">Sign in</button>
        </form>
        <p>
          You don't have an account?{" "}
          <Link to={AppRoutes.Register}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
