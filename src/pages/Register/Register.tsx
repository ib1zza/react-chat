import React, { useEffect, useState } from "react";
import s from "./Register.module.scss";
import Add from "../../assets/img/addAvatar.png";
import { Link, useNavigate } from "react-router-dom";
import { AppRoute } from "src/types/routes";
import { createUserEmailPass, loginByGoogle } from "src/API/Createuser";
import { useTranslation } from "react-i18next";
import { langs } from "src/i18n";
import i18n from "i18next";
import { SubmitHandler, useForm } from "react-hook-form";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import { FirebaseError } from "src/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import clsx from "clsx";

interface RegisterValues {
  displayName: string;
  email: string;
  password: string;
  file: File;
}

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [preview, setPreview] = useState("");

  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
    getFieldState,
    setValue,
  } = useForm<RegisterValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      displayName: "asd",
      email: "hellotestagain@gmail.com",
      password: "123456",
    },
  });

  const handleSubmit1: SubmitHandler<RegisterValues> = async (data) => {
    const displayName = data.displayName.toLowerCase().trim();
    const email = data.email;
    const password = data.password;
    const file = !!preview && data.file;

    await createUserEmailPass(email, password, displayName, file)
      .then(() => navigate(AppRoute.Home, { replace: true }))
      .catch((e: FirebaseError) => {
        setError("root", {
          type: "server",
        });
      });
  };

  const checkUsername = (username: string) => {
    return /^[a-z0-9]+$/.test(username) && username.length >= 3;
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

  const handleUploadedFile = (event: any) => {
    const file = event.target.files[0];
    setValue("file", file);
    const urlImage = URL.createObjectURL(file);

    setPreview(urlImage);
  };

  console.log(getValues("file"));
  return (
    <div className={s.form__container}>
      <div className={s.form__wrapper}>
        <div className={s.form__titleContainer}>
          <h1 className={s.form__logo}>React-Chat</h1>
          <h1 className={s.form__title}>{t("register")}</h1>
        </div>
        <form className={s.form} onSubmit={handleSubmit(handleSubmit1)}>
          <div className={s.nicknameInputContainer}>
            <span>@</span>
            <input
              type="text"
              placeholder={t("nickname") as string}
              {...register("displayName", {
                required: true,
                minLength: 3,
                maxLength: 15,
                validate: checkUsername,
              })}
            />
          </div>
          {errors.displayName && (
            <p className={s.error__message}>{t("incorrect nickname")}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          />
          {errors.email && (
            <p className={s.error__message}>{t("incorrect email")}</p>
          )}
          <input
            type="password"
            placeholder={t("password") as string}
            {...register("password", { required: true, minLength: 6 })}
          />
          {errors.password && (
            <p className={s.error__message}>{t("incorrect password")}</p>
          )}

          <label htmlFor="file" className={s.fileLabel}>
            <img
              src={preview || Add}
              alt=""
              className={clsx("", [preview && s.userImage])}
            />
            <span>{preview ? t("changeAvatar") : t("addAvatar")}</span>
            <input
              type="file"
              className={s.file}
              id="file"
              {...register("file")}
              onChange={handleUploadedFile}
            />
          </label>
          <button className={s.submit} disabled={!isValid} type="submit">
            {t("signUp")}
          </button>
          {errors.root && (
            <p className={s.error__message}>{t("server error")}</p>
          )}
        </form>
        <button className={s.googleLogin} onClick={handleGoogle}>
          <span>{t("sign up google")}</span> <FontAwesomeIcon icon={faGoogle} />
        </button>
        <p className={s.noAcc}>
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
