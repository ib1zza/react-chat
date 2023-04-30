import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "src/context/AuthContext";
import { ChatProvider } from "src/context/ChatContext";
import { Provider } from "react-redux";
import store from "src/store/store";
import { BrowserRouter } from "react-router-dom";
import ThemeProvider from "src/context/ThemeContext";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </Provider>
);
