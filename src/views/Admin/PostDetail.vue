<template>
    <div class="container mx-auto px-4 py-6">
        <div v-if="loading" class="flex justify-center my-8">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
        
        <div v-else class="bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold mb-4">Post Details Report</h1>
            <table class="min-w-full bg-white">
                    <thead>
                        <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th class="py-3 px-6 text-left sticky left-0 bg-gray-100 z-10">Id</th>
                            <th class="py-3 px-6 text-left">User</th>
                            <th class="py-3 px-6 text-center">Reason</th>
                            <th class="py-3 px-6 text-center">Create at</th>
                        </tr>
                    </thead>

                    <tbody class="text-gray-600 text-sm">
                        <template v-if="posts && posts.length">
                            <tr v-for="post in posts" :key="post.id" class="border-b border-gray-200 hover:bg-gray-50">
                                <td class="py-3 px-6 text-left sticky left-0 bg-gray-100 z-10">{{ post.id }}</td>
                                <td class="py-3 px-6 text-left">{{ post.user.name }}</td>
                                <td class="py-3 px-6 text-center">{{ post.reason }}</td>
                                <td class="py-3 px-6 text-center">{{ formatDate(post.created_at) }}</td>
                            </tr>
                        </template>
                        <tr v-else class="border-b border-gray-200 hover:bg-gray-100">
                            <td colspan="4" class="py-3 px-6 text-center">No data available</td>
                        </tr>
                    </tbody>
                    
                </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['id'],
    data() {
        return {
            posts: null,
            loading: true,
            post: null,
        };
    },
    methods: {
        async fetchPost() {
            try {
                const response = await axios.get(`/api/posts/report/${this.id}`);
                if (response.data.success) {
                    console.log('Post fetched successfully:', response.data.data.reports);
                    this.post = response.data.data;
                    this.posts = response.data.data.reports;
                } else {
                    console.error('Failed to fetch post:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                this.loading = false;
            }
        },
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        },
    },
    mounted() {
        this.fetchPost();
    },
};
</script>