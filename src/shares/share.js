import { userDataStore } from "@/stores/user";
const userStore = userDataStore();
const headers = () => {
    return {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: userStore.token ? `Bearer ${userStore.token}` : "none",
    };
};
export { headers };
