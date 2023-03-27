import React from "react";
import { useAuth } from "src/context/AuthContext";

interface ChatContext {
  dispatch: React.Dispatch<{ type: string; payload: IUserInfo }>;
  data: { chatId: string; user: IUserInfo | null } | null;
}

const ChatContext = React.createContext<ChatContext>({
  dispatch: () => {},
  data: null,
});

interface Props {
  children: React.ReactNode;
}

export const useChat = () => {
  return React.useContext(ChatContext);
};

interface IUserInfo {
  displayName: string | null;
  photoURL: string | null;
  uid: string;
  lastMessage?: {
    text?: string;
  };
}

export const ChatProvider: React.FC<Props> = ({ children }) => {
  const { user: currentUser } = useAuth();
  const initialState: { chatId: string; user: IUserInfo | null } = {
    chatId: "null",
    user: null,
  };

  const chatReducer = (
    state = initialState,
    action: { type: string; payload: IUserInfo }
  ) => {
    if (!currentUser?.uid) return state;
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = React.useReducer(chatReducer, initialState);
  console.log(state);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
