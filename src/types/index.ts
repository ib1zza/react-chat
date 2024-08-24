export interface IUserInfo {
  displayName: string | null;
  photoURL: string | null;
  uid: string;
  lastMessage?: {
    text?: string;
  };
}
