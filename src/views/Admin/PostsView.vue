<template>
    <div class="container mx-auto px-4 py-6">
        <div class="bg-white rounded-lg shadow-md p-6">

            <!-- Search and filters -->
            <div class="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div class="relative">
                    <input v-model="searchTerm" type="text" placeholder="Search posts..."
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

                    <select v-model="categoryFilter" class="border rounded-lg px-3 py-2" @change="applyFilters">
                        <option value="">All Categories</option>
                        <option value="1">News</option>
                        <option value="2">Technology</option>
                        <option value="3">Lifestyle</option>
                    </select>
                </div>
            </div>

            <!-- Loading indicator -->
            <div v-if="loading" class="flex justify-center my-8">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>

            <!-- Posts table -->
            <div v-else class="overflow-x-auto">
                <table class="min-w-full bg-white">
                    <thead>
                        <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th class="py-3 px-6 text-left sticky left-0 bg-gray-100 z-10">Id</th>
                            <th class="py-3 px-6 text-left">User</th>
                            <th class="py-3 px-6 text-center">Like_count</th>
                            <th class="py-3 px-6 text-center">Comment_count</th>
                            <th class="py-3 px-6 text-center">Report_count</th>
                            <th class="py-3 px-6 text-center">Status</th>
                            <th class="py-3 px-6 text-center">Reason</th>
                            <th class="py-3 px-6 text-center">Create at</th>
                            <th class="py-3 px-6 text-center">Delete_at</th>
                            <th class="py-3 px-6 text-center sticky right-0 bg-gray-100 z-1">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 text-sm">
                        <tr v-for="post in posts" :key="post.id" class="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                        @click="goToPostDetail(post.id)">
                            <td class="py-3 px-6 text-left sticky left-0 bg-gray-100 z-10">
                                <div class="flex items-center">
                                    <div class="mr-2" v-if="post.thumbnail">
                                        <img :src="post.thumbnail || 'https://via.placeholder.com/40'"
                                            class="w-10 h-10 rounded object-cover" alt="Post thumbnail" />
                                    </div>
                                    <span class="font-medium">{{ post.id }}</span>
                                </div>
                            </td>
                            <td class="py-3 px-6 text-left">
                                {{ post.user.name }}
                            </td>
                            <td class="py-3 px-6 text-center">
                                {{ post.likes_count }}
                            </td>
                            <td class="py-3 px-6 text-center">
                                {{ post.comments_count }}
                            </td>
                            <td class="py-3 px-6 text-center">
                                {{ post.reports_count }}
                            </td>
                            <td class="py-3 px-6 text-center">
                                <span :class="getStatusBadgeClass(post.status)">
                                    {{ post.status }}
                                </span>
                            </td>
                            <td class="py-3 px-6 text-center">
                                {{ post.reason || 'N/A' }}
                            </td>
                            <td class="py-3 px-6 text-center">
                                {{ formatDate(post.created_at) }}
                            </td>
                            <td class="py-3 px-6 text-center">
                                {{ formatDate(post.delete_at) }}
                            </td>
                            <td class="py-3 px-6 text-center sticky right-0 bg-gray-100 z-1">
                                <div class="flex item-center justify-center gap-2">
                                    <button @click="viewPost(post)" class="text-blue-500 hover:text-blue-700">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button @click.stop="togglePostStatus(post)"
                                        :class="post.status === 'active' ? 'text-orange-500 hover:text-orange-700' : 'text-green-500 hover:text-green-700'">
                                        <i :class="post.status === 'active' ? 'fas fa-lock' : 'fas fa-unlock'"></i>
                                    </button>

                                </div>
                            </td>
                        </tr>
                        <tr v-if="posts.length === 0">
                            <td colspan="6" class="py-6 text-center text-gray-500">
                                No posts found
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination and items per page -->
            <div v-if="!loading && posts.length > 0"
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

        <!-- Post detail modal -->
        <div v-if="selectedPost" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">Post Details</h2>
                        <button @click="selectedPost = null" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="mb-4">
                        <h3 class="text-2xl font-bold mb-2">{{ selectedPost.title }}</h3>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span :class="getStatusBadgeClass(selectedPost.status)">
                                {{ selectedPost.status }}
                            </span>
                        </div>

                        <div class="flex items-center text-sm text-gray-600 mb-4">
                            <span>By {{ selectedPost.user.name }}</span>
                            <span class="mx-2">•</span>
                            <span>{{ formatDate(selectedPost.created_at) }}</span>
                        </div>

                        <div v-if="selectedPost.document && selectedPost.document.length" class="mb-4">
                            <h4 class="text-lg font-bold mb-2">Media</h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div v-for="(media, index) in selectedPost.document" :key="index">
                                    <!-- Kiểm tra nếu là ảnh -->
                                    <img v-if="isImage(media)" :src="media" class="w-full h-40 object-cover rounded-lg"
                                        alt="Media" />
                                    <!-- Kiểm tra nếu là video -->
                                    <video v-else controls class="w-full h-40 rounded-lg">
                                        <source :src="media" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        </div>
                        <div class="prose max-w-none">
                            <div v-html="selectedPost.content"></div>
                        </div>


                    </div>

                    <div class="flex justify-end gap-2">
                        <button @click="selectedPost = null" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                            Close
                        </button>
                        <button @click="togglePostStatus(selectedPost)"
                            :class="selectedPost.status === 'active' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'"
                            class="px-4 py-2 text-white rounded-md">
                            {{ selectedPost.status === 'active' ? 'inactive' : 'active' }}
                        </button>

                    </div>
                </div>
            </div>
        </div>

        <!-- Status Change Confirmation Modal -->
        <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">{{ confirmAction === 'inactive' ? 'Unreport Post' : 'Report Post'
                        }}</h2>
                        <button @click="cancelConfirmation" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="mb-6">
                        <p>Are you sure you want to {{ confirmAction === 'inactive' ? 'unreport' : 'report' }} the post
                            <strong>{{ postToModify?.content }}</strong>?
                        </p>
                        <p class="mt-2 text-sm text-gray-600">
                            {{ confirmAction === 'inactive' ? 'This will hide the post from public view.' : 'This will make the post visible to the public.' }}
                        </p>
                    </div>
                    <div class="flex justify-end gap-2">
                        <button @click="cancelConfirmation" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button
                            @click="confirmAction === 'active' ? (showReasonModal = true, showConfirmModal = false) : submitStatusChange()"
                            :class="confirmAction === 'active' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'"
                            class="px-4 py-2 text-white rounded-md">
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reason Modal -->
        <div v-if="showReasonModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">Provide a Reason</h2>
                        <button @click="cancelReasonModal" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="mb-6">
                        <textarea v-model="reason" placeholder="Enter your reason here..."
                            class="w-full border rounded-lg p-2"></textarea>
                    </div>
                    <div class="flex justify-end gap-2">
                        <button @click="cancelReasonModal" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button @click="submitStatusChange"
                            :class="confirmAction === 'inactive' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'"
                            class="px-4 py-2 text-white rounded-md">
                            Submit
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
            posts: [],
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
            categoryFilter: '',
            selectedPost: null,
            searchTimeout: null,
            perPage: 10,
            showReasonModal: false,
            reason: '',

            // Confirmation modals
            showConfirmModal: false,
            confirmAction: 'active', // 'publish' or 'unpublish'
            postToModify: null,

            showDeleteModal: false,
            postToDelete: null,

            // Category mapping
            categories: [
                { id: 1, name: 'News', color: 'blue' },
                { id: 2, name: 'Technology', color: 'purple' },
                { id: 3, name: 'Lifestyle', color: 'green' }
            ]
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
        goToPostDetail(postId) {
            this.$router.push({ name: 'PostDetail', params: { id: postId } });
        },
        isImage(url) {
            return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
        },
        // Kiểm tra nếu URL là video
        isVideo(url) {
            return /\.(mp4|webm|ogg)$/i.test(url);
        },
        cancelReasonModal() {
            this.showReasonModal = false;
            this.reason = '';
        },
        async fetchPosts(page = 1) {
            this.loading = true;
            try {
                // Build query parameters
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

                // Append filters to query
                Object.keys(filters).forEach((key) => {
                    params.append(`filters[${key}]`, filters[key]);
                });
                // Make the API call
                // TODO: Replace with your actual API endpoint
                const response = await axios.get(`http://127.0.0.1:8000/api/posts/get-all?${params.toString()}`);

                if (response.data.success) {
                    this.posts = response.data.data.data;
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
                    console.error('Failed to fetch posts:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                this.loading = false;
            }
        },

        changePage(page) {
            if (page < 1 || page > this.pagination.last_page) return;
            this.fetchPosts(page);
        },

        changeItemsPerPage() {
            // Reset to first page when changing items per page
            this.fetchPosts(1);
        },

        handleSearch() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.fetchPosts(1);
            }, 500);
        },

        applyFilters() {
            this.fetchPosts(1);
        },

        formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        getStatusBadgeClass(status) {
            return status === 'active'
                ? 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-800'
                : 'px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800';
        },

        getCategoryBadgeClass(categoryId) {
            const category = this.categories.find(c => c.id === parseInt(categoryId));
            if (!category) return 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800';

            switch (category.color) {
                case 'blue':
                    return 'px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800';
                case 'purple':
                    return 'px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800';
                case 'green':
                    return 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-800';
                default:
                    return 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800';
            }
        },

        getCategoryName(categoryId) {
            const category = this.categories.find(c => c.id === parseInt(categoryId));
            return category ? category.name : 'Uncategorized';
        },

        viewPost(post) {
            this.selectedPost = post;
        },


        togglePostStatus(post) {
            this.postToModify = post;
            this.confirmAction = post.status === 'inactive' ? 'inactive' : 'active';
            this.showConfirmModal = true;
        },

        cancelConfirmation() {
            this.showConfirmModal = false;
            this.postToModify = null;
        },

        async submitStatusChange() {
            try {
                const apiUrl = this.confirmAction === 'active'
                    ? `http://127.0.0.1:8000/api/posts/${this.postToModify.id}/report`
                    : `http://127.0.0.1:8000/api/posts/${this.postToModify.id}/unreport`;

                const payload = this.confirmAction === 'active' ? { reason: this.reason } : {};
                const response = await axios.post(apiUrl, payload);

                if (response.data.success) {
                    const newStatus = this.confirmAction === 'active' ? 'inactive' : 'active';
                    const postIndex = this.posts.findIndex(p => p.id === this.postToModify.id);
                    if (postIndex !== -1) {
                        this.posts[postIndex].status = newStatus;
                        this.posts[postIndex].reason = this.confirmAction === 'active' ? this.reason : null;
                    }

                    // Nếu bài viết đang được chọn trong modal, cập nhật trạng thái
                    if (this.selectedPost && this.selectedPost.id === this.postToModify.id) {
                        this.selectedPost.status = newStatus;
                        this.selectedPost.reason = this.confirmAction === 'active' ? this.reason : null;
                    }

                    // Làm mới danh sách nếu có bộ lọc trạng thái
                    if (this.statusFilter) {
                        this.fetchPosts(this.pagination.current_page);
                    }

                    // Đóng modal lý do
                    this.showReasonModal = false;
                    this.showConfirmModal = false;
                    this.postToModify = null;
                    this.reason = '';
                } else {
                    console.error('Failed to update post status:', response.data.message);
                }
            } catch (error) {
                console.error('Error updating post status:', error);
            }
        }

    },

    mounted() {
        // Fetch posts when the component is mounted
        this.fetchPosts();
    }
}
</script>

<style scoped>
/* Đảm bảo bảng có cuộn ngang */
.table-container {
    overflow-x: auto;
}

/* Cố định cột Id và Actions */
th.sticky,
td.sticky {
    position: sticky;
    z-index: 10; /* Đảm bảo cột nằm trên các phần tử khác */
    background-color: white; /* Màu nền để tránh bị trong suốt */
}
th.sticky.left-0,
td.sticky.left-0 {
    left: 0;
}
th.sticky.right-0,
td.sticky.right-0 {
    right: 0;
}
</style>