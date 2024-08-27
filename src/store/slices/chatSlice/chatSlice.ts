import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "src/store/store";
import { IUserInfo } from "src/types";

export interface IChatSchema {
  chatId: string;
  user: IUserInfo | null;
}

export const initialState: IChatSchema = {
  chatId: "null",
  user: null,
};

export const selectChat =
  (user: IUserInfo) => (dispatch: AppDispatch, getState: () => RootState) => {
    const currentUserId = getState().user.displayUser?.uid;
    if (!currentUserId) return;

    dispatch(
      changeUser({
        chatId:
          currentUserId > user.uid
            ? currentUserId + user.uid
            : user.uid + currentUserId,
        user: user,
      }),
    );
  };

const chatSlice = createSlice({
  name: "chat",
  initialState,
  selectors: {
    selectChatId: (state) => state.chatId,
    selectChatUser: (state) => state.user,
    selectChatData: (state) => state,
  },
  reducers: {
    changeUser: (state, action: PayloadAction<IChatSchema>) => {
      state.user = action.payload.user;
      state.chatId = action.payload.chatId;
    },
    exitChat: (state) => {
      state.user = null;
      state.chatId = "null";
    },
  },
});

export const { selectChatId, selectChatUser, selectChatData } =
  chatSlice.selectors;
export const { changeUser, exitChat } = chatSlice.actions;
export default chatSlice.reducer;
