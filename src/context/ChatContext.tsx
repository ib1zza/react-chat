import React, { useReducer } from "react";
import { useAuth } from "src/context/AuthContext";
import { useParams } from "react-router-dom";
export enum ChatAction {
  CHANGE_USER = "CHANGE_USER",
  EXIT_CHAT = "EXIT_CHAT",
}
interface ChatContext {
  dispatch: React.Dispatch<{ type: ChatAction; payload?: IUserInfo }>;
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

export interface IUserInfo {
  displayName: string | null;
  photoURL: string | null;
  uid: string;
  lastMessage?: {
    text?: string;
  };
}

export const ChatProvider: React.FC<Props> = ({ children }) => {
  const { user: currentUser, userInfo, loading } = useAuth();
  const { chatId } = useParams();
  const initialState: { chatId: string; user: IUserInfo | null } = {
    chatId: "null",
    user: null,
  };

  const chatReducer = (
    state = initialState,
    action: { type: ChatAction; payload?: IUserInfo }
  ) => {
    console.log("dispatcher gets info", action.payload);
    if (!currentUser?.uid) return state;
    switch (action.type) {
      case ChatAction.CHANGE_USER:
        if (!action.payload) return state;
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };
      case ChatAction.EXIT_CHAT:
        return {
          user: null,
          chatId: "null",
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, initialState);
  console.log(state);
  console.log("chatProvider changed", state);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
