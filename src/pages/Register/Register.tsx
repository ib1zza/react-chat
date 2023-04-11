import React, { useState } from "react";
import s from "./Register.module.scss";
import Add from "../../assets/img/addAvatar.png";
import { Link, useNavigate } from "react-router-dom";
import { AppRoute } from "src/routes";
import { createUserEmailPass } from "src/utils/Createuser";
import { useTranslation } from "react-i18next";
import { langs } from "src/i18n";
import i18n from "i18next";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // @ts-ignore
    const displayName = e.target[0].value.toLowerCase().trim();
    // @ts-ignore
    const email = e.target[1].value;
    // @ts-ignore
    const password = e.target[2].value;
    // @ts-ignore
    const file = e.target[3].files[0];

    if (!checkUsername(displayName)) {
      setError(true);
      return;
    }

    try {
      await createUserEmailPass(email, password, displayName, file).then(() =>
        navigate(AppRoute.Home)
      );
    } catch (e: any) {
      setError(true);
    }
  };

  const checkUsername = (username: string) => {
    return /^[a-z0-9]+$/.test(username) && username.length >= 3;
  };
  return (
    <div className={s.form__container}>
      <div className={s.form__wrapper}>
        <h1 className={s.form__logo}>React-Chat</h1>
        <h1 className={s.form__title}>{t("register")}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={t("nickname") as string}
            onChange={(e) => checkUsername(e.target.value)}
            required
          />
          <input type="email" placeholder="Email" required />
          <input
            type="password"
            placeholder={t("password") as string}
            required
          />
          <input type="file" className={s.file} id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>{t("addAvatar")}</span>
          </label>
          <button type="submit">{t("signUp")}</button>
          {error && <p className={s.error__message}>Something went wrong.</p>}
        </form>
        <p>
          {t("already have an acc?")}{" "}
          <Link to={AppRoute.Login}>{t("log in")}</Link>
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

export default Register;
