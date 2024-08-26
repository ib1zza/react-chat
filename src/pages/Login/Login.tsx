import React from "react";
import s from "../Register/Register.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { AppRoute } from "src/types/routes";
import { useAuth } from "src/context/AuthContext";
import { loginByEmailPass, loginByGoogle } from "src/API/Createuser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";
import { langs } from "src/i18n";
import i18n from "i18next";
const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = React.useState(false);
  const { user } = useAuth();
  if (user) {
    console.log("navigate");
    navigate(AppRoute.Home, { replace: false });
  }
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // @ts-ignore
    const email = e.target[0].value;
    // @ts-ignore
    const password = e.target[1].value;
    setError(false);

    try {
      await loginByEmailPass(email, password).then(() =>
        navigate(AppRoute.Home, { replace: false }),
      );
    } catch (error) {
      setError(true);
    }
  };

  const handleGoogle = async () => {
    setError(false);

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
        <div className={s.form__titleContainer}>
          <h1 className={s.form__logo}>React-Chat</h1>
          <h1 className={s.form__title}>{t("log in")}</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" required />
          <input
            type="password"
            placeholder={t("password") as string}
            required
          />
          {error && <p className={s.error__message}>Wrong email or password</p>}

          <button type="submit">{t("sign in")}</button>
        </form>
        <button className={s.googleLogin} onClick={handleGoogle}>
          <span>{t("sign in google")}</span> <FontAwesomeIcon icon={faGoogle} />
        </button>
        <p>
          {t("dont have an acc?")}{" "}
          <Link to={AppRoute.Register}>{t("register")}</Link>
        </p>
        <div className={s.changeLanguage}>
          {langs.map((lang) => (
            <button
              key={lang}
              className={
                s.lang + " " + (i18n.resolvedLanguage == lang ? s.active : "")
              }
              onClick={() => i18n.changeLanguage(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
