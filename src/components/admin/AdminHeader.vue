<template>
    <header class="bg-white shadow">
        <div class="flex justify-between items-center px-4 py-4 sm:px-6 lg:px-8">
            <div class="flex items-center">
                <!-- Mobile menu button -->
                <button @click="$emit('toggle-sidebar')"
                    class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500">
                    <span class="sr-only">Open sidebar</span>
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <h1 class="text-xl font-semibold text-gray-900 md:ml-0 ml-4">{{ title }}</h1>
            </div>

            <div class="flex items-center">
                <!-- User dropdown -->
                <div class="ml-3 relative">
                    <div>
                        <button @click="isUserMenuOpen = !isUserMenuOpen"
                            class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                            <span class="sr-only">Open user menu</span>
                            <img class="h-8 w-8 rounded-full object-cover"
                                :src="userStore.user?.avatar || '/placeholder.svg?height=32&width=32'"
                                alt="User avatar" />
                        </button>
                    </div>

                    <div v-if="isUserMenuOpen"
                        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                        @click.outside="isUserMenuOpen = false">
                        <div class="block px-4 py-2 text-xs text-gray-400">
                            {{ userStore.user?.name || 'Admin' }}
                        </div>
                        <router-link :to="{ name: 'profile', params: { id: userStore.user?.id } }"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            @click="isUserMenuOpen = false">
                            Your Profile
                        </router-link>
                        <button @click="logout"
                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useToastStore } from '@/stores/toast';

export default {
    name: 'AdminHeader',
    props: {
        title: {
            type: String,
            default: 'Dashboard'
        }
    },
    emits: ['toggle-sidebar'],
    setup() {
        const router = useRouter();
        const userStore = useUserStore();
        const toastStore = useToastStore();
        const isUserMenuOpen = ref(false);

        const logout = async () => {
            try {
                await userStore.removeToken();
                toastStore.showToast(5000, 'Logged out successfully', 'bg-green-500');
                router.push('/login');
            } catch (error) {
                console.error('Logout error:', error);
                toastStore.showToast(5000, 'Error logging out', 'bg-red-500');
            }
        };

        return {
            userStore,
            isUserMenuOpen,
            logout
        };
    }
}
</script>