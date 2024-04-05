import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

//  Pinia User Data Store
export const userDataStore = defineStore({
    id: "userData",
    state: () => ({
        //  user details
        user: useStorage("user", []),
        token: useStorage("token", ""),
    }),
});
