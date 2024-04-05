<script setup>
import { ref, reactive, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { logout } from "@/shares/logout";
import { useTemplateStore } from "@/stores/template";
import { userDataStore } from "@/stores/user";
import toast from "@/components/ToastBlock.vue";
const $axios = inject("$axios");
// Main store and Router
const store = useTemplateStore();
const userStore = userDataStore();
const router = useRouter();
// Reactive variables

const loggedUserName = ref(userStore.user.name);

const logoutAdmin = () => {
    logout();
    router.push({ name: "auth-signin" });
};
const notifications = reactive({
    list: [],
    count: null,
});
const getNotifications = async () => {
    await $axios
        .post(
            import.meta.env.VITE_API_URL + "",
            {},
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: userStore.token
                        ? `Bearer ${userStore.token}`
                        : "none",
                },
            }
        )
        .then(async (response) => {
            notifications.list = response.data.data.notifications;
            notifications.count = response.data.data.count;
        })
        .catch((error) => {
            return toast.fire(
                "Oops...",
                error.response.data.message ?? "Something went wrong!",
                "error"
            );
        })
        .finally(() => {});
};

onMounted(() => {
    // getNotifications();
});
</script>

<template>
    <!-- Header -->
    <header id="page-header">
        <slot>
            <!-- Header Content -->
            <div class="content-header">
                <slot name="content">
                    <!-- Left Section -->
                    <div class="d-flex align-items-center">
                        <slot name="content-left">
                            <!-- Toggle Sidebar -->
                            <button
                                type="button"
                                class="btn btn-sm btn-alt-secondary me-2 d-lg-none"
                                @click="store.sidebar({ mode: 'toggle' })"
                            >
                                <i class="fa fa-fw fa-bars"></i>
                            </button>
                            <!-- END Toggle Sidebar -->

                            <!-- Toggle Mini Sidebar -->
                            <button
                                type="button"
                                class="btn btn-sm btn-alt-secondary me-2 d-none d-lg-inline-block"
                                @click="store.sidebarMini({ mode: 'toggle' })"
                            >
                                <i class="fa fa-fw fa-ellipsis-v"></i>
                            </button>
                            <!-- END Toggle Mini Sidebar -->
                        </slot>
                    </div>
                    <!-- END Left Section -->

                    <!-- Right Section -->
                    <div class="d-flex align-items-center">
                        <slot name="content-right">
                            <!--   Dropdown  Notification -->
                            <div class="dropdown d-inline-block ms-2">
                                <button
                                    type="button"
                                    class="btn btn-sm btn-alt-secondary"
                                    id="page-header-notifications-dropdown"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <i class="fa fa-fw fa-bell"></i>
                                    <span class="text-primary">{{
                                        notifications.count
                                    }}</span>
                                </button>
                                <div
                                    div
                                    class="dropdown-menu dropdown-menu-lg p-0 border-0 fs-sm"
                                    style="max-height: 200px; overflow-y: auto"
                                    aria-labelledby="page-header-notifications-dropdown"
                                >
                                    <div
                                        class="p-2 bg-body-light border-bottom text-center rounded-top"
                                    >
                                        <h5
                                            class="dropdown-header text-uppercase"
                                        >
                                            Notifications
                                        </h5>
                                        <ul class="nav-items mb-0">
                                            <li
                                                v-for="(
                                                    notification, index
                                                ) in notifications.list"
                                                :key="`notification-${index}`"
                                            >
                                                <div class="flex-grow-1 pe-2">
                                                    <div
                                                        class="fw-semibold"
                                                    ></div>
                                                    <span
                                                        class="text-primary"
                                                        >{{
                                                            index + 1 + "-"
                                                        }}</span
                                                    >
                                                    Corporation
                                                    <span class="text-primary">
                                                        {{
                                                            notification
                                                                .get_user.name
                                                        }}</span
                                                    >

                                                    <span>
                                                        created reload request
                                                        USD
                                                    </span>
                                                    <span class="text-primary">
                                                        {{
                                                            notification
                                                                .get_transaction
                                                                .reload_amount
                                                        }}
                                                        .</span
                                                    >
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!-- END Notifications Dropdown -->
                            <!-- User Dropdown -->
                            <div class="dropdown d-inline-block ms-2">
                                <button
                                    type="button"
                                    class="btn btn-sm btn-alt-secondary d-flex align-items-center"
                                    id="page-header-user-dropdown"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <img
                                        class="rounded-circle"
                                        src="/assets/media/avatars/avatar10.jpg"
                                        alt="Header Avatar"
                                        style="width: 21px"
                                    />
                                    <span
                                        class="d-none d-sm-inline-block ms-2"
                                        >{{ loggedUserName }}</span
                                    >
                                    <i
                                        class="fa fa-fw fa-angle-down d-none d-sm-inline-block opacity-50 ms-1 mt-1"
                                    ></i>
                                </button>
                                <div
                                    class="dropdown-menu dropdown-menu-md dropdown-menu-end p-0 border-0"
                                    aria-labelledby="page-header-user-dropdown"
                                >
                                    <div
                                        class="p-3 text-center bg-body-light border-bottom rounded-top"
                                    >
                                        <img
                                            class="img-avatar img-avatar48 img-avatar-thumb"
                                            src="/assets/media/avatars/avatar10.jpg"
                                            alt="Header Avatar"
                                        />
                                        <p class="mt-2 mb-0 fw-medium">
                                            {{ loggedUserName }}
                                        </p>
                                        <hr />
                                        <div>
                                            <RouterLink
                                                :to="{
                                                    name: 'change-password',
                                                }"
                                                class="dropdown-item d-flex align-items-center justify-content-between"
                                            >
                                                <span class="fs-sm fw-medium"
                                                    >Change Password</span
                                                >
                                            </RouterLink>
                                        </div>
                                    </div>

                                    <div class="p-2">
                                        <RouterLink
                                            :to="{ name: 'auth-signin' }"
                                            v-on:click="logoutAdmin()"
                                            class="dropdown-item d-flex align-items-center justify-content-between"
                                        >
                                            <span class="fs-sm fw-medium"
                                                >Log Out</span
                                            >
                                        </RouterLink>
                                    </div>
                                </div>
                            </div>
                            <!-- END User Dropdown -->
                        </slot>
                    </div>
                    <!-- END Right Section -->
                </slot>
            </div>
            <!-- END Header Content -->

            <!-- Header Loader -->
            <div
                id="page-header-loader"
                class="overlay-header bg-body-extra-light"
                :class="{ show: store.settings.headerLoader }"
            >
                <div class="content-header">
                    <div class="w-100 text-center">
                        <i class="fa fa-fw fa-circle-notch fa-spin"></i>
                    </div>
                </div>
            </div>
            <!-- END Header Loader -->
        </slot>
    </header>
    <!-- END Header -->
</template>
