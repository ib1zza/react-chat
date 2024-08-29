import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { updateUserEmail } from "src/API/Createuser";
import s from "components/Sidebar/Sidebar.module.scss";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FirebaseError } from "src/types";
import { useAppDispatch } from "src/store/hooks";
import { editUser } from "src/store/slices/userSlice/userSlice";
interface Props {
  prevEmail: string;
  isPopupOpen: boolean;
}

function EmailUpdater({ prevEmail, isPopupOpen }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      email: prevEmail,
      password: "",
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);

  const handleUpdateEmail: SubmitHandler<{
    email: string;
    password: string;
  }> = ({ email, password }) => {
    if (email === prevEmail || !password) {
      setOpened(false);
      return;
    }
    updateUserEmail(email, password)
      .then(() => {
        dispatch(editUser({ email }));
        setOpened(false);
      })
      .catch((e: FirebaseError) => {
        setError("root", {
          type: "server",
        });
      });
  };

  useEffect(() => {
    if (!isPopupOpen) {
      reset({ email: prevEmail });
      setOpened(false);
    }
  }, [isPopupOpen]);

  function handleReset() {
    reset({ email: prevEmail });
    setOpened(false);
  }

  return (
    <form
      className={s.profile__email}
      onSubmit={handleSubmit(handleUpdateEmail)}
    >
      <p className={s.title}>{opened ? t("editingEmail") : t("editEmail")}</p>
      {opened ? (
        <>
          <div className={s.profile__email__input}>
            <input
              autoFocus
              type="email"
              placeholder={"Email"}
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i,
              })}
            />
            {errors.email && (
              <p className={s.error__message}>{t("incorrect email")}</p>
            )}
          </div>

          <p className={s.title}>{t("editingEmailNeedPassword")}</p>
          <div className={s.profile__password__input}>
            <input
              type="password"
              placeholder={t("password") as string}
              {...register("password", {
                minLength: 6,
                required: true,
              })}
            />
            {errors.password && (
              <p className={s.error__message}>{t("incorrect password")}</p>
            )}
          </div>

          <div className={s.buttons}>
            <button type={"submit"} className={clsx(s.button, s.button__save)}>
              <span>{t("save")}</span>
            </button>
            <button
              className={clsx(s.button, s.button__save)}
              onClick={handleReset}
            >
              <span>{t("cancel")}</span>
            </button>
          </div>
        </>
      ) : (
        <div className={s.profile__email__heading}>
          <h2>{prevEmail}</h2>
          <button
            className={s.button}
            onClick={() => setOpened((prevState) => !prevState)}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </div>
      )}
    </form>
  );
}

export default EmailUpdater;
