import { Theme } from "../../context/ThemeContext";

export function changeCssRootVariables(theme: Theme) {
  const root = document.querySelector(":root") as HTMLElement;

  const components = [
    "body-bg",
    "main-bg",
    "darker-bg",
    "chat-bg",
    "chatInfo-bg",
    "accent-color",
    "text-main",
    "message-owner-bg",
    "message-friend-bg",
    "chatInput-bg",
  ];

  components.forEach((component) => {
    root.style.setProperty(
      `--${component}-default`,
      `var(--${component}-${theme})`
    );
  });
}
