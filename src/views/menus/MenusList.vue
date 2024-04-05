<script setup>
import { onMounted, reactive, inject, watch, ref, computed } from "vue";
import { headers } from "@/shares/share";
import toast from "@/components/ToastBlock.vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
const $axios = inject("$axios");
const search = ref("");
const BlockCreate = ref(null);
const state = reactive({
    id: null,
    list: [],
    discount: null,
    description: null,
    name: null,
    currentPage: 1,
    totalPage: null,
    lastPage: null,
    from: null,
    to: null,
});
const rules = computed(() => {
    return {
        name: {
            required,
        },
        description: {
            required,
        },
    };
});
watch(
    () => state.currentPage,
    () => getMenusList()
);
const v$ = useVuelidate(rules, state);
const getMenusList = async () => {
    await $axios
        .get("menus_list", {
            params: {},
            headers: headers(),
        })
        .then((response) => {
            state.list = response.data.data;
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
        });
};
async function create() {
    BlockCreate.value.statusLoading();
    const result = await v$.value.$validate();

    if (!result) {
        BlockCreate.value.statusNormal();
        return;
    }
    await $axios
        .post(
            "create_menu",
            {
                name: state.name,
                description: state.description,
            },
            {
                headers: headers(),
            }
        )
        .then((response) => {
            toast.fire("Success", response.data.message, "success");
            getMenusList();
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
            BlockCreate.value.statusNormal();
        });
}
onMounted(() => {
    getMenusList();
});
</script>

<template>
    <div class="content">
        <BaseBlock title="Menus List">
            <template #options>
                <button
                    type="button"
                    class="btn-block-option"
                    @click="getMenusList()"
                ></button>
            </template>

            <div class="table-responsive">
                <table class="table table-bordered table-striped table-vcenter">
                    <thead>
                        <tr>
                            <th class="text-center">#</th>
                            <th>Name</th>
                            <th>description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(request, index) in state.list"
                            :key="request.id"
                        >
                            <td class="text-center">
                                {{ index + 1 }}
                            </td>
                            <td class="fw-semibold fs-sm">
                                {{ request.name }}
                            </td>
                            <td class="fw-semibold fs-sm">
                                {{ request.description }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="block-content block-content-full bg-body-light">
                <div class="d-flex justify-content-between">
                    <div class="p-2 bd-highlight">
                        <span>
                            Showing {{ state.from }} to {{ state.to }} of
                            {{ state.totalPage }} entries
                        </span>
                    </div>
                    <div class="p-2 bd-highlight">
                        <!-- Pagination -->
                        <nav>
                            <ul
                                class="pagination pagination-sm justify-content-end mb-0"
                                style="display: flex; flex-wrap: wrap"
                            >
                                <li class="page-item">
                                    <button
                                        class="page-link"
                                        @click="
                                            state.currentPage > 1
                                                ? (state.currentPage -= 1)
                                                : 1
                                        "
                                        tabindex="-1"
                                        aria-label="Previous"
                                    >
                                        Prev
                                    </button>
                                </li>
                                <li
                                    class="page-item"
                                    :class="{
                                        active: state.currentPage == index,
                                    }"
                                    v-for="index in state.lastPage"
                                    :key="index"
                                >
                                    <button
                                        class="page-link"
                                        @click="state.currentPage = index"
                                    >
                                        {{ index }}
                                    </button>
                                </li>

                                <li class="page-item">
                                    <button
                                        class="page-link"
                                        @click="
                                            state.currentPage < state.lastPage
                                                ? (state.currentPage += 1)
                                                : state.lastPage
                                        "
                                        aria-label="Next"
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                        <!-- END Pagination -->
                    </div>
                </div>
            </div>
        </BaseBlock>
        <div
            class="modal"
            id="modal-create-menu"
            tabindex="-1"
            role="dialog"
            aria-labelledby="modal-create-menu"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <BaseBlock
                        ref="BlockCreate"
                        title="Create menu"
                        transparent
                        class="mb-0"
                    >
                        <template #options>
                            <button
                                type="button"
                                class="btn-block-option"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i class="fa fa-fw fa-times"></i>
                            </button>
                        </template>

                        <template #content>
                            <form @submit.prevent="create">
                                <BaseBlock content-full>
                                    <div class="row items-push">
                                        <div class="col-12">
                                            <div class="mb-4">
                                                <label
                                                    class="form-label"
                                                    for="name"
                                                    >Name
                                                    <span class="text-danger"
                                                        >*</span
                                                    ></label
                                                >
                                                <input
                                                    type="text"
                                                    id="name"
                                                    class="form-control"
                                                    :class="{
                                                        'is-invalid':
                                                            v$.name.$errors
                                                                .length,
                                                    }"
                                                    v-model="state.name"
                                                    @blur="v$.name.$touch"
                                                    placeholder="name"
                                                />
                                                <div
                                                    v-if="
                                                        v$.name.$errors.length
                                                    "
                                                    class="invalid-feedback animated fadeIn"
                                                >
                                                    Please enter name.
                                                </div>
                                            </div>
                                            <div class="mb-4">
                                                <label
                                                    class="form-label"
                                                    for="description"
                                                    >Description
                                                    <span class="text-danger"
                                                        >*</span
                                                    ></label
                                                >
                                                <input
                                                    type="text"
                                                    id="description"
                                                    class="form-control"
                                                    :class="{
                                                        'is-invalid':
                                                            v$.description
                                                                .$errors.length,
                                                    }"
                                                    v-model="state.description"
                                                    @blur="
                                                        v$.description.$touch
                                                    "
                                                    placeholder="Enter a description .."
                                                />
                                                <div
                                                    v-if="
                                                        v$.description.$errors
                                                            .length
                                                    "
                                                    class="invalid-feedback animated fadeIn"
                                                >
                                                    Please enter description.
                                                </div>
                                            </div>
                                            <div class="mb-4">
                                                <label
                                                    class="form-label"
                                                    for="discount"
                                                    >Discount</label
                                                >
                                                <input
                                                    type="text"
                                                    id="discount"
                                                    class="form-control"
                                                    v-model="state.discount"
                                                    @blur="v$.discount.$touch"
                                                    placeholder="Enter a discount .."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row items-push">
                                        <div class="col-lg-7 offset-lg-4">
                                            <button
                                                type="submit"
                                                class="btn btn-alt-primary"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </BaseBlock>
                            </form>
                            <div
                                class="block-content block-content-full text-end bg-body"
                            >
                                <button
                                    type="button"
                                    class="btn btn-sm btn-alt-secondary me-1"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                            </div>
                        </template>
                    </BaseBlock>
                </div>
            </div>
        </div>
    </div>
</template>
