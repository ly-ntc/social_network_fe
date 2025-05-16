<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div class="main-left col-span-1">
            <div class="p-4 bg-white border border-gray-200 text-center rounded-lg">
                <img :src="user.avatar" class="mb-6 rounded-full">

                <p><strong>{{ user.name }}</strong></p>

                <div class="mt-6 flex space-x-8 justify-around" v-if="user.id">
                    <RouterLink :to="{ name: 'friends', params: { id: user.id } }" class="text-xs text-gray-500">{{
                        user.followers_count }} followers</RouterLink>
                    <p class="text-xs text-gray-500">{{ user.posts_count }} posts</p>
                </div>

                <div class="mt-6">
                    <button class="inline-block py-4 px-3 bg-purple-600 text-xs text-white rounded-lg mr-2"
                        @click="toggleFollow" v-if="userStore.user.id != user.id">
                        {{ isFollowing ? 'Unfollow' : 'Follow' }}
                    </button>

                    <button class="inline-block mt-4 py-4 px-3 bg-purple-600 text-xs text-white rounded-lg"
                        @click="sendDirectMessage" v-if="userStore.user.id != user.id">
                        Send direct message
                    </button>

                    <RouterLink class="inline-block mr-2 py-4 px-3 bg-purple-600 text-xs text-white rounded-lg"
                        to="/profile/edit" v-if="userStore.user.id == user.id">
                        Edit profile
                    </RouterLink>

                    <button class="inline-block py-4 px-3 bg-red-600 text-xs text-white rounded-lg" @click="logout"
                        v-if="userStore.user.id == user.id">
                        Log out
                    </button>
                </div>
            </div>
        </div>

        <div class="main-center col-span-2 space-y-4">
            <div class="bg-white border border-gray-200 rounded-lg" v-if="userStore.user.id == user.id">
                <FeedForm v-bind:user="user" v-bind:posts="posts" />
            </div>

            <div class="p-4 bg-white border border-gray-200 rounded-lg" v-for="post in posts" v-bind:key="post.id">
                <FeedItem v-bind:post="post" v-on:deletePost="deletePost" />
            </div>
        </div>

        <div class="main-right col-span-1 space-y-4">
            <PeopleYouMayKnow />

            <!-- <Trends /> -->
        </div>
    </div>
</template>

<style>
input[type="file"] {
    display: none;
}

.custom-file-upload {
    border: 1px solid #ccc;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
}
</style>

<script>
import axios from '../../stores/axios.js';
import PeopleYouMayKnow from '../../components/PeopleYouMayKnow.vue'
import Trends from '../../components/Trends.vue'
import FeedItem from '../../components/FeedItem.vue'
import FeedForm from '../../components/FeedForm.vue'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'

export default {
    name: 'FeedView',

    setup() {
        const userStore = useUserStore()
        const toastStore = useToastStore()

        return {
            userStore,
            toastStore
        }
    },

    components: {
        PeopleYouMayKnow,
        Trends,
        FeedItem,
        FeedForm
    },

    data() {
        return {
            posts: [],
            user: {
                id: ''
            },
            can_send_friendship_request: null,
            isFollowing: false,
        }
    },

    mounted() {
        this.getFeed();
        this.checkFollowingStatus();
    },

    watch: {
        '$route.params.id': {
            handler: function () {
                this.getFeed()
            },
            deep: true,
            immediate: true
        }
    },

    methods: {
        deletePost(id) {
            this.posts = this.posts.filter(post => post.id !== id)
        },
        checkFollowingStatus() {
            axios
                .get(`/api/is-following/${this.$route.params.id}`)
                .then(response => {
                    this.isFollowing = response.data.is_following; // Cập nhật trạng thái follow
                })
                .catch(error => {
                    console.log('Error checking following status:', error);
                });
        },
        sendDirectMessage() {
            // console.log('sendDirectMessage')

            axios
                .get(`/api/conversations/${this.$route.params.id}/get-or-create/`)
                .then(response => {
                    console.log(response.data)

                    this.$router.push('/chat')
                })
                .catch(error => {
                    console.log('error', error)
                })
        },

        sendFriendshipRequest() {
            axios
                .post(`/api/friends/${this.$route.params.id}/request/`)
                .then(response => {
                    console.log('data', response.data)

                    this.can_send_friendship_request = false

                    if (response.data.message == 'request already sent') {
                        this.toastStore.showToast(5000, 'The request has already been sent!', 'bg-red-300')
                    } else {
                        this.toastStore.showToast(5000, 'The request was sent!', 'bg-emerald-300')
                    }
                })
                .catch(error => {
                    console.log('error', error)
                })
        },

        getFeed() {
            axios
                .get(`/api/profile/${this.$route.params.id}/`)
                .then(response => {
                    // console.log('data', this.userStore.user.id, response.data.data.user.id)
                    if (this.userStore.user.id == response.data.data.user.id) {
                        console.log('same user')
                    }

                    this.posts = response.data.data.posts
                    this.user = response.data.data.user
                    this.can_send_friendship_request = response.data.data.can_send_friendship_request
                })
                .catch(error => {
                    console.log('error', error)
                })
        },

        logout() {
            console.log('Log out')

            this.userStore.removeToken()

            this.$router.push('/')
        },

        toggleFollow() {
            const apiEndpoint = this.isFollowing ? '/api/unfollow' : '/api/follow';

            axios
                .post(apiEndpoint, { user_id: this.$route.params.id })
                .then(response => {
                    if (this.isFollowing) {
                        this.toastStore.showToast(5000, 'Unfollowed successfully!', 'bg-red-300');
                    } else {
                        this.toastStore.showToast(5000, 'Followed successfully!', 'bg-emerald-300');
                    }

                    this.isFollowing = !this.isFollowing; // Cập nhật trạng thái follow
                })
                .catch(error => {
                    console.log('Error toggling follow status:', error);
                });
        }
    }
}
</script>