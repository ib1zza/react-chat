import React, { useEffect } from "react";
import s from "../Register/Register.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { AppRoute } from "src/types/routes";
import { loginByEmailPass, loginByGoogle } from "src/API/Createuser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";
import { langs } from "src/i18n";
import i18n from "i18next";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FirebaseError } from "src/types";
import { useAppSelector } from "src/store/hooks";
import { getUserData } from "src/store/slices/userSlice/userSlice";

interface LoginValues {
  email: string;
  password: string;
}

const Login = () => {
  const { displayUser } = useAppSelector(getUserData);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm<LoginValues>({
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const handleLoginByEmail: SubmitHandler<LoginValues> = async (data) => {
    const email = data.email;
    const password = data.password;
    clearErrors();

    await loginByEmailPass(email, password)
      .then(() => navigate(AppRoute.Home, { replace: false }))
      .catch((e: FirebaseError) => {
        switch (e.code) {
          case "auth/wrong-password":
            setError("root", {
              type: "server",
              message: "incorrect password",
            });
            break;

          case "auth/user-not-found":
            setError("root", {
              type: "server",
              message: "user not register",
            });
            break;

          case "auth/network-request-failed":
            setError("root", {
              type: "server",
              message: "nework error",
            });
            break;
        }
      });
  };

  const handleGoogle = async () => {
    await loginByGoogle()
      .then(() => navigate(AppRoute.Home, { replace: false }))
      .catch((e) => {
        setError("root", {
          type: "server",
          message: "google auth failed",
        });
      });
  };

  return (
    <div className={s.form__container}>
      <div className={s.form__wrapper}>
        <div className={s.form__titleContainer}>
          <h1 className={s.form__logo}>React-Chat</h1>
          <h1 className={s.form__title}>{t("log in")}</h1>
        </div>
        <form className={s.form} onSubmit={handleSubmit(handleLoginByEmail)}>
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: true,
              pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            })}
          />
          {errors.email && (
            <p className={s.error__message}>{t("incorrect email")}</p>
          )}
          <input
            type="password"
            placeholder={t("password") as string}
            {...register("password", {
              required: true,
              minLength: 6,
            })}
          />
          {errors.password && (
            <p className={s.error__message}>{t("incorrect password")}</p>
          )}

          <button className={s.submit} type="submit" disabled={!isValid}>
            {t("sign in")}
          </button>

          {errors.root && (
            <p className={s.error__message}>{t("server error")}</p>
          )}
        </form>
        <button className={s.googleLogin} onClick={handleGoogle}>
          <span>{t("sign in google")}</span> <FontAwesomeIcon icon={faGoogle} />
        </button>
        <p className={s.noAcc}>
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
