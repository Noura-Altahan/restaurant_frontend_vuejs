<script setup>
import { reactive, computed, inject, ref } from "vue";
import { headers } from "@/shares/share";
import useVuelidate from "@vuelidate/core";
import { useRouter } from "vue-router";
import { required, minLength, maxLength, sameAs } from "@vuelidate/validators";
import toast from "../../components/ToastBlock.vue";
 
const $axios = inject("$axios");
const router = useRouter();
const BlockChangePassword = ref(null);

const state = reactive({
    password: null,
    password_confirmation: null,
});

// Validation rules
const rules = computed(() => {
    return {
        password: {
            required,
            minLength: minLength(8),
            maxLength: maxLength(90),
        },
        password_confirmation: {
            required,
            sameAs: sameAs(state.password),
        },
    };
});

// Use vuelidate
const v$ = useVuelidate(rules, state);
const changePassword = async () => {
    BlockChangePassword.value.statusLoading();
    const result = await v$.value.$validate();

    if (!result) {
        BlockChangePassword.value.statusNormal();
        return;
    }

    await $axios
        .post(
            "/update_admin_password",
            {
                device_type: "DESKTOP",
                password: state.password,
                password_confirmation: state.password_confirmation,
            },
            {
                headers: headers(),
            }
        )
        .then(() => {
            toast
                .fire("Success", "Password Changed successfully", "success")
                .then(  () => {
                  
                    router.push({ name: "auth-signin" });
                });
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
            BlockChangePassword.value.statusNormal();
        });
};
// On form submission
async function onSubmit() {
    changePassword();
}
</script>

<template>
    <div class="content">
        <BaseBlock
            content-full
            ref="BlockChangePassword"
            title="Change Password"
            transparent
            class="mb-0"
        >
            <form @submit.prevent="onSubmit">
                <BaseBlock content-full>
                    <div class="row items-push">
                        <div class="col-12">
                            <div class="mb-4">
                                <label class="form-label" for="password"
                                    >Password
                                    <span class="text-danger">*</span></label
                                >
                                <input
                                    type="password"
                                    id="password"
                                    class="form-control"
                                    :class="{
                                        'is-invalid':
                                            v$.password.$errors.length,
                                    }"
                                    v-model="state.password"
                                    @blur="v$.password.$touch"
                                    placeholder="Enter a password.."
                                />
                                <div
                                    v-if="v$.password.$errors.length"
                                    class="invalid-feedback animated fadeIn"
                                >
                                    Please enter a password.
                                </div>
                            </div>

                            <div class="mb-4">
                                <label
                                    class="form-label"
                                    for="password_confirmation "
                                    >Confirm Password
                                    <span class="text-danger">*</span></label
                                >
                                <input
                                    type="password"
                                    id="password_confirmation "
                                    class="form-control"
                                    :class="{
                                        'is-invalid':
                                            v$.password_confirmation.$errors
                                                .length,
                                    }"
                                    v-model="state.password_confirmation"
                                    @blur="v$.password_confirmation.$touch;"
                                    placeholder="Confirm Password.."
                                />
                                <div
                                    v-if="
                                        v$.password_confirmation.$errors.length
                                    "
                                    class="invalid-feedback animated fadeIn"
                                >
                                    Please confirm password.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row items-push">
                        <div class="col-lg-7 offset-lg-4">
                            <button type="submit" class="btn btn-alt-primary">
                                Submit
                            </button>
                        </div>
                    </div>
                </BaseBlock>
            </form>
        </BaseBlock>
    </div>
</template>
