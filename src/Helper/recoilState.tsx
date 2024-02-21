import { atom, selector } from "recoil";

export const userNameGlobal = atom({
  key: "userNameGlobal",
  default: {
    loggedInUser: "",
    chats: "",
    userName: "",
  },
});

export const privateUser = atom({
  key: "privateUser",
  default: {
    selectedId: "",
    selectedName: "",
  },
});
