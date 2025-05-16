<template>
    <div class="p-4 bg-white border border-gray-200 rounded-lg">
        <h3 class="mb-6 text-xl">People you may know</h3>

        <div class="space-y-4">
            <div class="flex items-center justify-between" v-for="user in filteredUsers" v-bind:key="user.id">
                <div class="flex items-center space-x-2">
                    <img :src="user.avatar" class="w-[40px] rounded-full">

                    <p class="text-xs"><strong>{{ user.name }}</strong></p>
                </div>

                <RouterLink :to="{ path: `/profile/${user.id}` }"
                    class="py-2 px-3 bg-purple-600 text-white text-xs rounded-lg">
                    Show
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../stores/axios';
import { useUserStore } from '@/stores/user'; // Import Pinia store

export default {
    data() {
        return {
            users: [] // Danh sách người dùng trả về từ API
        };
    },

    computed: {
        // Lọc danh sách người dùng để loại bỏ người dùng hiện tại
        filteredUsers() {
            const currentUserId = this.userStore.user.id; // ID của người dùng hiện tại
            return this.users.filter(user => user.id != currentUserId); // Loại bỏ người dùng hiện tại
        }
    },

    mounted() {
        this.getFriendSuggestions(); // Gọi API khi component được mount
    },

    methods: {
        getFriendSuggestions() {
            axios
                .get('/api/get-all-users') // API trả về danh sách người dùng
                .then(response => {
                    if (response.data.success) {
                        this.users = response.data.data.data; // Lưu danh sách người dùng
                    } else {
                        console.log('API response indicates failure:', response.data);
                    }
                })
                .catch(error => {
                    console.log('error', error);
                });
        }
    },

    setup() {
        const userStore = useUserStore(); // Lấy thông tin người dùng từ Pinia store
        return {
            userStore
        };
    }
};
</script>