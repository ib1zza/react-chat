import React, { useState } from "react";
import s from "./Register.module.scss";
import Add from "../../assets/img/addAvatar.png";
import { auth, db, storage } from "src/firebase";
import { doc, setDoc } from "firebase/firestore";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import { AppRoute } from "src/routes";
import { createUserEmailPass } from "src/utils/Createuser";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    // @ts-ignore
    const displayName = e.target[0].value.toLowerCase();
    // @ts-ignore
    const email = e.target[1].value;
    // @ts-ignore
    const password = e.target[2].value;
    // @ts-ignore
    const file = e.target[3].files[0];

    try {
      await createUserEmailPass(email, password, displayName, file).then(() =>
        navigate(AppRoute.Home)
      );
    } catch (e: any) {
      setError(true);
    }
  };
  return (
    <div className={s.form__container}>
      <div className={s.form__wrapper}>
        <h1 className={s.form__logo}>React-Chat</h1>
        <h1 className={s.form__title}>Register</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="your name" required />
          <input type="email" placeholder="email" required />
          <input type="password" placeholder="password" required />
          <input type="file" className={s.file} id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button type="submit">Sign up</button>
          {error && <p className={s.error__message}>Something went wrong.</p>}
        </form>
        <p>
          You already have an account? <Link to={AppRoute.Login}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
