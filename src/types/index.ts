export interface IUserInfo {
  displayName: string | null;
  photoURL: string | null;
  uid: string;
  lastMessage?: {
    text?: string;
  };
}

export type FirebaseError = {
  code:
    | "auth/wrong-password"
    | "auth/user-not-found"
    | "auth/network-request-failed";
  name: "FirebaseError";
  customData: Record<string, any>;
};
