import { defineStore } from "pinia";

export const useLoggedInUserStore = defineStore({
  id: "loggedInUser",
  state: () => ({
    id: "",
    name: "",
    email: "",
    token: "",
    isAdmin: false,
    lastLogin: "",
  }),
  getters: () => {},
  actions: {
    resetUser() {
      this.id = "";
      this.name = "";
      this.email = "";
      this.token = "";
      this.isAdmin = false;
      this.lastLogin = "";
    },
  },
});
