import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const langs = ["en", "ru"];
i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          search: "Search",
          you: "You: ",
          input: "Type your message...",
          deleteChat: "Delete chat",
          changeAvatar: "Change avatar",
          logout: "Logout",
          "log in": "Log in",
          password: "Password",
          "sign in": "Sign in",
          "sign in google": "Sign in with Google",
          "dont have an acc?": "Don't have an account?",
          register: "Register",
          nickname: "Nickname",
          addAvatar: "Add avatar",
          signUp: "Sign up",
          "already have an acc?": "Already have an account?",
          language: "Language",
          editName: "Your name",
          "change theme": "Change theme",
        },
      },
      ru: {
        translation: {
          search: "Поиск",
          you: "Вы: ",
          input: "Введите сообщение...",
          deleteChat: "Удалить чат",
          changeAvatar: "Изменить аватар",
          logout: "Выход",
          "log in": "Вход",
          password: "Пароль",
          "sign in": "Войти",
          "sign in google": "Войти через Google",
          "dont have an acc?": "Нет аккаунта?",
          register: "Регистрация",
          nickname: "Имя пользователя",
          addAvatar: "Загрузить аватар",
          signUp: "Зарегистрироваться",
          "already have an acc?": "Уже есть аккаунт?",
          language: "Язык",
          editName: "Ваше имя",
          "change theme": "Изменить тему",
        },
      },
    },
  });

export default i18n;
