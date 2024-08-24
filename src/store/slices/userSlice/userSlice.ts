import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

export interface DisplayUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

type DisplayUserKeys = Partial<DisplayUser>;

export interface IUserSchema {
  displayUser: DisplayUser & { isAuth: boolean; loading: boolean };
  authUser: User | null;
}

export const initialState: IUserSchema = {
  displayUser: {
    uid: "",
    isAuth: false,
    displayName: "",
    email: "",
    loading: true,
    photoURL: "",
  },
  authUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  selectors: {
    getUserData: (state) => state,
    getDisplayUser: (state) => state.displayUser,
  },
  reducers: {
    authUser: (state, action: PayloadAction<User>) => {
      state.authUser = action.payload;
    },
    unAuthUser: (state) => {
      state.authUser = null;
    },
    addUser: (state, action: PayloadAction<DisplayUser>) => {
      state.displayUser.photoURL = action.payload.photoURL;
      state.displayUser.displayName = action.payload.displayName;
      state.displayUser.email = action.payload.email;
      state.displayUser.isAuth = true;
      state.displayUser.uid = action.payload.uid;
      state.displayUser.loading = false;
    },
    editUser: (state, action: PayloadAction<DisplayUserKeys>) => {
      for (const key in action.payload) {
        if (Object.prototype.hasOwnProperty.call(action.payload, key)) {
          const value = action.payload[key as keyof DisplayUserKeys];
          if (value !== undefined) {
            state.displayUser[key as keyof DisplayUser] = value;
          }
        }
      }
    },
    removeUser: (state) => {
      state.displayUser.uid = "";
      state.displayUser.displayName = "";
      state.displayUser.email = "";
      state.displayUser.photoURL = "";
      state.displayUser.isAuth = false;
      state.displayUser.loading = false;
    },
  },
});

export const { getUserData, getDisplayUser } = userSlice.selectors;

export const { removeUser, addUser, editUser, unAuthUser, authUser } =
  userSlice.actions;

export default userSlice.reducer;
