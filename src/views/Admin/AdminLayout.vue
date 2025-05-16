<template>
    <div class="flex h-screen bg-gray-100">
        <!-- Sidebar -->
        <AdminSidebar :activeRoute="$route.name" />

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Header -->
            <AdminHeader :title="pageTitle" />

            <!-- Main Content Area -->
            <main class="flex-1 overflow-y-auto p-4 md:p-6">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script>
import AdminSidebar from '../../components/admin/AdminSidebar.vue';
import AdminHeader from '../../components/admin/AdminHeader.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
    name: 'AdminLayout',
    components: {
        AdminSidebar,
        AdminHeader
    },
    setup() {
        const route = useRoute();

        const pageTitle = computed(() => {
            switch (route.name) {
                case 'admin-dashboard':
                    return 'Dashboard';
                case 'admin-users':
                    return 'User Management';
                case 'admin-posts':
                    return 'Post Management';
                default:
                    return 'Admin Panel';
            }
        });

        return {
            pageTitle
        };
    }
}
</script>