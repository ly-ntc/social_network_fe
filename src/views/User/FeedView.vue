<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div class="main-center col-span-3 space-y-4">
            <div class="bg-white border border-gray-200 rounded-lg">
                <FeedForm v-bind:user="null" v-bind:posts="posts" @post-created="refreshFeed" />
            </div>

            <div v-if="posts.length === 0 && isLoading" class="p-8 flex justify-center">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>

            <div v-else-if="posts.length === 0" class="p-8 bg-white border border-gray-200 rounded-lg text-center">
                <p class="text-gray-500">No posts yet. Be the first to post something!</p>
            </div>

            <div v-else class="p-4 bg-white border border-gray-200 rounded-lg" v-for="post in posts"
                v-bind:key="post.id">
                <FeedItem v-bind:post="post" 
                    v-on:deletePost="deletePost"
                    v-on:reportPost="reportPost" />
            </div>

            <!-- Hiển thị trạng thái tải thêm -->
            <div v-if="isLoading && posts.length > 0" class="p-8 flex justify-center">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        </div>

        <div class="main-right col-span-1 space-y-4">
            <PeopleYouMayKnow />

            <!-- <Trends /> -->
        </div>
    </div>
</template>

<script>
import axios from '../../stores/axios.js';
import PeopleYouMayKnow from '../../components/PeopleYouMayKnow.vue'
import Trends from '../../components/Trends.vue'
import FeedItem from '../../components/FeedItem.vue'
import FeedForm from '../../components/FeedForm.vue'

export default {
    name: 'FeedView',

    components: {
        PeopleYouMayKnow,
        Trends,
        FeedItem,
        FeedForm
    },

    data() {
        return {
            posts: [],
            body: '',
            isLoading: false,
            currentPage: 1, // Trang hiện tại
            hasMore: true // Còn dữ liệu để tải hay không
        }
    },

    mounted() {
        this.getFeed();

        // Lắng nghe sự kiện cuộn
        window.addEventListener('scroll', this.handleScroll);
    },

    beforeUnmount() {
        // Hủy lắng nghe sự kiện cuộn khi component bị hủy
        window.removeEventListener('scroll', this.handleScroll);
    },

    methods: {
        getFeed() {
            this.isLoading = true;
            axios
                .get(`/api/posts/get-all-no-report?page=${this.currentPage}`)
                .then(response => {
                    console.log('data', response.data.data.data);
                    this.posts = response.data.data.data;
                    this.currentPage++; // Tăng số trang hiện tại
                })
                .catch(error => {
                    console.log('error', error);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },

        loadMorePosts() {
            if (!this.hasMore || this.isLoading) return; // Nếu không còn dữ liệu hoặc đang tải, dừng lại

            this.isLoading = true;

            axios
                .get(`/api/posts/list?page=${this.currentPage}`)
                .then(response => {
                    const newPosts = response.data.data.data;

                    if (newPosts.length > 0) {
                        this.posts = [...this.posts, ...newPosts]; // Thêm bài viết mới vào danh sách
                        this.currentPage++; // Tăng số trang hiện tại
                    } else {
                        this.hasMore = false; // Không còn dữ liệu để tải
                    }
                })
                .catch(error => {
                    console.log('Error loading more posts:', error);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },

        handleScroll() {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Nếu người dùng kéo gần đến cuối trang, tải thêm dữ liệu
            if (scrollTop + windowHeight >= documentHeight - 100) {
                this.loadMorePosts();
            }
        },

        deletePost(id) {
            this.posts = this.posts.filter(post => post.id !== id);
        },

        reportPost(id) {
            this.posts = this.posts.filter(post => post.id !== id);
        },
        refreshFeed() {
            console.log('Refreshing feed after new post');
            this.currentPage = 1; 
            this.hasMore = true; 
            this.posts = [];
            this.getFeed(); 
        },
    }
}
</script>