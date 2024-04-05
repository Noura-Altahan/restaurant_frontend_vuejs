<script setup>
import {  onMounted, onUnmounted } from "vue";
import { useTemplateStore } from "@/stores/template";

// SimpleBar, for more info and examples you can check out https://github.com/Grsmto/simplebar/tree/master/packages/simplebar-vue
import SimpleBar from "simplebar";

 

// Main store
const store = useTemplateStore();

 

// Close side overlay on ESCAPE key down
function eventSideOverlay(event) {
    if (event.which === 27) {
        event.preventDefault();
        store.sideOverlay({ mode: "close" });
    }
}

// Init SimpleBar (custom scrolling) and attach ESCAPE key event listener
onMounted(() => {
    new SimpleBar(document.getElementById("side-overlay"));

    document.addEventListener("keydown", eventSideOverlay);
});

// Remove keydown event listener
onUnmounted(() => {
    document.removeEventListener("keydown", eventSideOverlay);
});
</script>

<template>
    <!-- Side Overlay-->
    <aside id="side-overlay">
        <slot>
            <!-- Side Header -->
            <div class="content-header border-bottom">
                <slot name="header">
                    <!-- User Avatar -->
                    <a class="img-link me-1" href="javascript:void(0)">
                        <img
                            class="img-avatar img-avatar32"
                            src="/assets/media/avatars/avatar10.jpg"
                            alt="Avatar"
                        />
                    </a>
                    <!-- END User Avatar -->

                    <!-- User Info -->
                    <div class="ms-2">
                        <a
                            class="text-dark fw-semibold fs-sm"
                            href="javascript:void(0)"
                            >John Smith</a
                        >
                    </div>
                    <!-- END User Info -->
                </slot>

                <!-- Close Side Overlay -->
                <button
                    type="button"
                    class="ms-auto btn btn-sm btn-alt-danger"
                    @click="store.sideOverlay({ mode: 'close' })"
                >
                    <i class="fa fa-fw fa-times"></i>
                </button>
                <!-- END Close Side Overlay -->
            </div>
            <!-- END Side Header -->

            <slot name="content">
                <!-- Side Content -->
                <div class="content-side">
                    <!-- Side Overlay Tabs -->
                    <BaseBlock
                        transparent
                        :rounded="false"
                        class="pull-x pull-t"
                    >
                        <template #content>
                            <ul
                                class="nav nav-tabs nav-tabs-block nav-justified"
                                role="tablist"
                            >
                                <li class="nav-item">
                                    <button
                                        type="button"
                                        class="nav-link active"
                                        id="so-overview-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#so-overview"
                                        role="tab"
                                        aria-controls="so-overview"
                                        aria-selected="true"
                                    >
                                        <i
                                            class="fa fa-fw fa-coffee text-gray opacity-75 me-1"
                                        ></i>
                                        Overview
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button
                                        type="button"
                                        class="nav-link"
                                        id="so-sales-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#so-sales"
                                        role="tab"
                                        aria-controls="so-sales"
                                        aria-selected="false"
                                    >
                                        <i
                                            class="fa fa-fw fa-chart-line text-gray opacity-75 me-1"
                                        ></i>
                                        Sales
                                    </button>
                                </li>
                            </ul>
                            <div
                                class="block-content tab-content overflow-hidden"
                            >
                                <!-- Overview Tab -->
                                <div
                                    class="tab-pane pull-x fade fade-left show active"
                                    id="so-overview"
                                    role="tabpanel"
                                    aria-labelledby="so-overview-tab"
                                    tabindex="0"
                                >
                               


                               
                                </div>
                                
                            </div>
                        </template>
                    </BaseBlock>
                    <!-- END Side Overlay Tabs -->
                </div>
                <!-- END Side Content -->
            </slot>
        </slot>
    </aside>
    <!-- END Side Overlay -->
</template>

