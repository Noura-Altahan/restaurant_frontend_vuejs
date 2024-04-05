<script setup>
import { useTemplateStore } from "@/stores/template";

// Main store
const store = useTemplateStore();
</script>

<template>
    <!-- Footer -->
    <footer id="page-footer">
        <slot>
            <div class="bg-body-light">
                <div class="content py-3">
                    <div class="row fs-sm">
                        <div class="col-12 py-1 text-center">
                            <a class="fw-semibold" href="#">{{
                                store.app.name + " " + store.app.version
                            }}</a>
                            &copy; {{ store.app.copyright }}
                        </div>
                    </div>
                </div>
            </div>
        </slot>
    </footer>
    <!-- END Footer -->
</template>
