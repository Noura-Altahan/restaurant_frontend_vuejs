import { createApp } from "vue";
import axios from "axios";
import { createPinia } from "pinia";
import App from "./App.vue";

// You can use the following starter router instead of the default one as a clean starting point
//  import router from "./router/starter";
import router from "./router";

// Template components
import BaseBlock from "@/components/BaseBlock.vue";
import BaseBackground from "@/components/BaseBackground.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";

// Template directives
import clickRipple from "@/directives/clickRipple";

// Bootstrap framework
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

// axios config
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// Request interceptor
axios.interceptors.request.use((config) => {
    // Modify the request config here
    config.baseURL = import.meta.env.VITE_API_URL;
    //console.log("axios.interceptors.request.use");
    return config;
});

// Response interceptor
axios.interceptors.response.use(
    (response) => {
        // Handle the response here
        // console.log("axios.interceptors.response.use");
        return response;
    },
    (error) => {
        // if there is csrf token mismatch error 419 , 401
        if (error.response.status === 419 || error.response.status === 401) {
            // if csrf token mismatch error 419 , 401
            // redirect to login page
            router.push({ name: "auth-signin" });
        }
        // Handle errors here
        console.error(error);
        return Promise.reject(error);
    }
);

// Create application
const app = createApp(App);
app.provide("$axios", axios);

// Register global components
app.component("BaseBlock", BaseBlock);
app.component("BaseBackground", BaseBackground);
app.component("BasePageHeading", BasePageHeading);

// Register global directives
app.directive("click-ripple", clickRipple);

// Use Pinia and Vue Router
app.use(createPinia());
app.use(router);

// ..and finally mount it!
app.mount("#app");
