import React from "react";
import s from "../Register/Register.module.scss";

import { Link, useNavigate } from "react-router-dom";

import { auth } from "src/firebase";

import { AppRoutes } from "src/AppRoutes";

import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { updateDocument } from "src/utils/updateDoc";

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
      await signInWithEmailAndPassword(auth, email, password).then((value) => {
        console.log(value);
        console.log(value.user.displayName);
        // TODO: remove after all users will be lowercase
        if (!value.user.displayName) return;
        if (value.user.displayName !== value.user.displayName.toLowerCase()) {
          console.log("updating doc");
          updateDocument("users", value.user.uid, {
            displayName: value.user.displayName.toLowerCase(),
          });
          updateProfile(value.user, {
            displayName: value.user.displayName.toLowerCase(),
          });
        }
      });
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
          <input type="email" placeholder="email" required />
          <input type="password" placeholder="password" required />

          <button type="submit">Sign in</button>
          {error && <p className={s.error__message}>Wrong email or password</p>}
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
