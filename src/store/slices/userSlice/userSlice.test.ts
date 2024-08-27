import userSlice, {
  removeUser,
  addUser,
  editUser,
  getUserData,
  getDisplayUser,
  initialState,
  DisplayUser,
  IUserSchema,
} from "./userSlice";
import { User } from "firebase/auth";
import { RootState } from "../../store";

describe("userSlice tests", () => {
  const testUser: DisplayUser = {
    uid: "test",
    email: "test",
    displayName: "test",
    photoURL: "test",
  };

  it("addUser without photo ", () => {
    const expected = { ...testUser, isAuth: true, loading: false };
    const state = userSlice(initialState, addUser(testUser));
    expect(state.displayUser).toEqual(expected);
  });

  it("addUser with photo ", () => {
    const expected = { ...testUser, isAuth: true, loading: false };
    const state = userSlice(initialState, addUser(testUser));
    console.log(state);
    expect(state.displayUser).toEqual(expected);
  });

  it("removeUser", () => {
    const init: IUserSchema = {
      ...initialState,
      displayUser: { ...testUser, isAuth: true, loading: false },
    };
    const state = userSlice(init, removeUser());
    console.log(state);
    expect(state.displayUser).toEqual({
      ...initialState.displayUser,
      loading: false,
    });
  });

  it("editUser", () => {
    const state = userSlice(initialState, editUser({ displayName: "test2" }));
    expect(state.displayUser).toEqual({
      ...initialState.displayUser,
      displayName: "test2",
    });
  });

  describe("selectors", () => {
    it("getUserData", () => {
      const state = {
        user: initialState,
      };

      expect(getUserData(state)).toEqual(initialState);
    });

    it("getDisplayUser", () => {
      const state = {
        user: initialState,
      };

      expect(getDisplayUser(state)).toEqual(initialState.displayUser);
    });
  });
});
