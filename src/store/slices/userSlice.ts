import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
};

type Userkeys = {
  [key in keyof User]?: User[key];
};

const initialState: User & { isAuth: boolean; loading: boolean } = {
  uid: "",
  isAuth: false,
  displayName: "",
  email: "",
  loading: true,
};
const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      if (action.payload.photoURL) state.photoURL = action.payload.photoURL;
      state.displayName = action.payload.displayName;
      state.email = action.payload.email;
      state.isAuth = true;
      state.uid = action.payload.uid;
      state.loading = false;
    },
    editUser: (state, action: PayloadAction<Userkeys>) => {
      for (const key in action.payload) {
        if (Object.prototype.hasOwnProperty.call(action.payload, key)) {
          const value = action.payload[key as keyof Userkeys];
          if (value !== undefined) {
            state[key as keyof User] = value;
          }
        }
      }
    },
    removeUser: (state) => {
      state.displayName = "";
      state.email = "";
      state.photoURL = "";
      state.isAuth = false;
      state.loading = false;
    },
  },
});

export const { removeUser, addUser, editUser } = userSlice.actions;

export default userSlice.reducer;
