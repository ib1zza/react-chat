import React, { useState, createContext, useEffect } from "react";
import { changeCssRootVariables } from "../model/ChangeCSSRootVars";
import { storage } from "../model/storage";

interface IThemeContext {
  theme: string;
  changeTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

export const ThemeContext = createContext<IThemeContext>({
  theme: Theme.LIGHT,
  changeTheme: () => {},
  toggleTheme: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const useTheme = () => {
  return React.useContext(ThemeContext);
};

const ThemeProvider: React.FC<Props> = ({ children, ...props }) => {
  const [theme, setTheme] = useState<Theme>(
    storage.getItem("react-chat/theme") || Theme.LIGHT
  );

  const toggleTheme = () => {
    const propsTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    setTheme(propsTheme);
  };

  const changeTheme = (propsTheme: Theme) => {
    changeCssRootVariables(propsTheme);
    storage.setItem("react-chat/theme", propsTheme);
  };

  useEffect(() => {
    changeTheme(theme);
  }, [theme]);
  return (
    <ThemeContext.Provider
      value={{ theme, changeTheme, toggleTheme }}
      {...props}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
