<script setup>
import { ref, reactive, computed, inject } from "vue";
import { useRouter } from "vue-router";
import { useTemplateStore } from "@/stores/template";
import { userDataStore } from "@/stores/user";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import toast from "@/components/ToastBlock.vue";
const $axios = inject("$axios");
const BlockContent = ref(null);

// Main store and Router
const store = useTemplateStore();
const userStore = userDataStore();
const router = useRouter();

// Input state variables
const state = reactive({
    name: null,
    password: null,
});
// Validation rules
const rules = computed(() => {
    return {
        name: {
            required,
            minLength: minLength(3),
        },
        password: {
            required,
            minLength: minLength(5),
        },
    };
});

// Use vuelidate
const v$ = useVuelidate(rules, state);

const login = async () => {
    BlockContent.value.statusLoading();

    const result = await v$.value.$validate();
    if (!result) {
        BlockContent.value.statusNormal();
        return;
    }
    await $axios
        .post("/login_admin", {
            name: state.name,
            password: state.password,
        })
        .then(async (response) => {
            userStore.user = response.data.data.name;
            userStore.token = response.data.data.api_token;
            router.push({ name: "backend-dashboard" });
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
        .finally(() => {
            BlockContent.value.statusNormal();
            return;
        });
};
function onSubmit() {
    login();
}
</script>

<template>
    <!-- Page Content -->
    <div class="hero-static d-flex align-items-center">
        <div class="content">
            <div class="row justify-content-center push">
                <div class="col-md-8 col-lg-6 col-xl-4">
                    <!-- Sign In Block -->
                    <BaseBlock
                        ref="BlockContent"
                        title="Sign In"
                        class="block-mode-loading-hourglass mb-0"
                    >
                        <div class="p-sm-3 px-lg-4 px-xxl-5 py-lg-5">
                            <h1 class="h2 mb-1">Admin Login</h1>
                            <div>
                                <span class="text-primary">{{
                                    state.environment
                                }}</span>
                            </div>
                            <p class="fw-medium text-muted">
                                Enter your Credentials
                            </p>

                            <!-- Sign In Form -->
                            <form @submit.prevent="onSubmit">
                                <div class="py-3">
                                    <div class="mb-4">
                                        <input
                                            type="text"
                                            class="form-control form-control-alt form-control-lg"
                                            id="login-username"
                                            name="login-username"
                                            placeholder="name"
                                            :class="{
                                                'is-invalid':
                                                    v$.name.$errors.length,
                                            }"
                                            v-model="state.name"
                                            @blur="v$.name.$touch"
                                        />
                                        <div
                                            v-if="v$.name.$errors.length"
                                            class="invalid-feedback animated fadeIn"
                                        >
                                            Please enter your phone
                                        </div>
                                    </div>
                                    <div class="mb-4">
                                        <input
                                            type="password"
                                            class="form-control form-control-alt form-control-lg"
                                            id="login-password"
                                            name="login-password"
                                            placeholder="Password"
                                            :class="{
                                                'is-invalid':
                                                    v$.password.$errors.length,
                                            }"
                                            v-model="state.password"
                                            @blur="v$.password.$touch"
                                            autocomplete="on"
                                        />
                                        <div
                                            v-if="v$.password.$errors.length"
                                            class="invalid-feedback animated fadeIn"
                                        >
                                            Please enter your password
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-md-6 col-xl-5">
                                        <button
                                            type="submit"
                                            class="btn w-100 btn-alt-primary"
                                        >
                                            <i
                                                class="fa fa-fw fa-sign-in-alt me-1 opacity-50"
                                            ></i>
                                            Sign In
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <!-- END Sign In Form -->
                        </div>
                    </BaseBlock>
                    <!-- END Sign In Block -->
                </div>
            </div>
            <div class="fs-sm text-muted text-center">
                <strong>{{ store.app.name + " " + store.app.version }}</strong>
                &copy;
                {{ store.app.copyright }}
            </div>
        </div>
    </div>
    <!-- END Page Content -->
</template>
