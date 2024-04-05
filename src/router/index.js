/* eslint-disable no-unused-vars */
import { createRouter, createWebHashHistory } from "vue-router";
import { userDataStore } from "@/stores/user";
import NProgress from "nprogress/nprogress.js";

// Main layout variations
import LayoutSimple from "@/layouts/variations/Simple.vue";
import LayoutBackend from "@/layouts/variations/Backend.vue";
import LayoutLanding from "@/layouts/variations/Landing.vue";

// Auth
const AuthSignIn = () => import("@/views/auth/SignInView.vue");
const AuthLock = () => import("@/views/auth/LockView.vue");
const AuthReminder = () => import("@/views/auth/ReminderView.vue");
// change password
const ChangePassword = () => import("@/views/users/ModalUpdateUser.vue");
// Errors
const Error400 = () => import("@/views/errors/400View.vue");
const Error401 = () => import("@/views/errors/401View.vue");
const Error403 = () => import("@/views/errors/403View.vue");
const Error404 = () => import("@/views/errors/404View.vue");
const Error500 = () => import("@/views/errors/500View.vue");
const Error503 = () => import("@/views/errors/503View.vue");

// Categories management
const CategoriesList = () => import("@/views/categories/CategoriesList.vue");
const SubCategoriesList = () =>
    import("@/views/subcategories/SubCategoriesList.vue");
const MenusList = () => import("@/views/menus/MenusList.vue");
const ItemsList = () => import("@/views/items/ItemsList.vue");
const Dashboard = () => import("@/views/backend/DashboardView.vue");

// Set all routes
const routes = [
    /*
  |
  |--------------------------------------------------------------------------
  | Landing Routes
  |--------------------------------------------------------------------------
  | 
  */
    {
        path: "/",
        component: LayoutLanding,
        children: [
            {
                path: "/",
                name: "landing",
                component: AuthSignIn,
            },
        ],
    },
    /*
  |
  |--------------------------------------------------------------------------
  | Dashboard
  |--------------------------------------------------------------------------
  | 
  */
    {
        path: "/dashboard",
        component: LayoutBackend,
        children: [
            {
                path: "dashboard",
                name: "backend-dashboard",
                component: Dashboard,
            },
        ],
    },
    /*
  |
  |--------------------------------------------------------------------------
  | change password
  |--------------------------------------------------------------------------
  |
  */
    {
        path: "/auth",
        component: LayoutBackend,
        children: [
            {
                path: "change-password",
                name: "change-password",
                component: ChangePassword,
            },
        ],
    },

    {
        path: "/categories",
        component: LayoutBackend,
        children: [
            {
                path: "list",
                name: "Categories-list",
                component: CategoriesList,
            },
        ],
    },
    {
        path: "/categories",
        component: LayoutBackend,
        children: [
            {
                path: "list",
                name: "subCategories-list",
                component: SubCategoriesList,
            },
        ],
    },
    {
        path: "/menus",
        component: LayoutBackend,
        children: [
            {
                path: "list",
                name: "Menus-list",
                component: MenusList,
            },
        ],
    },
    {
        path: "/items",
        component: LayoutBackend,
        children: [
            {
                path: "list",
                name: "Items-list",
                component: ItemsList,
            },
        ],
    },
    /*
  |
  |--------------------------------------------------------------------------
  | Auth Routes
  |--------------------------------------------------------------------------
  |
  */
    {
        path: "/auth",
        component: LayoutSimple,
        children: [
            {
                path: "signin",
                name: "auth-signin",
                component: AuthSignIn,
            },

            {
                path: "lock",
                name: "auth-lock",
                component: AuthLock,
            },

            {
                path: "reminder",
                name: "auth-reminder",
                component: AuthReminder,
            },
        ],
    },

    /*
  |
  |--------------------------------------------------------------------------
  | Error Routes
  |--------------------------------------------------------------------------
  |
  */
    {
        path: "/errors",
        component: LayoutSimple,
        children: [
            {
                path: "400",
                name: "error-400",
                component: Error400,
            },
            {
                path: "401",
                name: "error-401",
                component: Error401,
            },
            {
                path: "403",
                name: "error-403",
                component: Error403,
            },
            {
                path: "404",
                name: "error-404",
                component: Error404,
            },
            {
                path: "500",
                name: "error-500",
                component: Error500,
            },
            {
                path: "503",
                name: "error-503",
                component: Error503,
            },
        ],
    },
];

// Create Router
const router = createRouter({
    history: createWebHashHistory(),
    linkActiveClass: "active",
    linkExactActiveClass: "",
    scrollBehavior() {
        return new Promise((resolve) => {
            resolve({ left: 0, top: 0 });
        });
    },
    routes: routes,
});

// redirect to login page if not logged in and trying to access a restricted page
router.beforeEach(async (to) => {
    const publicPages = ["/auth/signin"];
    const authRequired = !publicPages.includes(to.path);
    const userStore = userDataStore();

    if (authRequired && !userStore.token) {
        return "/auth/signin";
    }
});

// NProgress
/*eslint-disable no-unused-vars*/
NProgress.configure({ showSpinner: false });

router.beforeResolve((to, from, next) => {
    if (to.name) {
        NProgress.start();
    }

    next();
});

router.afterEach(() => {
    NProgress.done();
});
/*eslint-enable no-unused-vars*/

export default router;
