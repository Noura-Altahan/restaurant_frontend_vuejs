<script setup>
import { onMounted, reactive, inject, watch, ref } from "vue";
import { headers } from "@/shares/share";
import toast from "@/components/ToastBlock.vue";
const $axios = inject("$axios");
const search = ref("");
const searchClick = async () => {
    await getUsersList();
};
const state = reactive({
    id: null,
    list: [],
    currentPage: 1,
    totalPage: null,
    lastPage: null,
    from: null,
    to: null,
});
watch(
    () => state.currentPage,
    () => getUsersList()
);
const deactivateUser = async (id) => {
    toast
        .fire({
            title: "Are you sure?",
            text: "Please confirm!",
            icon: "warning",
            showCancelButton: true,
            customClass: {
                confirmButton: "btn btn-danger m-1",
                cancelButton: "btn btn-secondary m-1",
            },
            confirmButtonText: "Yes, confirm it!",
            html: false,
            preConfirm: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 50);
                });
            },
        })
        .then(async (result) => {
            if (result.isConfirmed) {
                const response = await $axios.post(
                    "/users/deactivate_user",
                    { user_id: id },
                    {
                        headers: {
                            Authorization: headers().Authorization,
                        },
                    }
                );
                if (response.data.isSuccess && response.data.status === 200) {
                    toast.fire(
                        "Success",
                        "User deactiaved successfully",
                        "success"
                    );
                    await getUsersList();
                } else {
                    toast.fire(
                        "Oops...",
                        response.data.message ?? "Something went wrong!",
                        "error"
                    );
                }
            } else if (result.dismiss === "cancel") {
                toast.fire(
                    "Cancelled",
                    "You have cancelled the action!",
                    "error"
                );
            }
        });
};

const getUsersList = async () => {
    await $axios
        .get("users/users_list", {
            params: { page: state.currentPage, search: search.value },
            headers: {
                Authorization: headers().Authorization,
            },
        })
        .then((response) => {
            state.list = response.data.data.items;
            state.lastPage = response.data.data.last_page;
            state.totalPage = response.data.data.total_pages;
            state.from = response.data.data.from;
            state.to = response.data.data.to;
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

onMounted(() => {
    getUsersList();
});
</script>

<template>
    <div class="content">
        <div class="row">
            <div class="col-6">
                <BaseBlock title="Search">
                    <div class="row">
                        <div class="col-6 d-flex align-items-center">
                            <div class="mb-3">
                                <input
                                    type="text"
                                    placeholder="PHONE"
                                    v-on:keyup.enter="searchClick()"
                                    v-model="search"
                                    class="form-control"
                                />
                            </div>
                        </div>
                    </div>
                </BaseBlock>
            </div>
        </div>
        <BaseBlock title="Users List" ref="BlockUsersList">
            <template #options>
                <button
                    type="button"
                    class="btn-block-option"
                    @click="getUsersList()"
                >
                    <i class="si si-refresh"></i>
                </button>
            </template>

            <div class="table-responsive">
                <table class="table table-bordered table-striped table-vcenter">
                    <thead>
                        <tr>
                            <th class="text-center">#</th>
                            <th>FullName</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>id Number</th>
                            <th>Birth</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in state.list" :key="user.id">
                            <td class="text-center">
                                {{ index + 1 }}
                            </td>
                            <td class="fw-semibold fs-sm">
                                {{ user.fullName }}
                            </td>
                            <td class="fw-semibold fs-sm">
                                {{ user.phone }}
                            </td>
                            <td class="fw-semibold fs-sm">
                                {{ user.email }}
                            </td>
                            <td class="fw-semibold fs-sm">
                                {{ user.gender }}
                            </td>
                            <td class="fw-semibold fs-sm">
                                {{ user.idNumber }}
                            </td>
                            <td>
                                {{ user.birth }}
                            </td>
                            <td class="text-center">
                                <div class="btn-group">
                                    <button
                                        v-if="user.is_active"
                                        type="button"
                                        class="btn btn-sm btn-alt-danger ms-2"
                                        title="Deactivate User"
                                        @click="deactivateUser(user.id)"
                                    >
                                        Deactivate
                                    </button>
                                </div>
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
    </div>
</template>
