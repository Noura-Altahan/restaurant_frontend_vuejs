import axios from "axios";
import { userDataStore } from "@/stores/user";
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const logout = async () => {
    const userStore = userDataStore();
    await axios
        .post(
            "/auth/logout",
            {},
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: userStore.token
                        ? `Token ${userStore.token}`
                        : "none",
                },
            }
        )
        .then(() => {
            userStore.$reset();
        })

        .catch((error) => {
            console.error(error);
        });
};

export { logout };
