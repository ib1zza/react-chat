import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

interface DisplayUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

type Userkeys = {
  [key in keyof DisplayUser]?: DisplayUser[key];
};

interface IState {
  displayUser: DisplayUser & { isAuth: boolean; loading: boolean };
  authUser: User | null;
}

const initialState: IState = {
  displayUser: {
    uid: "",
    isAuth: false,
    displayName: "",
    email: "",
    loading: true,
  },
  authUser: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    authUser: (state, action: PayloadAction<User>) => {
      state.authUser = action.payload;
    },
    unAuthUser: (state) => {
      state.authUser = null;
    },
    addUser: (state, action: PayloadAction<DisplayUser>) => {
      if (action.payload.photoURL)
        state.displayUser.photoURL = action.payload.photoURL;
      state.displayUser.displayName = action.payload.displayName;
      state.displayUser.email = action.payload.email;
      state.displayUser.isAuth = true;
      state.displayUser.uid = action.payload.uid;
      state.displayUser.loading = false;
    },
    editUser: (state, action: PayloadAction<Userkeys>) => {
      for (const key in action.payload) {
        if (Object.prototype.hasOwnProperty.call(action.payload, key)) {
          const value = action.payload[key as keyof Userkeys];
          if (value !== undefined) {
            state.displayUser[key as keyof DisplayUser] = value;
          }
        }
      }
    },
    removeUser: (state) => {
      state.displayUser.displayName = "";
      state.displayUser.email = "";
      state.displayUser.photoURL = "";
      state.displayUser.isAuth = false;
      state.displayUser.loading = false;
    },
  },
});

export const { removeUser, addUser, editUser, unAuthUser, authUser } =
  userSlice.actions;

export default userSlice.reducer;
