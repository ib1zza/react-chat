import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice/userSlice";
import chatSlice from "./slices/chatSlice/chatSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    chat: chatSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
