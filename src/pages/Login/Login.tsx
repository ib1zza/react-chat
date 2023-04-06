import React from "react";
import s from "../Register/Register.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { AppRoute } from "src/routes";
import { useAuth } from "src/context/AuthContext";
import { loginByEmailPass, loginByGoogle } from "src/utils/Createuser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState(false);
  const { user } = useAuth();
  if (user) {
    navigate(AppRoute.Home, { replace: true });
  }
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // @ts-ignore
    const email = e.target[0].value;
    // @ts-ignore
    const password = e.target[1].value;
    try {
      loginByEmailPass(email, password).then(() =>
        navigate(AppRoute.Home, { replace: false })
      );
    } catch (error) {
      setError(true);
    }
  };

  const handleGoogle = async () => {
    try {
      loginByGoogle().then(() => navigate(AppRoute.Home, { replace: false }));
    } catch (error) {
      setError(true);
      console.log(error);
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
        <button className={s.googleLogin} onClick={handleGoogle}>
          <span>Sign in using Google</span> <FontAwesomeIcon icon={faGoogle} />
        </button>
        <p>
          You don't have an account?{" "}
          <Link to={AppRoute.Register}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
