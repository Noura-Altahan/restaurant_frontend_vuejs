<script setup>
import { onMounted, reactive, ref, inject } from "vue";
import toast from "@/components/ToastBlock.vue";
import { userDataStore } from "@/stores/user";
import { headers } from "@/shares/share";
const $axios = inject("$axios");

const userStore = userDataStore();
const user = ref(userStore.user);

const state = reactive({
    totalUsers: 0,
    totalDriver: 0,
});
const getTotal = async () => {
    await $axios
        .get("", {
            headers: headers(),
        })
        .then((response) => {
            state.totalUsers = response.data.data.totalUsers;
            state.totalDrivers = response.data.data.totalDrivers;
        })
        .catch((error) => {
            if (error.response) {
                return toast.fire(
                    "Oops...",
                    error.response.data.message,
                    "error"
                );
            }
            return toast.fire("Oops...", "Something went wrong!", "error");
        })
        .finally(() => {});
};

onMounted(() => {});
</script>

<template>
    <!-- Hero -->
    <div class="content">
        <div
            class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center py-2 text-center text-md-start"
        >
            <div class="flex-grow-1 mb-1 mb-md-0">
                <h1 class="h3 fw-bold mb-2">Dashboard</h1>
                <h2 class="h6 fw-medium fw-medium text-muted mb-0">
                    Welcome <a href="">{{ user.name }}</a> , everything looks
                    great.
                </h2>
            </div>
        </div>
    </div>

    <!-- END Hero -->
    <!-- Page Content -->
    <div class="content">
        <!-- Overview -->
        <div class="row items-push">
            <div class="col-sm-4 col-xxl-3">
                <!-- Pending Orders -->
                <BaseBlock class="d-flex flex-column h-100 mb-0">
                    <template #content>
                        <div
                            class="block-content block-content-full flex-grow-1 d-flex justify-content-between align-items-center"
                        >
                            <dl class="mb-0">
                                <dt class="fs-3 fw-bold">
                                    {{ state.totalUsers }}
                                </dt>
                                <dd
                                    class="fs-sm fw-medium fs-sm fw-medium text-muted mb-0"
                                ></dd>
                                Total Categories
                            </dl>
                            <div class="item item-rounded-lg bg-body-light">
                                <i
                                    class="fa fa-chart-bar fs-3 text-primary"
                                ></i>
                            </div>
                        </div>
                    </template>
                </BaseBlock>
                <!-- END Pending Orders -->
            </div>

            <div class="col-sm-4 col-xxl-3">
                <!-- Pending Orders -->
                <BaseBlock class="d-flex flex-column h-100 mb-0">
                    <template #content>
                        <div
                            class="block-content block-content-full flex-grow-1 d-flex justify-content-between align-items-center"
                        >
                            <dl class="mb-0">
                                <dt class="fs-3 fw-bold">
                                    {{ state.totalDrivers }}
                                </dt>
                                <dd
                                    class="fs-sm fw-medium fs-sm fw-medium text-muted mb-0"
                                ></dd>
                                Total Items
                            </dl>
                            <div class="item item-rounded-lg bg-body-light">
                                <i
                                    class="fa fa-chart-bar fs-3 text-primary"
                                ></i>
                            </div>
                        </div>
                    </template>
                </BaseBlock>
                <!-- END Pending Orders -->
            </div>
        </div>
    </div>
</template>
