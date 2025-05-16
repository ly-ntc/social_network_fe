<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div class="main-center col-span-3 space-y-4">
            <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div class="flex items-center justify-between mb-6">
                    <h1 class="text-2xl font-bold text-gray-800">Notifications</h1>
                    <button v-if="notifications.length > 0" @click="markAllAsRead"
                        class="text-sm text-purple-600 hover:text-purple-800 transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Mark all as read
                    </button>
                </div>

                <div v-if="isLoading" class="flex justify-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>

                <div v-else-if="notifications.length === 0" class="py-12 text-center">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-700 mb-1">All caught up!</h3>
                    <p class="text-gray-500">You don't have any unread notifications.</p>
                </div>

                <div v-else class="space-y-4">
                    <div v-for="notification in notifications" :key="notification.id"
    class="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
    @click="readNotification(notification)">
    <div class="flex items-start space-x-3">
        <!-- Notification icon based on type -->
        <div class="flex-shrink-0 mt-1 relative">
            <!-- Dấu chấm cho thông báo chưa đọc -->
            <span v-if="!notification.read_at" 
                class="absolute top-0 right-0 w-3 h-3 bg-purple-600 rounded-full"></span>

            <!-- Notification type icon -->
            <div v-if="notification.type_of_notification === 'post_like'"
                class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clip-rule="evenodd" />
                </svg>
            </div>
            <!-- Add other notification type icons here -->
        </div>

        <!-- Notification content -->
        <div class="flex-grow">
            <div class="flex items-start justify-between">
                <div>
                    <p class="text-gray-800">
                        <span class="text-gray-600">
                            {{ getNotificationText(notification) }}
                        </span>
                        <br>
                    </p>

                    <!-- Post or comment content preview -->
                    <div v-if="notification.data?.post"
                        class="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border-l-2 border-gray-300">
                        <p v-if="notification.data.post.title" class="font-medium mb-1">{{
                            notification.data.post.title }}</p>
                        <p class="line-clamp-2">{{ notification.data.post.content ||
                            notification.data.comment?.content }}</p>
                    </div>
                </div>

                <!-- Timestamp -->
                <span class="text-xs text-gray-500 whitespace-nowrap ml-2">{{
                    formatTimeAgo(notification.created_at) }}</span>
            </div>
        </div>
    </div>
</div>
                </div>
            </div>
        </div>

        <!-- Right sidebar -->
        <div class="main-right col-span-1 space-y-4">
            <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 class="font-medium text-gray-800 mb-3">Notification Settings</h3>
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600">Email notifications</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="emailNotifications" class="sr-only peer">
                            <div
                                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600">
                            </div>
                        </label>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600">Push notifications</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="pushNotifications" class="sr-only peer">
                            <div
                                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600">
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../../stores/axios.js';
import { ref } from 'vue'
import { useToastStore } from '@/stores/toast'

export default {
    name: 'NotificationsView',

    setup() {
        const toastStore = useToastStore()
        const emailNotifications = ref(true)
        const pushNotifications = ref(true)

        return {
            toastStore,
            emailNotifications,
            pushNotifications
        }
    },

    data() {
        return {
            notifications: [],
            isLoading: true
        }
    },

    mounted() {
        this.getNotifications()
    },

    methods: {
        getNotifications() {
            this.isLoading = true
            axios
                .get('/api/notifications/')
                .then(response => {
                    console.log('Notifications:', response.data)
                    this.notifications = response.data.data
                })
                .catch(error => {
                    console.log('Error: ', error)
                    this.toastStore.showToast(5000, 'Failed to load notifications', 'bg-red-500')
                })
                .finally(() => {
                    this.isLoading = false
                })
        },

        async readNotification(notification) {
            console.log('Reading notification:', notification.id)

            try {
                await axios.post(`/api/notifications/read/${notification.id}/`)

                // Remove the notification from the list
                this.getNotifications();

                // Navigate based on notification type
                if (notification.type === 'like' || notification.type === 'comment') {
                    // For post-related notifications, navigate to the post
                    this.$router.push({
                        name: 'postview',
                        params: { id: notification.post_id || notification.data?.post?.id }
                    })
                } else if (notification.type === 'follow') {
                    // For friendship notifications, navigate to the friends page
                    this.$router.push({
                        name: 'profile',
                        params: { id: notification.data.user.id }
                    })
                }
            } catch (error) {
                console.error('Error marking notification as read:', error)
                this.toastStore.showToast(5000, 'Failed to mark notification as read', 'bg-red-500')
            }
        },

        async markAllAsRead() {
            try {
                await axios.post('/api/notifications/read-all/')
                this.toastStore.showToast(3000, 'All notifications marked as read', 'bg-emerald-500')
                this.notifications = []
            } catch (error) {
                console.error('Error marking all notifications as read:', error)
                this.toastStore.showToast(5000, 'Failed to mark all notifications as read', 'bg-red-500')
            }
        },

        getNotificationText(notification) {
            switch (notification.type_of_notification) {
                case 'post_like':
                    return ' liked your post';
                case 'post_comment':
                    return ' commented on your post';
                case 'friendship_request':
                    return ' sent you a friend request';
                case 'friendship_accepted':
                    return ' accepted your friend request';
                default:
                    return notification.message || ' sent you a notification';
            }
        },

        formatTimeAgo(timestamp) {
            if (!timestamp) return '';

            const date = new Date(timestamp);
            const now = new Date();
            const diffMs = now - date;
            const diffSec = Math.floor(diffMs / 1000);
            const diffMin = Math.floor(diffSec / 60);
            const diffHour = Math.floor(diffMin / 60);
            const diffDay = Math.floor(diffHour / 24);

            if (diffDay > 7) {
                return date.toLocaleDateString();
            } else if (diffDay > 0) {
                return `${diffDay}d ago`;
            } else if (diffHour > 0) {
                return `${diffHour}h ago`;
            } else if (diffMin > 0) {
                return `${diffMin}m ago`;
            } else {
                return 'Just now';
            }
        }
    }
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>