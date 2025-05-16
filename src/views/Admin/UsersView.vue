<template>
    <div class="container mx-auto px-4 py-6">
        <div class="bg-white rounded-lg shadow-md p-6">
            <!-- <h1 class="text-2xl font-bold mb-6">User Management</h1> -->

            <!-- Search and filters -->
            <div class="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div class="relative">
                    <input v-model="searchTerm" type="text" placeholder="Search users..."
                        class="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64" @input="handleSearch" />
                    <div class="absolute left-3 top-2.5 text-gray-400">
                        <i class="fas fa-search"></i>
                    </div>
                </div>

                <div class="flex gap-4">
                    <select v-model="statusFilter" class="border rounded-lg px-3 py-2" @change="applyFilters">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <select v-model="roleFilter" class="border rounded-lg px-3 py-2" @change="applyFilters">
                        <option value="">All Roles</option>
                        <option value="1">Admin</option>
                        <option value="2">User</option>
                    </select>
                </div>
            </div>

            <!-- Loading indicator -->
            <div v-if="loading" class="flex justify-center my-8">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>

            <!-- Users table -->
            <div v-else class="overflow-x-auto">
                <table class="min-w-full bg-white">
                    <thead>
                        <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th class="py-3 px-6 text-left sticky left-0 bg-gray-100 z-10 "></th>
                            <th class="py-3 px-6 text-left">User</th>
                            <th class="py-3 px-6 text-left">Email</th>
                            <th class="py-3 px-6 text-center">Role</th>
                            <th class="py-3 px-6 text-center">Status</th>
                            <th class="py-3 px-6 text-center sticky right-0 bg-gray-100 z-1">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 text-sm">
                        <tr v-for="user in users" :key="user.id" class="border-b border-gray-200 hover:bg-gray-50">
                            <td class="py-3 px-6 text-left sticky left-0 bg-gray-100 z-10 ">
                                {{ user.id }}
                            </td>
                            <td class="py-3 px-6 text-left whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="mr-2">
                                        <img :src="user.avatar || 'https://via.placeholder.com/40'"
                                            class="w-10 h-10 rounded-full object-cover" alt="User avatar" />
                                    </div>
                                    <span>{{ user.name }}</span>
                                </div>
                            </td>
                            <td class="py-3 px-6 text-left">
                                {{ user.email }}
                            </td>
                            <td class="py-3 px-6 text-center">
                                <span :class="getRoleBadgeClass(user.role_id)">
                                    {{ user.role_id === 1 ? 'Admin' : 'User' }}
                                </span>
                            </td>
                            <td class="py-3 px-6 text-center">
                                <span :class="getStatusBadgeClass(user.status)">
                                    {{ user.status }}
                                </span>
                            </td>
                            <td class="py-3 px-6 text-center sticky right-0 bg-gray-100 z-1">
                                <div class="flex item-center justify-center gap-2">
                                    <button @click="viewUser(user)" class="text-blue-500 hover:text-blue-700">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <!-- <button @click="editUser(user)" class="text-green-500 hover:text-green-700">
                                        <i class="fas fa-edit"></i>
                                    </button> -->
                                    <button @click="toggleUserStatus(user)"
                                        :class="user.status === 'active' ? 'text-orange-500 hover:text-orange-700' : 'text-green-500 hover:text-green-700'">
                                        <i :class="user.status === 'active' ? 'fas fa-lock' : 'fas fa-unlock'"></i>
                                    </button>
                                    <!-- <button @click="deleteUser(user.id)" class="text-red-500 hover:text-red-700">
                                        <i class="fas fa-trash"></i>
                                    </button> -->
                                </div>
                            </td>
                        </tr>
                        <tr v-if="users.length === 0">
                            <td colspan="5" class="py-6 text-center text-gray-500">
                                No users found
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination and items per page -->
            <div v-if="!loading && users.length > 0"
                class="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-600">Show</span>
                    <select v-model="perPage" @change="changeItemsPerPage" class="border rounded-lg px-3 py-1">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                    <span class="text-sm text-gray-600">entries</span>
                </div>

                <div class="text-sm text-gray-600">
                    Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} entries
                </div>

                <div class="flex gap-2">
                    <button @click="changePage(pagination.current_page - 1)" :disabled="!pagination.prev_page_url"
                        class="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    <button v-for="link in paginationLinks" :key="link.label" @click="changePage(Number(link.label))"
                        :class="[
                            'px-4 py-2 border rounded-md',
                            link.active ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'
                        ]">
                        {{ link.label }}
                    </button>
                    <button @click="changePage(pagination.current_page + 1)" :disabled="!pagination.next_page_url"
                        class="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- User modal -->
        <div v-if="selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">User Details</h2>
                        <button @click="selectedUser = null" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="flex flex-col items-center mb-4">
                        <img :src="selectedUser.avatar || 'https://via.placeholder.com/100'"
                            class="w-24 h-24 rounded-full object-cover mb-2" alt="User avatar" />
                        <h3 class="text-lg font-semibold">{{ selectedUser.name }}</h3>
                        <p class="text-gray-600">{{ selectedUser.email }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p class="text-sm text-gray-500">Role</p>
                            <p>{{ selectedUser.role_id === 1 ? 'Admin' : 'User' }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Status</p>
                            <p class="capitalize">{{ selectedUser.status }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Gender</p>
                            <p class="capitalize">{{ selectedUser.gender || 'Not specified' }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Date of Birth</p>
                            <p>{{ selectedUser.date_of_birth || 'Not specified' }}</p>
                        </div>
                        <div class="col-span-2">
                            <p class="text-sm text-gray-500">Created At</p>
                            <p>{{ formatDate(selectedUser.created_at) }}</p>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2">
                        <button @click="selectedUser = null" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                            Close
                        </button>
                        <button @click="toggleUserStatus(selectedUser)"
                            :class="selectedUser.status === 'active' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'"
                            class="px-4 py-2 text-white rounded-md">
                            {{ selectedUser.status === 'active' ? 'Lock Account' : 'Unlock Account' }}
                        </button>

                    </div>
                </div>
            </div>
        </div>

        <!-- Lock/Unlock Confirmation Modal -->
        <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">{{ confirmAction === 'lock' ? 'Lock Account' : 'Unlock Account' }}
                        </h2>
                        <button @click="cancelConfirmation" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="mb-6">
                        <p>Are you sure you want to {{ confirmAction === 'lock' ? 'lock' : 'unlock' }} the account for
                            <strong>{{ userToModify?.name }}</strong>?
                        </p>
                        <p class="mt-2 text-sm text-gray-600">
                            {{ confirmAction === 'lock' ? 'This will prevent the user from logging in.' : 'This will allow the user to log in again.' }}
                        </p>
                    </div>
                    <div class="flex justify-end gap-2">
                        <button @click="cancelConfirmation" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button @click="confirmStatusChange"
                            :class="confirmAction === 'lock' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'"
                            class="px-4 py-2 text-white rounded-md">
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
export default {
    data() {
        return {
            users: [],
            pagination: {
                current_page: 1,
                first_page_url: '',
                from: 0,
                last_page: 1,
                last_page_url: '',
                links: [],
                next_page_url: null,
                path: '',
                per_page: 10,
                prev_page_url: null,
                to: 0,
                total: 0
            },
            loading: false,
            searchTerm: '',
            statusFilter: '',
            roleFilter: '',
            selectedUser: null,
            searchTimeout: null,
            perPage: 10,
            showConfirmModal: false,
            confirmAction: 'lock', // 'lock' or 'unlock'
            userToModify: null,
        };
    },

    computed: {
        paginationLinks() {
            // Filter out the first and last elements (prev and next buttons)
            return this.pagination.links ? this.pagination.links.filter((link, index) => {
                return index > 0 && index < this.pagination.links.length - 1;
            }) : [];
        }
    },

    methods: {
        async fetchUsers(page = 1) {
            this.loading = true;
            try {
                // Build query parameters
                const params = new URLSearchParams();
                params.append('page', page);
                params.append('per_page', this.perPage);

                if (this.searchTerm) {
                    params.append('keyword', this.searchTerm);
                }

                // Build filters object
                const filters = {};
                if (this.statusFilter) {
                    filters['status'] = this.statusFilter;
                }
                if (this.roleFilter) {
                    filters['role_id'] = this.roleFilter;
                }

                // Append filters to query
                Object.keys(filters).forEach((key) => {
                    params.append(`filters[${key}]`, filters[key]);
                });
                // Make the API call
                const response = await axios.get(`/api/get-all?${params.toString()}`);

                if (response.data.success) {
                    this.users = response.data.data.data;
                    this.pagination = {
                        current_page: response.data.data.current_page,
                        first_page_url: response.data.data.first_page_url,
                        from: response.data.data.from,
                        last_page: response.data.data.last_page,
                        last_page_url: response.data.data.last_page_url,
                        links: response.data.data.links,
                        next_page_url: response.data.data.next_page_url,
                        path: response.data.data.path,
                        per_page: response.data.data.per_page,
                        prev_page_url: response.data.data.prev_page_url,
                        to: response.data.data.to,
                        total: response.data.data.total
                    };
                } else {
                    console.error('Failed to fetch users:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                this.loading = false;
            }
        },

        changePage(page) {
            if (page < 1 || page > this.pagination.last_page) return;
            this.fetchUsers(page);
        },

        changeItemsPerPage() {
            // Reset to first page when changing items per page
            this.fetchUsers(1);
        },

        handleSearch() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.fetchUsers(1);
            }, 500);
        },

        applyFilters() {
            this.fetchUsers(1);
        },

        formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        getStatusBadgeClass(status) {
            return status === 'active'
                ? 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-800'
                : 'px-2 py-1 rounded-full text-xs bg-red-100 text-red-800';
        },

        getRoleBadgeClass(roleId) {
            return roleId === 1
                ? 'px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800'
                : 'px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800';
        },

        viewUser(user) {
            this.selectedUser = user;
        },

        editUser(user) {

            alert(`Edit user: ${user.name}`);

        },

        async toggleUserStatus(user) {
            this.userToModify = user;
            this.confirmAction = user.status === 'active' ? 'lock' : 'unlock';
            this.showConfirmModal = true;
        },
        cancelConfirmation() {
            this.showConfirmModal = false;
            this.userToModify = null;
        },
        async deleteUser(userId) {
            if (confirm('Are you sure you want to delete this user?')) {
                try {
                    // In a real application, you would make an API call to delete the user
                    // const response = await axios.delete(`http://127.0.0.1:8000/api/users/${userId}`);

                    // For now, just show an alert
                    alert(`Delete user ID: ${userId}`);

                    // After successful deletion, refresh the user list
                    this.fetchUsers(this.pagination.current_page);
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            }
        },
        async confirmStatusChange() {
            try {
                // Chọn API dựa trên hành động
                const apiUrl = this.confirmAction === 'lock'
                    ? `/api/block/${this.userToModify.id}`
                    : `/api/unblock/${this.userToModify.id}`;

                // Gọi API
                const response = await axios.put(apiUrl);

                if (response.data.success) {
                    // Cập nhật trạng thái người dùng trong danh sách
                    const newStatus = this.confirmAction === 'lock' ? 'inactive' : 'active';
                    const userIndex = this.users.findIndex(u => u.id === this.userToModify.id);
                    if (userIndex !== -1) {
                        this.users[userIndex].status = newStatus;
                    }

                    // Nếu người dùng đang được chọn trong modal, cập nhật trạng thái
                    if (this.selectedUser && this.selectedUser.id === this.userToModify.id) {
                        this.selectedUser.status = newStatus;
                    }

                    // Làm mới danh sách nếu có bộ lọc trạng thái
                    if (this.statusFilter) {
                        this.fetchUsers(this.pagination.current_page);
                    }

                    // Đóng modal xác nhận
                    this.showConfirmModal = false;
                    this.userToModify = null;
                } else {
                    console.error('Failed to update user status:', response.data.message);
                }
            } catch (error) {
                console.error(`Error ${this.confirmAction === 'lock' ? 'blocking' : 'unblocking'} user:`, error);
            }
        }
    },

    mounted() {
        // Fetch users when the component is mounted
        this.fetchUsers();
    }
}
</script>

<style scoped>
/* You can add custom styles here if needed */
</style>